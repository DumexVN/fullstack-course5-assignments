(function(){

'use strict';

angular.module('ShoppingListApp', [])
.controller('ToBuyItemController', ToBuyItemController)
.controller('BoughtItemController', BoughtItemController)
.provider('ShoppingListService', ShoppingListServiceProvider)
.filter('int', intFilter)
.config(Config);

Config.$inject = ['ShoppingListServiceProvider'];
function Config(ShoppingListServiceProvider){
	ShoppingListServiceProvider.defaults.maxItems = 5;
}

// TO BUY
ToBuyItemController.$inject=['ShoppingListService', 'intFilter'];
function ToBuyItemController(ShoppingListService, intFilter){
	var toBuyList = this;

	toBuyList.items = ShoppingListService.getItems();

	toBuyList.itemName = "";
	toBuyList.itemQuantity = "";

	toBuyList.addItem = function () {
		var parsed_int = intFilter(toBuyList.itemQuantity);
		// Check for NaN, interesting
		if (parsed_int !== parsed_int){ 
			toBuyList.errorMessage = "Please Enter a Valid Quantity";
		}
		else{
			if (parsed_int &&
					typeof(toBuyList.itemName === "string")){
				try{
					ShoppingListService.addItem(toBuyList.itemName, parsed_int);
					// HMM, not very clean, look for better solution later on
					// if sucess, then remove to HIDE the error message ...
					toBuyList.errorMessage = "";
				}
				catch (error){
					toBuyList.errorMessage = error.message;
				}
			}
			else{
				toBuyList.errorMessage = "Invalid Input!";
			}
		} 
	};

	toBuyList.removeItem = function (itemIndex) {
		ShoppingListService.removeItem(itemIndex);
		// HMM, not very clean, look for better solution later on
		toBuyList.errorMessage = "";
	};
}

// Service provider
function ShoppingListService(maxItem){
	var service = this;

	var itemList = [];

	service.addItem = function (itemName, itemQuantity) {
		if ((maxItem === undefined) ||
			(maxItem !== undefined) && itemList.length < maxItem) {
			// create new item
			var item = {
				name: itemName,
				quantity: itemQuantity
			};
			itemList.push(item);
		}
		else
		{
			throw new Error("Max Item: " + maxItem + " reached!");
		}
	};

	service.removeItem = function(itemIndex){
		itemList.splice(itemIndex, 1);
	};

	service.getItems = function() {
		return itemList;
	};
	
}

function ShoppingListServiceProvider(){
	var provider = this;

	  provider.defaults = {
	    maxItems: 100
	  };

	  provider.$get = function () {
	    var shoppingList = new ShoppingListService(provider.defaults.maxItems);

	    return shoppingList;
	  };
}

// BOUGHT
BoughtItemController.$inject=['ShoppingListService'];



// Filter
function intFilter(){
	return function (input) {
    return parseInt(input, 10);
  };
}



})();