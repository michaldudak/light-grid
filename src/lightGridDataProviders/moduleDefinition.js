angular.module("lightGridDataProviders", ["lightGrid"])
	.config(function ($qProvider) {
		$qProvider.errorOnUnhandledRejections(false);
	});
