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
				var parsedResponse = self.responseParser(response.data);
				viewModel = parsedResponse.data;
				filteredItemCount = parsedResponse.totalResults;
				viewSettings = requestSettings;
				isRequestPending = false;
				isFirstRequestComplete = true;
				pendingRequestDeferred.resolve(response);
			}

			function errorCallback(response) {
				isRequestPending = false;
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

	this.$get = function($http, $timeout, $q) {
		return {
			create: function(resourceUrl) {
				return new ServerDataProvider(resourceUrl, $http, $timeout, $q, self.defaultViewSettings, self.debounceTime);
			}
		};
	};
});
