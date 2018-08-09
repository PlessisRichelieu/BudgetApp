var budgetController = (function() {
	
	var Income = function(id, description, value){
				this.id=id;
				this.description = description;
				this.value=value;
	};


	var Expense = function(id, description, value){
				this.id=id;
				this.description = description;
				this.value=value;
				this.percentage = -1;
	};

	Expense.prototype.calcPercentage = function (totalInc){

		if (totalInc > 0)
        {
			this.percentage = Math.round((this.value / totalInc)*100);
        }

        else 
        {
        	this.percentage = -1;
        }

	};

	Expense.prototype.getPercentage = function (){

		return this.percentage;
	};

	var calculateTotal = function (type) {
		var sum = 0;

		data.allItems[type].forEach(function(curr){
			sum+=curr.value;
		});

		data.totals[type] = sum;

	};
	

	var data = {
        allItems: {
            exp: [],
            inc: []
        },

        totals: {
            exp: 0,
            inc: 0
        },

        budget : 0,
        percentage: -1 


    };

	return {
		addItem: function (type, des, val) {
			var newItem, ID;

			//Create new ID

			if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } 
            else {
                ID = 0;
            }

			//Create a new item in the list of expenses or income based on the type

			if (type==='exp')
			{
				newItem = new Expense (ID, des, val);
			}
			else if (type ==='inc')
			{
				newItem= new Income(ID,des,val);
			}

			//Store and return the item for use in the appController

			data.allItems[type].push(newItem);

			return newItem;
		},

		calculateBudget : function () {
			calculateTotal('exp');
			calculateTotal('inc');
			data.budget = data.totals.inc - data.totals.exp;
			if (data.totals.inc >0)
			{
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			}
			else
			{
				data.percentage=-1;
			}

		},

		caluclatePercenteges : function () {

			data.allItems.exp.forEach (function(cur){

				cur.calcPercentage(data.totals.inc);

			});

		},

		getPercentages : function () {

			var allPercentages = data.allItems.exp.map(function (cur){

				return cur.getPercentage();			

			});
			return allPercentages;
		},

		deleteItem : function (type, id) {

			var ids, index;

			ids = data.allItems[type].map(function(current){
				return current.id;
			});

			index = ids.indexOf(id);

			if (index !== -1)
			{
				data.allItems[type].splice(index, 1);
			}

		},

		getBudget : function () {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp : data.totals.exp,
				percentage : data.percentage
			}
		},

		testing: function (){
			console.log(data);
		}
	};

})();



var UIController = (function(){

var DOMStrings = {
	inputType:'.add__type',
	inputDescription:'.add__description',
	inputValue: '.add__value',
	inputButton: '.add__btn',
	incomeContainer : '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container__clearfix',
    expensesPercLabel: '.item__percentage'
};

var nodeListForEach = function(list, callback){

	for (i=0; i<list.length; i++)
	{

		callback(list [i],i);

	}

};

var a = document.querySelector('.add__type').value;

return {
		getInput: function (){
			return {
	 			type : document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
				description : document.querySelector(DOMStrings.inputDescription).value,
			    value : parseFloat(document.querySelector(DOMStrings.inputValue).value)
			   
			   	};
			},	

		addListItem : function (obj, type){
			var html, newHtml, element;
			if (type === 'inc') 
			{

				element = DOMStrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}
			else if (type==='exp')
			{

				element = DOMStrings.expensesContainer;
				html ='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}

			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},

		deleteListItem : function (selectorId){

			var el = document.getElementById(selectorId);
			el.parentNode.removeChild(el);

		},

		clearFields: function (){
			var fields, fieldsArr;
			fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach (function(curr, index, arr){
				curr.value = "";
				curr.description = "";
			});

			fieldsArr[0].focus();
		},

		displayBudget : function (obj){

			document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExp;
			
			if (obj.percentage >= 0)
			{

				document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';

			}

			else 
			{

				document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '---';

			}
		},

		displayPercentages : function (percentages){

				var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

				

				nodeListForEach (fields, function(current, index){

				if (percentages[index]>0)
				{
					current.textContent = percentages[index] + '%';
				}
				else
				{
					current.textContent = percentages[index] + '---';
				}

				});
		},

		getDOMStrings: function (){
			return DOMStrings;
				}
		};

})();

var Controller = (function (budgetCtrl, UICtrl){

		var setupEventListeners = function () {
		var DOM=UICtrl.getDOMStrings();

		document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

		document.addEventListener ('keypress', function (event){

		if (event.keyCode ===13 || event.which ===13)
		{
			ctrlAddItem();
		}

		});

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);


	}

	
	var updateBudget = function () {

		budgetCtrl.calculateBudget();

		var budget = budgetCtrl.getBudget();

		UIController.displayBudget(budget);

	};

	var updatePercentages = function (){

		budgetCtrl.caluclatePercenteges();

		var percentages = budgetCtrl.getPercentages();

		UICtrl.displayPercentages(percentages);

	};

	var ctrlAddItem = function ()
	{

		var input, newItem;

		input = UICtrl.getInput();

		if (input.description !== "" &&  ! isNaN(input.value) && input.value>0)
		{ 

		
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			UICtrl.addListItem(newItem, input.type);

			UICtrl.clearFields();

			updateBudget();

			updatePercentages();

		}


	};

	var ctrlDeleteItem = function (event) {
		var itemID, splitId, type, ID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if (itemID) 
		{

			splitId = itemID.split('-');
			type = splitId[0];
			ID = parseInt(splitId[1]);

			budgetCtrl.deleteItem(type, ID);
			UICtrl.deleteListItem(itemID);
			updateBudget();
			updatePercentages();


		}
	};
	

	return {

		init: function () {
			console.log('Application has started');
			UICtrl.displayBudget({
				budget : 0,
				totalInc: 0,
				totalExp : 0,
				percentage : '---'	 
			});
			setupEventListeners();
		}
	}

})(budgetController, UIController); 

Controller.init();
