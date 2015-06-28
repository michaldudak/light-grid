function ServerDataProvider(resourceUrl, $http, $timeout, defaultViewSettings, debounceTime) {

	var viewSettings = angular.copy(defaultViewSettings);
	var viewModel = [];
	var filteredItemCount = 0;
	var pendingRequest = null;
	this.debounceTime = debounceTime;

	function updateFilters(requestSettings) {
		if (!resourceUrl) {
			return;
		}
		
		if (!requestSettings) {
			requestSettings = viewSettings;
		} else {
			requestSettings = angular.extend({}, viewSettings, requestSettings);
		}
		
		var url = resourceUrl;
		
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
			queryString.push("search=" + encodeURIComponent(requestSettings.filter.expression));
		}
		
		if (queryString.length > 0) {
			if (url.indexOf("?") === -1) {
				url += "?";
			} else {
				url += "&";
			}
			
			url += queryString.join("&");
		}
		
		if (pendingRequest !== null) {
			$timeout.cancel(pendingRequest);
			pendingRequest = null;
		}
		
		pendingRequest = $timeout(function() {
			pendingRequest = null;
			$http.get(url).success(function(response) {
				viewModel = response.data;
				filteredItemCount = response.totalResults;
				viewSettings = requestSettings;
			});
		}, this.debounceTime);
	}

	this.getGridModel = function() {
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

		updateFilters(requestSettings);
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

		updateFilters(requestSettings);
	};

	this.filter = function (expression) {
		var requestSettings = {
			filter: {
				expression: expression
			}
		};

		updateFilters(requestSettings);
	};
	
	this.setViewSettings = function(requestSettings) {
		updateFilters(requestSettings);
	};

	this.refresh = function () {
		updateFilters();
	};

	this.reset = function () {
		viewSettings = angular.copy(defaultViewSettings);
		updateFilters();
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

	this.$get = function($http, $timeout) {
		return {
			create: function(resourceUrl) {
				return new ServerDataProvider(resourceUrl, $http, $timeout, self.defaultViewSettings, self.debounceTime);
			}
		};
	};
});
