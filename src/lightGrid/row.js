angular.module("lightGrid").directive("lgRow", function rowDirective($parse, $animate, DEFAULT_VIEW) {
	"use strict";

	var NG_REMOVED = "$$NG_REMOVED";
	var ngRepeatMinErr = angular.$$minErr("lgRow");

	var updateScope = function(scope, index, valueIdentifier, value, arrayLength, rowController, gridController) {
		// TODO(perf): generate setters to shave off ~40ms or 1-1.5%
		scope[valueIdentifier] = value;

		scope.$index = index;
		scope.$first = (index === 0);
		scope.$last = (index === (arrayLength - 1));
		scope.$middle = !(scope.$first || scope.$last);
		// jshint bitwise: false
		scope.$odd = !(scope.$even = (index & 1) === 0);
		// jshint bitwise: true

		scope.row = {
			data: scope.$$rowData,
			view: gridController.getInitialView() || DEFAULT_VIEW,
			viewModel: angular.copy(scope.$$rowData),
			controller: rowController
		};

		scope.$on("switchView:" + gridController.getIdentifier(), function (e, viewName) {
			rowController.switchView(viewName);
		});
	};

	var getBlockStart = function(block) {
		return block.clone[0];
	};

	var getBlockEnd = function(block) {
		return block.clone[block.clone.length - 1];
	};

	function createMap() {
		return Object.create(null);
	}

	function getBlockNodes(nodes) {
		// TODO(perf): just check if all items in `nodes` are siblings and if they are return the original
		// collection, otherwise update the original collection.

		var node = nodes[0];
		var endNode = nodes[nodes.length - 1];
		var blockNodes = [node];

		do {
			node = node.nextSibling;
			if (!node) {
				break;
			}
			blockNodes.push(node);
		} while (node !== endNode);

		return $(blockNodes);
	}

	function RowController($scope) {
		var registeredViews = {};

		this.switchView = function (view) {
			$scope.row.view = view;
		};

		this.acceptViewModel = function () {
			angular.extend($scope.row.data, $scope.row.viewModel);
		};

		this.registerView = function (viewName) {
			registeredViews[viewName] = true;
		};

		this.isViewRegistered = function (viewName) {
			return !!registeredViews[viewName];
		};
	}

	return {
		restrict: "A",
		multiElement: true,
		transclude: "element",
		priority: 1000,
		terminal: true,
		$$tlb: true,
		require: "^lgGrid",
		compile: function lgRowCompile() {
			var expression = "$$rowData in grid.data";
			var ngRepeatEndComment = document.createComment(" end ngRow ");

			var lhs = "$$rowData";
			var rhs = "grid.data";

			var valueIdentifier = lhs;

			var trackByIdObjFn = function(key) {
				return key;
			};

			return function ngRepeatLink($scope, $element, $attr, gridController, $transclude) {

				// Store a list of elements from previous run. This is a hash where key is the item from the
				// iterator, and the value is objects with following properties.
				// - scope: bound scope
				// - element: previous element.
				// - index: position
				// We are using no-proto object so that we don't need to guard against inherited props via
				// hasOwnProperty.
				var lastBlockMap = createMap();

				// watch props
				$scope.$watchCollection(rhs, function ngRepeatAction(collection) {
					var index,
						length,
						previousNode = $element[0], // node that cloned nodes should be inserted after
						                            // initialized to the comment node anchor
						nextNode,
						// Same as lastBlockMap but it has the current state. It will become the
						// lastBlockMap on the next iteration.
						nextBlockMap = createMap(),
						collectionLength,
						key, value, // key/value of iteration
						trackById,
						trackByIdFn,
						collectionKeys,
						block,			 // last object information {scope, element, id}
						nextBlockOrder,
						elementsToRemove;

					trackByIdFn = trackByIdObjFn;

					// if object, extract keys, in enumeration order, unsorted
					collectionKeys = [];
					for (var itemKey in collection) {
						if (collection.hasOwnProperty(itemKey) && itemKey.charAt(0) !== "$") {
							collectionKeys.push(itemKey);
						}
					}

					collectionLength = collectionKeys.length;
					nextBlockOrder = new Array(collectionLength);

					function restoreLastBlockMap(block) {
						if (block && block.scope) {
							lastBlockMap[block.id] = block;
						}
					}

					// locate existing items
					for (index = 0; index < collectionLength; index++) {
						key = (collection === collectionKeys) ? index : collectionKeys[index];
						value = collection[key];
						trackById = trackByIdFn(key, value, index);
						if (lastBlockMap[trackById]) {
							// found previously seen block
							block = lastBlockMap[trackById];
							delete lastBlockMap[trackById];
							nextBlockMap[trackById] = block;
							nextBlockOrder[index] = block;
						} else if (nextBlockMap[trackById]) {
							// if collision detected restore lastBlockMap and throw an error
							angular.forEach(nextBlockOrder, restoreLastBlockMap);
							throw ngRepeatMinErr("dupes", "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}, Duplicate value: {2}", expression, trackById, value);
						} else {
							// new never before seen block
							nextBlockOrder[index] = { id: trackById, scope: undefined, clone: undefined };
							nextBlockMap[trackById] = true;
						}
					}

					/* jshint forin:false */
					// remove leftover items
					for (var blockKey in lastBlockMap) {
						block = lastBlockMap[blockKey];
						elementsToRemove = getBlockNodes(block.clone);
						$animate.leave(elementsToRemove);
						if (elementsToRemove[0].parentNode) {
							// if the element was not removed yet because of pending animation, mark it as deleted
							// so that we can ignore it later

							length = elementsToRemove.length;
							for (index = 0; index < length; index++) {
								elementsToRemove[index][NG_REMOVED] = true;
							}
						}
						block.scope.$destroy();
					}
					/* jshint forin:true */

					// we are not using forEach for perf reasons (trying to avoid #call)
					for (index = 0; index < collectionLength; index++) {
						key = (collection === collectionKeys) ? index : collectionKeys[index];
						value = collection[key];
						block = nextBlockOrder[index];

						if (block.scope) {
							// if we have already seen this object, then we need to reuse the
							// associated scope/element

							nextNode = previousNode;

							// skip nodes that are already pending removal via leave animation
							do {
								nextNode = nextNode.nextSibling;
							} while (nextNode && nextNode[NG_REMOVED]);

							if (getBlockStart(block) !== nextNode) {
								// existing item which got moved
								$animate.move(getBlockNodes(block.clone), null, $(previousNode));
							}
							previousNode = getBlockEnd(block);
							updateScope(block.scope, index, valueIdentifier, value, collectionLength, new RowController(block.scope), gridController);
						} else {
							/* jshint loopfunc:true */
							// new item which we don't know about
							$transclude(function ngRepeatTransclude(clone, scope) {
								block.scope = scope;
								// http://jsperf.com/clone-vs-createcomment
								var endNode = ngRepeatEndComment.cloneNode(false);
								clone[clone.length++] = endNode;

								// TODO(perf): support naked previousNode in `enter` to avoid creation of jqLite wrapper?
								$animate.enter(clone, null, $(previousNode));
								previousNode = endNode;
								// Note: We only need the first/last node of the cloned nodes.
								// However, we need to keep the reference to the jqlite wrapper as it might be changed later
								// by a directive with templateUrl when its template arrives.
								block.clone = clone;
								nextBlockMap[block.id] = block;
								updateScope(block.scope, index, valueIdentifier, value, collectionLength, new RowController(block.scope), gridController);
							});
							/* jshint loopfunc:false */
						}
					}
					lastBlockMap = nextBlockMap;
				});
			};
		}
	};
});
