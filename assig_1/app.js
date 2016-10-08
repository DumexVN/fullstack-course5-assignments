(function () {
'use strict';

angular.module('LunchChecker', [])
.controller('LunchCheckerController', LunchCheckerController);

LunchCheckerController.$inject = ['$scope'];
function LunchCheckerController($scope){
	$scope.inputString = ""
	$scope.message = "Wait ...";

	// first parse for number
	$scope.displayMessage = function(){
		var newMessage = parseInputString($scope.inputString);
		$scope.message = newMessage;
	}

	function parseInputString(string){
		if (string){
		var wordArray = string.split(",");
		var length = wordArray.length;
		return ("your menu consists of " + length + " items");
	}
		else{
			var s = '<p style="border-color:red">Please Enter Something</p>'; // jquery call
			return(s);
		}
	}
};


})();