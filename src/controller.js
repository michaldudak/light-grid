grid.controller = ["$scope", "$element", function GridController($scope, $element) {
	
	var dataProviderController = null;
	$scope.columnDefinitions = [];

	this.getData = function getData() {
		return $scope.data;
	};

	this.setData = function setData(newData) {
		$scope.data = newData;
	};

	this.defineColumn = function(column) {
		$scope.columnDefinitions.push(column);
	};

	this.redraw = function() {
		console.log("Redrawing table");
		var tableElement = grid.tableRenderer.renderTable($scope);
		$element.empty().append(tableElement.children());
	};

	this.registerDataProvider = function(dataProvider) {
		dataProviderController = dataProvider;
	};

	this.switchView = function(viewName, rowId) {
		if (typeof(rowId) === "undefined") {
			$scope.view = viewName;
		} else {
			$scope.rowScopes[rowId].view = viewName;
		}
	};
}];
