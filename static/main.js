(function () {

	'use strict';

	angular.module('WordcountApp', [])

	// dependency injection
	.controller('WordcountController', ['$scope', '$log', '$http', '$timeout', function($scope, $log, $http, $timeout) {
		$scope.getResults = function() { // no longer sending POST to back end, using Angular to handle http
			$log.log("test");

			// get URL from input
			var userInput = $scope.input_url;

			// API request
			$http.post('/start', {"url": userInput}).
				success(function(results) { //callback; results is the job id from /start route
					$log.log(results);
					getWordCount(results);
				}).
				error(function(error) {
					$log.log(error);
				});
		};

		function getWordCount(jobID) {

			var timeout = "";

			var poller = function() {
				// fire another request
				$http.get("/results/"+jobID).
					success(function(data, status, headers, config) {
						if(status === 202) {
							$log.log(data, status);
						} else if (status === 200){
							$log.log(data);
							$scope.wordcounts = data;
							$timeout.cancel(timeout);
							return false;
						}
						// continue to call poller() every 2 secs until timeout is cancelled
						timeout = $timeout(poller, 2000);
					});
			};
			poller();
		}
	}

	]);
}());


