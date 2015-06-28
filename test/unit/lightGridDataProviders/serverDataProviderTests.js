/* global beforeEach, afterEach, describe, it, expect, inject, module */
/// <reference path="../../../typings/jasmine/jasmine.d.ts"/>

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
		describe("with expression parameter", function() {
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
		});
		
		describe("if placed within the debounce threshold", function() {
			it("should just accept the last one", function() {
				
				$httpBackend.expectGET(testResourceUrl + "?orderBy=id").respond(responseStub);
				dataProvider.debounceTime = 500;
				dataProvider.filter("foo");
				dataProvider.orderBy("id");
				
				$timeout.flush();
				$httpBackend.flush();
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
});