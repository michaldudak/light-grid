describe("Server data provider", function() {
	"use strict";

	var $timeout;
	var $httpBackend;
	var providerFactory;
	var dataProvider;
	var testResourceUrl = "http://site.com/my-resource";
	var responseStub = {
		data: [{ id: 1 }],
		totalResults: 14
	};

	beforeEach(function () {
		module("lightGridDataProviders");
	});

	beforeEach(inject(function (_$timeout_, _$httpBackend_, lgServerDataProviderFactory) {
		$timeout = _$timeout_;
		$httpBackend = _$httpBackend_;
		providerFactory = lgServerDataProviderFactory;
		dataProvider = providerFactory.create(testResourceUrl);
	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	describe("when viewSettings are set to their defaults", function() {
		it("should not have search, order or paging options applied", function() {
			var viewSettings = dataProvider.getCurrentViewSettings();

			expect(viewSettings.filter).toBe(null);
			expect(viewSettings.orderBy).toBe(null);
			expect(viewSettings.limitTo).toBe(null);
		});

		it("should issue a GET request to the specified URL without adding query string", function() {
			$httpBackend.expectGET(testResourceUrl).respond(responseStub);
			dataProvider.refresh();
			$timeout.flush();
			$httpBackend.flush();
		});

		it("should make the returned data available via the getGridModel method", function() {
			$httpBackend.whenGET(testResourceUrl).respond(responseStub);
			dataProvider.refresh();
			$timeout.flush();
			$httpBackend.flush();

			expect(dataProvider.getGridModel()).toEqual(responseStub.data);
		});

		it("should make the returned record count available via the getModelItemCount method", function() {
			$httpBackend.whenGET(testResourceUrl).respond(responseStub);
			dataProvider.refresh();
			$timeout.flush();
			$httpBackend.flush();

			expect(dataProvider.getModelItemCount()).toEqual(responseStub.totalResults);
		});
	});

	describe("#limitTo", function() {
		describe("with limit parameter only", function() {
			it("should issue a GET request with a proper query string", function() {
				$httpBackend.expectGET(testResourceUrl + "?limit=15").respond(responseStub);
				dataProvider.limitTo(15);
				$timeout.flush();
				$httpBackend.flush();
			});

			it("should return a promise and resolve it when the response is received", function() {
				$httpBackend.whenGET(testResourceUrl + "?limit=15").respond(responseStub);
				var promiseWasResolved = false;
				var promise = dataProvider.limitTo(15);
				promise.then(function () {
					promiseWasResolved = true;
				});

				expect(promiseWasResolved).toBe(false);

				$timeout.flush();
				$httpBackend.flush();

				expect(promiseWasResolved).toBe(true);
			});

			it("should persist the settings after the response is received", function() {
				$httpBackend.whenGET(testResourceUrl + "?limit=15").respond(responseStub);
				dataProvider.limitTo(15);
				var viewSettings = dataProvider.getCurrentViewSettings();
				expect(viewSettings.limitTo).toBe(null);

				$timeout.flush();
				$httpBackend.flush();

				viewSettings = dataProvider.getCurrentViewSettings();
				expect(viewSettings.limitTo.limit).toBe(15);
				expect(viewSettings.limitTo.begin).toBe(0);
			});
		});

		describe("with both limit and begin parameters", function() {
			it("should issue a GET request with a proper query string", function() {
				$httpBackend.expectGET(testResourceUrl + "?limit=15&begin=20").respond(responseStub);
				dataProvider.limitTo(15, 20);
				$timeout.flush();
				$httpBackend.flush();
			});

			it("should persist the settings after the response is received", function() {
				$httpBackend.whenGET(testResourceUrl + "?limit=15&begin=20").respond(responseStub);
				dataProvider.limitTo(15, 20);
				var viewSettings = dataProvider.getCurrentViewSettings();
				expect(viewSettings.limitTo).toBe(null);

				$timeout.flush();
				$httpBackend.flush();

				viewSettings = dataProvider.getCurrentViewSettings();
				expect(viewSettings.limitTo.limit).toBe(15);
				expect(viewSettings.limitTo.begin).toBe(20);
			});
		});

		describe("with limit set to 0 and begin set to more than 0", function() {
			it("should issue a GET request with a proper query string", function() {
				$httpBackend.expectGET(testResourceUrl + "?begin=20").respond(responseStub);
				dataProvider.limitTo(0, 20);
				$timeout.flush();
				$httpBackend.flush();
			});
		});
	});

	describe("#orderBy", function() {
		describe("with expression parameter only", function() {
			it("should issue a GET request with a proper query string", function() {
				$httpBackend.expectGET(testResourceUrl + "?orderBy=foo").respond(responseStub);
				dataProvider.orderBy("foo");
				$timeout.flush();
				$httpBackend.flush();
			});

			it("should persist the settings after the response is received", function() {
				$httpBackend.whenGET(testResourceUrl + "?orderBy=foo").respond(responseStub);
				dataProvider.orderBy("foo");
				var viewSettings = dataProvider.getCurrentViewSettings();
				expect(viewSettings.orderBy).toBe(null);

				$timeout.flush();
				$httpBackend.flush();

				viewSettings = dataProvider.getCurrentViewSettings();
				expect(viewSettings.orderBy.expression).toBe("foo");
				expect(viewSettings.orderBy.reverse).toBe(false);
			});
		});

		describe("with both limit and begin parameters", function() {
			it("should issue a GET request with a proper query string", function() {
				$httpBackend.expectGET(testResourceUrl + "?orderBy=foo&reverse=true").respond(responseStub);
				dataProvider.orderBy("foo", true);
				$timeout.flush();
				$httpBackend.flush();
			});

			it("should persist the settings after the response is received", function() {
				$httpBackend.whenGET(testResourceUrl + "?orderBy=foo&reverse=true").respond(responseStub);
				dataProvider.orderBy("foo", true);
				var viewSettings = dataProvider.getCurrentViewSettings();
				expect(viewSettings.orderBy).toBe(null);

				$timeout.flush();
				$httpBackend.flush();

				viewSettings = dataProvider.getCurrentViewSettings();
				expect(viewSettings.orderBy.expression).toBe("foo");
				expect(viewSettings.orderBy.reverse).toBe(true);
			});
		});
	});

	describe("#filter", function() {
		describe("with expression parameter as a string", function() {
			it("should issue a GET request with a proper query string", function() {
				$httpBackend.expectGET(testResourceUrl + "?search=foo").respond(responseStub);
				dataProvider.filter("foo");
				$timeout.flush();
				$httpBackend.flush();
			});

			it("should persist the settings after the response is received", function() {
				$httpBackend.whenGET(testResourceUrl + "?search=foo").respond(responseStub);
				dataProvider.filter("foo");
				var viewSettings = dataProvider.getCurrentViewSettings();
				expect(viewSettings.filter).toBe(null);

				$timeout.flush();
				$httpBackend.flush();

				viewSettings = dataProvider.getCurrentViewSettings();
				expect(viewSettings.filter.expression).toBe("foo");
			});

			// issue #3
			it("should remove the page constraint from the query", function () {
				$httpBackend.whenGET(testResourceUrl + "?limit=10&begin=3").respond(responseStub);

				dataProvider.setViewSettings({
					limitTo: {
						limit: 10,
						begin: 3
					}
				});

				$timeout.flush();
				$httpBackend.flush();

				$httpBackend.expectGET(testResourceUrl + "?limit=10&search=foo").respond(responseStub);
				dataProvider.filter("foo");

				$timeout.flush();
				$httpBackend.flush();

				var viewSettings = dataProvider.getCurrentViewSettings();
				expect(viewSettings.limitTo.begin).toBe(0);
				expect(viewSettings.limitTo.limit).toBe(10);
			});
		});

		describe("with expression parameter as an object", function() {
			it("should issue a GET request with a proper query string", function() {
				$httpBackend.expectGET(testResourceUrl + "?search=id:42,name:a").respond(responseStub);
				dataProvider.filter({ id: 42, name: "a" });
				$timeout.flush();
				$httpBackend.flush();
			});
		});
	});

	describe("#setViewSettings", function() {
		describe("with custom settings object", function() {
			it("should issue a GET request with a proper query string", function() {
				$httpBackend.expectGET(testResourceUrl + "?limit=10&begin=20&orderBy=id&reverse=true&search=foo").respond(responseStub);

				var customSettings = {
					orderBy: {
						expression: "id",
						reverse: true
					},
					limitTo: {
						limit: 10,
						begin: 20
					},
					filter: {
						expression: "foo"
					}
				};

				dataProvider.setViewSettings(customSettings);
				$timeout.flush();
				$httpBackend.flush();
			});
		});
	});

	describe("#reset", function() {
		it("should reset view settings to their defaults", function() {
			$httpBackend.whenGET(testResourceUrl + "?search=foo").respond(responseStub);

			dataProvider.filter("foo");
			$timeout.flush();
			$httpBackend.flush();

			$httpBackend.expectGET(testResourceUrl).respond(responseStub);

			dataProvider.reset();
			$timeout.flush();
			$httpBackend.flush();

			var viewSettings = dataProvider.getCurrentViewSettings();
			expect(viewSettings.filter).toBe(null);
			expect(viewSettings.orderBy).toBe(null);
			expect(viewSettings.limitTo).toBe(null);
		});
	});

	describe("subsequent calls", function() {
		describe("if placed after the debounce threshold", function() {
			it("should add up instead of overwriting view settings", function() {
				$httpBackend.whenGET(testResourceUrl + "?search=foo").respond(responseStub);

				dataProvider.filter("foo");
				$timeout.flush();
				$httpBackend.flush();

				$httpBackend.expectGET(testResourceUrl + "?orderBy=id&search=foo").respond(responseStub);

				dataProvider.orderBy("id");
				$timeout.flush();
				$httpBackend.flush();

				var viewSettings = dataProvider.getCurrentViewSettings();
				expect(viewSettings.filter.expression).toBe("foo");
				expect(viewSettings.orderBy.expression).toBe("id");
			});

			it("should return different promises for both calls", function () {
				$httpBackend.whenGET(testResourceUrl + "?search=foo").respond(responseStub);
				$httpBackend.whenGET(testResourceUrl + "?orderBy=id&search=foo").respond(responseStub);

				var request1promise = dataProvider.filter("foo");
				$timeout.flush();
				$httpBackend.flush();

				var request2promise = dataProvider.orderBy("id");
				$timeout.flush();
				$httpBackend.flush();

				expect(request1promise).not.toBe(request2promise);
			});
		});

		describe("if placed within the debounce threshold", function() {
			it("should merge them and call the server just once", function() {
				$httpBackend.expectGET(testResourceUrl + "?orderBy=id&search=foo").respond(responseStub);
				dataProvider.debounceTime = 500;
				dataProvider.filter("foo");
				dataProvider.orderBy("id");

				$timeout.flush();
				$httpBackend.flush();
			});

			it("should return the same promise for both calls", function() {
				$httpBackend.whenGET(testResourceUrl + "?orderBy=id&search=foo").respond(responseStub);
				dataProvider.debounceTime = 500;
				var request1promise = dataProvider.filter("foo");
				var request2promise = dataProvider.orderBy("id");

				$timeout.flush();
				$httpBackend.flush();

				expect(request1promise).toBe(request2promise);
			});
		});
	});

	describe("#saveModel", function() {
		it("should issue a POST request sending the provided model", function() {
			var model = {
				name: "Gandalf",
				race: "Maia"
			};

			$httpBackend.expectPOST(testResourceUrl, model).respond("");
			dataProvider.saveModel(model);
			$httpBackend.flush();
		});
	});

	describe("custom setting serializer", function() {
		describe("when provided", function() {
			it("should build the URL with the help of the serializer", function() {
				$httpBackend.expectGET(testResourceUrl + "?custom-serializer-query-string").respond(responseStub);

				var customSerializer = function () {
					return "custom-serializer-query-string";
				};

				dataProvider.settingsSerializer = customSerializer;
				dataProvider.refresh();

				$timeout.flush();
				$httpBackend.flush();
			});
		});
	});

	describe("custom response parser", function () {
		describe("when provided", function() {
			it("should correctly interpret the data returned by a server", function() {
				$httpBackend.whenGET(testResourceUrl).respond(responseStub);

				var sampleData = [
						{ id: 1 },
						{ id: 2 }
					];
				var customResponseParser = function () {
					return {
						data: sampleData,
						totalResults: 42
					};
				};

				dataProvider.responseParser = customResponseParser;
				dataProvider.refresh();

				$timeout.flush();
				$httpBackend.flush();

				expect(dataProvider.getGridModel()).toEqual(sampleData);
				expect(dataProvider.getModelItemCount()).toEqual(42);
			});
		});
	});

	describe("custom success handler", function () {
		describe("when provided", function () {
			it("should execute the handler with the server's response", function () {
				$httpBackend.whenGET(testResourceUrl).respond(200, "Response text");

				var customSuccessHandler = function (response) {
					expect(response.status).toEqual(200);
					expect(response.data).toEqual("Response text");

					response.data = {
						data: [response.data],
						totalResults: 1
					};

					return response;
				};

				dataProvider.successHandler = customSuccessHandler;
				dataProvider.refresh();

				$timeout.flush();
				$httpBackend.flush();

				expect(dataProvider.getGridModel()).toEqual(["Response text"]);
				expect(dataProvider.getModelItemCount()).toEqual(1);
			});
		});
	});

	describe("custom error handler", function () {
		describe("when provided", function () {
			it("should execute the handler with the server's response", function () {
				$httpBackend.whenGET(testResourceUrl).respond(500, "Error text");

				var customErrorHandler = function (response) {
					expect(response.status).toEqual(500);
					expect(response.data).toEqual("Error text");
				};

				dataProvider.errorHandler = customErrorHandler;
				dataProvider.refresh();

				$timeout.flush();
				$httpBackend.flush();
			});
		});
	});
});
