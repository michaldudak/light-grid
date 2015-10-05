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

function ServerDataProvider(resourceUrl, $http, $timeout, defaultViewSettings, debounceTime) {
	var viewSettings = angular.copy(defaultViewSettings);
	var viewModel = [];
	var filteredItemCount = 0;
	
	// debounce data
	var pendingRequest = null;
	var pendingRequestSettings = null;
	this.debounceTime = debounceTime;
	this.settingsSerializer = defaultSettingsSerializer;
	
	var self = this;

	function updateFilters(requestSettings) {
		if (!resourceUrl) {
			return;
		}
		
		if (!requestSettings) {
			requestSettings = viewSettings;
		} else {
			pendingRequestSettings = angular.extend({}, pendingRequestSettings, requestSettings);
			requestSettings = angular.extend({}, viewSettings, pendingRequestSettings);
		}
		
		var url = resourceUrl;
		
		if (!angular.isFunction(self.settingsSerializer)) {
			self.settingsSerializer = defaultSettingsSerializer;
		}
		
		if (!angular.isFunction(self.responseParser)) {
			self.responseParser = defaultResponseParser;
		}
		
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
		}
		
		function sendRequest() {
			$http.get(url).success(function(response) {
				var parsedResponse = self.responseParser(response);
				viewModel = parsedResponse.data;
				filteredItemCount = parsedResponse.totalResults;
				viewSettings = requestSettings;
			});
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
		var newLimitToSettings = angular.copy(viewSettings.limitTo);
		if (!!newLimitToSettings) {
			newLimitToSettings.begin = 0;
		}
		
		var requestSettings = {
			filter: {
				expression: expression
			},
			limitTo: newLimitToSettings
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
