/*!
 Light Grid 1.0.0-rc1 

 by Michał Dudak (http://dudak.me)
 https://github.com/michaldudak/light-grid.git
 license: MIT

 build date: 2017-08-09T20:06:53.781Z
*/

(function (window, angular) {

angular.module("lightGrid", []).constant("DEFAULT_VIEW", "default");


function getBlockNodes(nodes) {
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

	return angular.element(blockNodes);
}

angular.module("lightGrid").directive("lgGrid", function gridDirective() {
	"use strict";

	return {
		scope: true,
		controller: ["$scope", "$attrs", function lgGridController($scope, $attrs) {
			this.getModel = function getModel() {
				return $scope.grid.data;
			};
			
			this.getInitialView = function getInitialView() {
				return $attrs.initialView;
			};
			
			this.switchView = function switchView(viewName) {
				$scope.$parent.$broadcast("switchView:" + this.getIdentifier(), viewName);
			};
			
			this.getIdentifier = function getIedntifier() {
				return $scope.$$gridId;
			};
		}],
		require: "lgGrid",
		link: {
			pre: function lgGridLink($scope, $elem, $attrs, gridController) {
				$scope.$$gridId = Math.floor(Math.random() * 1000000);
				
				$scope.grid = {
					data: $scope.$eval($attrs.model),
					controller: gridController
				};
				
				$scope.$watch($attrs.model, function (newValue, oldValue) {
					if (newValue !== oldValue) {
						$scope.grid.data = newValue;
					}
				});
				
				$elem.addClass("light-grid");
			}
		}
	};
});


angular.module("lightGrid").directive("lgRow", ["$parse", "$animate", "DEFAULT_VIEW", function rowDirective($parse, $animate, DEFAULT_VIEW) {
	"use strict";

	/* Code based on Angular's ngRepeat: https://github.com/angular/angular.js/blob/master/src/ng/directive/ngRepeat.js */

	var NG_REMOVED = "$$NG_REMOVED";

	var updateScope = function(scope, index, valueIdentifier, value, arrayLength, rowController, gridController) {
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

	function RowController($scope) {
		var registeredViews = {};

		this.switchView = function (view) {
			$scope.row.view = view;
			$scope.row.viewModel = angular.copy($scope.row.data);
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
			var lgRowEndComment = document.createComment(" end lgRow ");

			var valueIdentifier = "$$rowData";
			var collectionIdentifier = "grid.data";

			var trackByIdObjFn = function identity(key) {
				return key;
			};

			return function lgRowLink($scope, $element, $attr, gridController, $transclude) {

				// Store a list of elements from previous run. This is a hash where key is the item from the
				// iterator, and the value is objects with following properties.
				// - scope: bound scope
				// - element: previous element.
				// - index: position
				// We are using no-proto object so that we don't need to guard against inherited props via
				// hasOwnProperty.
				var lastBlockMap = createMap();

				// watch props
				$scope.$watchCollection(collectionIdentifier, function lgRowWatchAction(collection) {
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
							throw new Error("Duplicate rows detected. The grid cannot render the same row twice. Use angular.copy to create a new instance. Duplicate value: " + value);
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
								$animate.move(getBlockNodes(block.clone), null, angular.element(previousNode));
							}
							previousNode = getBlockEnd(block);
							updateScope(block.scope, index, valueIdentifier, value, collectionLength, new RowController(block.scope), gridController);
						} else {
							/* jshint loopfunc:true */
							// new item which we don't know about
							$transclude(function lgRowTransclude(clone, scope) {
								block.scope = scope;
								// http://jsperf.com/clone-vs-createcomment
								var endNode = lgRowEndComment.cloneNode(false);
								clone[clone.length++] = endNode;

								// TODO(perf): support naked previousNode in `enter` to avoid creation of jqLite wrapper?
								$animate.enter(clone, null, angular.element(previousNode));
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
}]);


angular.module("lightGrid").directive("lgView", function () {
	"use strict";

	return {
		transclude: "element",
		priority: 600, // as ngIf
		link: function lgViewLink($scope, $elem, $attrs, ctrl, $transclude) {
			var viewNameExpression = $attrs.lgView || $attrs.view;
			var viewNames;

			if (!viewNameExpression) {
				viewNames = [];
			} else {
				viewNames = viewNameExpression.split(",").map(function (viewName) {
					return viewName.trim();
				});
			}

			viewNames.forEach(function (viewName) {
				$scope.row.controller.registerView(viewName);
			});

			$scope.shouldShowDefaultView = function (requestedViewName) {
				return !$scope.row.controller.isViewRegistered(requestedViewName);
			};

			var displayCondition;

			if (viewNames.length === 0) {
				displayCondition = "shouldShowDefaultView(row.view)";
			} else {
				displayCondition = viewNames.map(function (viewName) {
					return "row.view === '" + viewName + "'";
				}).join(" || ");
			}

			var placeholder = document.createComment("lgView");
			$elem.after(placeholder);

			var showing = false;
			var content = null;

			$scope.$watch(displayCondition, function lgViewWatchAction(shouldShow) {
				if (shouldShow && !showing) {
					$transclude(function (clone) {
						var $placeholder = angular.element(placeholder);
						$placeholder.parent()[0].insertBefore(clone[0], $placeholder[0]);
						content = clone;
					});
					showing = true;
				} else if (!shouldShow && showing) {
					content.remove();
					content = null;
					showing = false;
				}
			});
		}
	};
});


angular.module("lightGridDataProviders", ["lightGrid"]);


function LocalDataProvider(model, filterFilter, orderByFilter, limitToFilter, defaultViewSettings) {

	var viewSettings;
	var viewModel;
	var filteredItemCount;
	var originalModel = model;

	var DEFAULT_PAGE_SIZE = 10;

	function updateFilters() {
		viewModel = originalModel;

		if (viewSettings.filter) {
			viewModel = filterFilter(viewModel, viewSettings.filter.expression, viewSettings.filter.comparator);
		}

		if (viewSettings.orderBy) {
			viewModel = orderByFilter(viewModel, viewSettings.orderBy.expression, viewSettings.orderBy.reverse);
		}

		filteredItemCount = viewModel.length;

		if (viewSettings.limitTo) {
			if (viewSettings.limitTo.begin < 0) {
				viewSettings.limitTo.begin = 0;
			}

			if (viewSettings.limitTo.limit !== 0) {
				if (viewSettings.limitTo.begin) {
					if (viewSettings.limitTo.begin >= filteredItemCount) {
						viewSettings.limitTo.begin = 0;
					}
				}

				viewModel = limitToFilter(viewModel, viewSettings.limitTo.limit, viewSettings.limitTo.begin);
			}
		}
	}

	this.setModel = function (newModel) {
		originalModel = newModel;
		updateFilters();
	};

	this.getGridModel = function() {
		return viewModel;
	};

	this.getModelItemCount = function () {
		return filteredItemCount;
	};

	this.getCurrentViewSettings = function() {
		return viewSettings;
	};

	this.saveModel = function () {
		updateFilters();
	};

	this.orderBy = function (expression, reverse) {
		viewSettings.orderBy = {
			expression: expression,
			reverse: reverse
		};

		updateFilters();
	};

	this.limitTo = function (limit, begin) {
		if (limit === undefined || limit === null) {
			viewSettings.limitTo = null;
		} else {
			viewSettings.limitTo = {
				limit: limit,
				begin: begin || 0
			};
		}

		updateFilters();
	};

	this.page = function (pageIndex) {
		if (!viewSettings.limitTo || !viewSettings.limitTo.limit) {
			viewSettings.limitTo = {
				limit: DEFAULT_PAGE_SIZE
			};
		}

		viewSettings.limitTo.begin = viewSettings.limitTo.limit * pageIndex;
		updateFilters();
	};

	this.setPageSize = function (pageSize) {
		this.limitTo(pageSize, 0);
	};

	this.filter = function (expression, comparator) {
		viewSettings.filter = {
			expression: expression,
			comparator: comparator
		};

		updateFilters();
	};

	this.reset = function () {
		viewSettings = angular.copy(defaultViewSettings);
		updateFilters();
	};

	this.refresh = function () {
		updateFilters();
	};

	this.reset();
}

angular.module("lightGridDataProviders").provider("lgLocalDataProviderFactory", function () {

	var self = this;

	this.defaultViewSettings = {
		orderBy: null,
		limitTo: null,
		filter: null
	};

	this.$get = ["filterFilter", "orderByFilter", "limitToFilter", function(filterFilter, orderByFilter, limitToFilter) {
		return {
			create: function(localModel) {
				return new LocalDataProvider(localModel, filterFilter, orderByFilter, limitToFilter, self.defaultViewSettings);
			}
		};
	}];
});

function defaultSettingsSerializer(requestSettings) {
	var queryString = [];

	if (requestSettings.limitTo) {
		if (requestSettings.limitTo.limit) {
			queryString.push("limit=" + requestSettings.limitTo.limit);
		}

		if (requestSettings.limitTo.begin) {
			queryString.push("begin=" + requestSettings.limitTo.begin);
		}
	}

	if (requestSettings.orderBy && requestSettings.orderBy.expression) {
		queryString.push("orderBy=" + encodeURIComponent(requestSettings.orderBy.expression));

		if (requestSettings.orderBy.reverse) {
			queryString.push("reverse=true");
		}
	}

	if (requestSettings.filter && requestSettings.filter.expression) {
		var expression = requestSettings.filter.expression;
		if (angular.isString(expression)) {
			queryString.push("search=" + encodeURIComponent(expression));
		} else if (angular.isObject(expression)) {
			var searchQueryParts = [];
			for (var field in expression) {
				if (!expression.hasOwnProperty(field)) {
					continue;
				}

				var value = expression[field];
				searchQueryParts.push(encodeURIComponent(field) + ":" + encodeURIComponent(value));
			}

			queryString.push("search=" + searchQueryParts.join(","));
		}
	}

	return queryString.join("&");
}

function defaultResponseParser(serverResponse) {
	return serverResponse;
}

function defaultSuccessHandler(serverResponse) {
	return serverResponse;
}

function defaultErrorHandler() {
	return;
}

function ServerDataProvider(resourceUrl, $http, $timeout, $q, defaultViewSettings, debounceTime) {
	var viewSettings = angular.copy(defaultViewSettings);
	var viewModel = [];
	var filteredItemCount = 0;

	var DEFAULT_PAGE_SIZE = 10;

	// debounce data
	var pendingRequest = null;
	var pendingRequestSettings = null;
	var isRequestPending = false;
	var isFirstRequestComplete = false;
	var pendingRequestDeferred = null;

	this.debounceTime = debounceTime;
	this.settingsSerializer = defaultSettingsSerializer;

	var self = this;

	function ensureHandlerFunctionsDefined() {
		if (!angular.isFunction(self.settingsSerializer)) {
			self.settingsSerializer = defaultSettingsSerializer;
		}

		if (!angular.isFunction(self.responseParser)) {
			self.responseParser = defaultResponseParser;
		}

		if (!angular.isFunction(self.errorHandler)) {
			self.errorHandler = defaultErrorHandler;
		}

		if (!angular.isFunction(self.successHandler)) {
			self.successHandler = defaultSuccessHandler;
		}
	}

	function updateFilters(requestSettings) {
		if (!resourceUrl) {
			throw new Error("resourceUrl was not set");
		}

		if (!requestSettings) {
			requestSettings = viewSettings;
		} else {
			pendingRequestSettings = angular.extend({}, pendingRequestSettings, requestSettings);
			requestSettings = angular.extend({}, viewSettings, pendingRequestSettings);
		}

		var url = resourceUrl;

		ensureHandlerFunctionsDefined();

		var queryString = self.settingsSerializer(requestSettings);
		if (queryString.length > 0) {
			if (url.indexOf("?") === -1) {
				url += "?";
			} else {
				url += "&";
			}

			url += queryString;
		}

		if (pendingRequest !== null) {
			$timeout.cancel(pendingRequest);
			pendingRequest = null;
		} else {
			pendingRequestDeferred = $q.defer();
		}

		if (self.debounceTime) {
			pendingRequest = $timeout(function() {
				pendingRequest = null;
				pendingRequestSettings = null;
				sendRequest();
			}, self.debounceTime);
		} else {
			sendRequest();
		}

		return pendingRequestDeferred.promise;

		function sendRequest() {
			isRequestPending = true;
			$http.get(url).then(successCallback, errorCallback);

			function successCallback(response) {
				var transformedResponse = self.successHandler(response);
				if (!transformedResponse) {
					throw new Error("successCallback did not return any value. Did you forget to return the modified value?");
				}

				var parsedResponse = self.responseParser(transformedResponse.data);
				viewModel = parsedResponse.data;
				filteredItemCount = parsedResponse.totalResults;
				viewSettings = requestSettings;
				isRequestPending = false;
				isFirstRequestComplete = true;
				pendingRequestDeferred.resolve(transformedResponse);
			}

			function errorCallback(response) {
				isRequestPending = false;
				self.errorHandler(response);
				pendingRequestDeferred.reject(response);
			}
		}
	}

	this.isRequestPending = function () {
		return isRequestPending;
	};

	this.hasResults = function () {
		return viewModel && viewModel.length > 0;
	};

	this.hasNoResults = function () {
		return viewModel &&	viewModel.length === 0 && !this.isRequestPending() && isFirstRequestComplete;
	};

	this.getGridModel = function () {
		return viewModel;
	};

	this.getModelItemCount = function () {
		return filteredItemCount;
	};

	this.getCurrentViewSettings = function() {
		return viewSettings;
	};

	this.saveModel = function (model) {
		return $http.post(resourceUrl, model);
	};

	this.orderBy = function (expression, reverse) {
		var requestSettings = {
			orderBy: {
				expression: expression,
				reverse: reverse || false
			}
		};

		return updateFilters(requestSettings);
	};

	this.limitTo = function (limit, begin) {
		var requestSettings = {};

		if (limit === undefined || limit === null) {
			requestSettings.limitTo = null;
		} else {
			requestSettings.limitTo = {
				limit: limit,
				begin: begin || 0
			};
		}

		return updateFilters(requestSettings);
	};

	this.page = function (pageIndex) {
		if (!viewSettings.limitTo || !viewSettings.limitTo.limit) {
			viewSettings.limitTo = {
				limit: DEFAULT_PAGE_SIZE
			};
		}

		viewSettings.limitTo.begin = viewSettings.limitTo.limit * pageIndex;
		return updateFilters();
	};

	this.setPageSize = function (pageSize) {
		return this.limitTo(pageSize, 0);
	};

	this.filter = function (expression) {
		var requestSettings = {
			filter: {
				expression: expression
			}
		};

		var newLimitToSettings = angular.copy(viewSettings.limitTo);
		if (!!newLimitToSettings) {
			newLimitToSettings.begin = 0;
			requestSettings.limitTo = newLimitToSettings;
		}

		return updateFilters(requestSettings);
	};

	this.setViewSettings = function(requestSettings) {
		return updateFilters(requestSettings);
	};

	this.refresh = function () {
		return updateFilters();
	};

	this.reset = function () {
		viewSettings = angular.copy(defaultViewSettings);
		return updateFilters();
	};
}

angular.module("lightGridDataProviders").provider("lgServerDataProviderFactory", function () {

	var self = this;

	this.defaultViewSettings = {
		orderBy: null,
		limitTo: null,
		filter: null
	};

	this.debounceTime = 150;

	this.$get = ["$http", "$timeout", "$q", function($http, $timeout, $q) {
		return {
			create: function(resourceUrl) {
				return new ServerDataProvider(resourceUrl, $http, $timeout, $q, self.defaultViewSettings, self.debounceTime);
			}
		};
	}];
});


angular.module("lightGridControls", ["lightGrid"]);


angular.module("lightGridControls").directive("lgExpandedRow", ["$animate", function ($animate) {
	"use strict";

	/* Code based on Angular's ngIf directive: https://github.com/angular/angular.js/blob/master/src/ng/directive/ngIf.js */
	return {
		multiElement: true,
		transclude: "element",
		priority: 600,
		terminal: true,
		restrict: "A",
		require: "^?lgRow",
		$$tlb: true,
		link: function lgExpandedRowLink ($scope, $element, $attr, ctrl, $transclude) {
			var block;
			var childScope;
			var previousElements;
			
			$scope.$watch("row.expanded", function lgExpandedRowWatchAction(shouldBeVisible) {
				if (shouldBeVisible) {
					if (!childScope) {
						$transclude(function(clone, newScope) {
							childScope = newScope;
							clone[clone.length++] = document.createComment(" end lgExpandedRow ");
							// Note: We only need the first/last node of the cloned nodes.
							// However, we need to keep the reference to the jqlite wrapper as it might be changed later
							// by a directive with templateUrl when its template arrives.
							block = {
								clone: clone
							};
							
							$animate.enter(clone, $element.parent(), $element);
						});
					}
				} else {
					if (previousElements) {
						previousElements.remove();
						previousElements = null;
					}
					
					if (childScope) {
						childScope.$destroy();
						childScope = null;
					}
					
					if (block) {
						previousElements = getBlockNodes(block.clone);
						$animate.leave(previousElements).then(function () {
							previousElements = null;
						});
						
						block = null;
					}
				}
			});
		}
	};
}]);

angular.module("lightGridControls").directive("lgPager", function () {
	"use strict";

	return {
		scope: {
			provider: "="
		},
		template: "<div class='pager'>" +
			"<button ng-disabled='isFirst' class='first' ng-click='goToFirst()'>First</button>" +
			"<button ng-disabled='isFirst' class='previous' ng-click='goToPrevious()'>Previous</button>" +
			"<span class='pager-summary'>Page {{currentPage + 1}} of {{pageCount}}</span>" +
			"<button ng-disabled='isLast' class='next' ng-click='goToNext()'>Next</button>" +
			"<button ng-disabled='isLast' class='last' ng-click='goToLast()'>Last</button>" +
			"</div>",
		link: function pagerLink($scope) {
			var pageSize;

			$scope.$watch("provider", function (newProvider) {
				if (!newProvider) {
					return;
				}

				update(newProvider.getCurrentViewSettings().limitTo);
				goToPage(0);
			});

			function calculateCurrentPage(currentIndex, pageSize, totalItemCount) {
				if (totalItemCount === 0) {
					return -1;
				}

				return Math.floor(currentIndex / pageSize);
			}

			function calculatePageCount(pageSize, totalSize) {
				return Math.ceil(totalSize / pageSize);
			}

			function update(limitToSettings) {
				var totalItemCount = $scope.provider.getModelItemCount();

				if (!limitToSettings) {
					$scope.currentPage = 0;
					$scope.pageCount = 1;
					pageSize = 1;
				} else {
					$scope.currentPage = calculateCurrentPage(limitToSettings.begin, limitToSettings.limit, totalItemCount);
					$scope.pageCount = calculatePageCount(limitToSettings.limit, totalItemCount);
					pageSize = limitToSettings.limit;
				}

				$scope.isFirst = $scope.currentPage <= 0;
				$scope.isLast = $scope.currentPage >= $scope.pageCount - 1;
			}

			function goToPage(pageNumber) {
				if (pageNumber < 0) {
					pageNumber = 0;
				} else if (pageNumber >= $scope.pageCount) {
					pageNumber = $scope.pageCount - 1;
				}

				$scope.provider.page(pageNumber);
			}

			$scope.$watch("provider.getCurrentViewSettings().limitTo", function (limitToSettings) {
				update(limitToSettings);
			}, true);

			$scope.$watch("provider.getModelItemCount()", function () {
				update($scope.provider.getCurrentViewSettings().limitTo);
			});

			$scope.goToFirst = function () {
				goToPage(0);
			};

			$scope.goToPrevious = function () {
				goToPage($scope.currentPage - 1);
			};

			$scope.goToNext = function () {
				goToPage($scope.currentPage + 1);
			};

			$scope.goToLast = function () {
				goToPage($scope.pageCount - 1);
			};
		}
	};
});


angular.module("lightGridControls").directive("lgPageSizeOptions", ["$window", function ($window) {
	"use strict";

	return {
		scope: {
			provider: "=",
			pageSizeOptions: "=?options"
		},
		template: "<div class='page-size'>" +
			"<select class='form-control' ng-options='size for size in pageSizeOptions' ng-model='pageSize' ng-change='pageSizeChanged()'></select>" +
			"</div>",
		link: function pageSizeOptionsLink($scope) {
			var DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50];
			$scope.pageSizeOptions = $scope.pageSizeOptions || DEFAULT_PAGE_SIZE_OPTIONS;

			$scope.$watch("provider", function (newProvider) {
				if (!newProvider) {
					return;
				}

				$scope.pageSize = newProvider.getCurrentViewSettings().limitTo && newProvider.getCurrentViewSettings().limitTo.limit;
				appendPotentiallyMissingPageSizeToOptions($scope.pageSize);
			});

			$scope.pageSizeChanged = function () {
				appendPotentiallyMissingPageSizeToOptions($scope.pageSize);
				$scope.provider.setPageSize($scope.pageSize);
			};

			$scope.$watchCollection("pageSizeOptions", function validatePageSizeOptions() {
				var valid = true;

				if (!angular.isArray($scope.pageSizeOptions)) {
					valid = false;
				}

				if (valid && $scope.pageSizeOptions.length <= 0) {
					valid = false;
				}

				if (valid && !$scope.pageSizeOptions.every(function (item) {
					return angular.isNumber(item);
				})) {
					valid = false;
				}

				if (!valid) {
					$window.console.warn("Page size options are incorrect, using default values", $scope.pageSizeOptions);
					$scope.pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS;
				}

				appendPotentiallyMissingPageSizeToOptions($scope.pageSize);
			});

			$scope.$watch("provider.getCurrentViewSettings().limitTo.limit", function (newLimit) {
				appendPotentiallyMissingPageSizeToOptions(newLimit);
				$scope.pageSize = newLimit;
			});

			function appendPotentiallyMissingPageSizeToOptions(value) {
				if (!angular.isNumber(value) || value === null || !angular.isDefined(value)) {
					return;
				}

				if ($scope.pageSizeOptions.indexOf(value) === -1) {
					$scope.pageSizeOptions.push(value);
					$scope.pageSizeOptions = $scope.pageSizeOptions.sort(function (a, b) {
						return a - b;
					});
				}
			}
		}
	};
}]);

angular.module("lightGridControls").directive("lgPersistData", ["$q", "DEFAULT_VIEW", function ($q, DEFAULT_VIEW) {
	"use strict";

	return {
		restrict: "A",
		link: function persistDataLink($scope, $elem, $params) {
			$elem.on("click", function () {
				var dataProvider = $scope.$eval($params.provider);
				var rowController = $scope.row.controller;

				$q.when(dataProvider.saveModel($scope.viewData))
					.then(function () {
						if (rowController) {
							rowController.acceptViewModel();
							rowController.switchView(DEFAULT_VIEW);
						}
					});
			});
		}
	};
}]);


angular.module("lightGridControls").directive("lgSorter", ["$timeout", function ($timeout) {
	"use strict";

	return {
		template: "<span class='sorter {{ cssClass }}'><span ng-transclude class='columnTitle'></span></span>",
		transclude: true,
		replace: true,
		scope: {
			dataProvider: "=provider"
		},
		link: function sorterLink($scope, $elem, $attrs) {
			var sortProperty = $attrs.sortProperty || $attrs.lgSorter;

			function updateCssClass() {
				if (!$scope.isSorted) {
					$scope.cssClass = "";
				} else {
					$scope.cssClass = $scope.sortDirectionDescending ? "sorter-desc" : "sorter-asc";
				}
			}

			$scope.isSorted = false;
			$scope.sortDirectionDescending = true;

			$elem.on("click", function () {
				$timeout(function () {
					$scope.dataProvider.orderBy(sortProperty, !$scope.sortDirectionDescending);
				});
			});

			$scope.$watch("dataProvider.getCurrentViewSettings().orderBy", function (sortSettings) {
				if (!sortSettings) {
					$scope.isSorted = false;
					$scope.sortDirectionDescending = true;
				} else {
					$scope.isSorted = sortProperty === sortSettings.expression;
					$scope.sortDirectionDescending = $scope.isSorted ? sortSettings.reverse : true;
				}

				updateCssClass();
			});
		}
	};
}]);


angular.module("lightGridControls").directive("lgSwitchView", ["$timeout", function ($timeout) {
	"use strict";

	return {
		restrict: "A",
		link: function switchViewLink(scope, elem, attrs) {
			var viewName = attrs.lgSwitchView;

			elem.on("click", function () {
				$timeout(function () {
					scope.row.controller.switchView(viewName);
				});
			});
		}
	};
}]);


angular.module("lightGridControls").directive("lgToggleExpandedRow", ["$timeout", function ($timeout) {
	"use strict";

	return {
		require: "^?lgRow",
		restrict: "A",
		link: function toggleExpandedRowLink($scope, $elem) {

			$elem.on("click", function () {
				$timeout(function () {
					$scope.row.expanded = !$scope.row.expanded;
				});
			});
		}
	};
}]);

}(window, window.angular));