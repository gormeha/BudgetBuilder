
//Budget Contoller
var budgetController = (function(){

  var Expenses = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expenses.prototype.calcPercentage = function(totalIncome) {

    if (totalIncome > 0){
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
       this.percentage = -1;
    }
  };

  Expenses.prototype.getPercentage = function() {
    return this.percentage;
  };


  var Income = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type){
    var sum = 0;
    data.allItems[type].forEach(function(cur){
      sum += cur.value;

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
    budget: 0,
    percentage:-1
  };

  return{
    addItem: function(type, des, val){
      var newItem, ID;

      if(data.allItems[type].length > 0){
        ID = data.allItems[type][data.allItems[type].length - 1] + 1;
      } else {
        ID = 0;
      }


      if(type === 'exp'){
        newItem = new Expenses(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      data.allItems[type].push(newItem);
      return newItem;
    },

    deleteItem: function(type, id){
      var ids, index;

      ids = data.allItems[type].map(function(current) {
        return current.id;
      });

       index = ids.indexOf(id);

       if (index !== -1){
          data.allItems[type].splice(index, 1); // removing the item
       }

    },

    calculateBudget: function(){
      // calculate inc and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      //calculate  the budget
      data.budget = data.totals.inc - data.totals.exp;

      //calaculate the percentage of income that we spent
      if (data.totals.inc > 0){
          data.percentage =Math.round((data.totals.exp / data.totals.inc) * 100);
      }else{
        data.percentage = -1;
      };
    },

    calculatePercentages: function(){

      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentage: function(){

      var allPerc = data.allItems.exp.map(function(cur){
          return cur.getPercentage();

      });
      return allPerc;

    },

    getBudget: function(){
      return{
         budget: data.budget,
         totalInc: data.totals.inc,
         totalExp: data.totals.exp,
         percentage: data.percentage
      };

    },

    testing : function(){
      console.log(data);
    }
  };

})();


//UI Conroller
var UIController = (function(){

  var DOMstring = {
    inputType : '.add__type',
    inputDescription : '.add__description',
    inputValue : '.add__value',
    inputBtn : '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLable: '.budget__income--value',
    expenseLable: '.budget__expenses--value',
    percentageLable: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLable: '.item__percentage',
    dateLable: '.budget__title--month'

  };

  return{
    getInput : function(){
      return{
        type : document.querySelector(DOMstring.inputType).value,
        description : document.querySelector(DOMstring.inputDescription).value,
        value : parseFloat(document.querySelector(DOMstring.inputValue).value)
      };
    },

    addListItem: function(obj, type){
      var html, newHtml, element;

      if (type === 'inc'){
        element = DOMstring.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }else if (type === 'exp') {
        element = DOMstring.expenseContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%',this.formatNumber(obj.value, type));

        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
      },

    deleteListItem: function(selectorID){

      var element = document.getElementById(selectorID);
      element.parentNode.removeChild(element)

    },


    clearFields: function(){
      var fields, fieldsArr;

      fields = document.querySelectorAll(DOMstring.inputDescription + ', ' + DOMstring.inputValue);

      fieldsArr = Array.prototype.slice.call(fields); // converting list to array

      fieldsArr.forEach(function(current, index, array){
          current.value = "";
      });

      fieldsArr[0].focus();
    },

    displayBudget: function(obj){

      var type;

      obj.budget > 0 ? type = 'inc' : type = 'exp';

      document.querySelector(DOMstring.budgetLabel).textContent = this.formatNumber(obj.budget, type);
      document.querySelector(DOMstring.incomeLable).textContent = this.formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstring.expenseLable).textContent = this.formatNumber(obj.totalExp, 'exp');

      if (obj.percentage > 0){
        document.querySelector(DOMstring.percentageLable).textContent = obj.percentage + ' %';
      }else{
      document.querySelector(DOMstring.percentageLable).textContent = '---';
    }
    },


    displayPercentages: function(percentages){

      var fields = document.querySelectorAll(DOMstring.expensesPercLable);

      var nodeListForEach = function(list, callback){
        for(var i =0; i< list.length; i++){
           callback(list[i], i);
        }

      };


      nodeListForEach(fields, function(current, index){

        if (percentages[index] > 0){
            current.textContent = percentages[index] + ' %';
        }else{
            current.textContent = '--';
        }
      });
    },

    formatNumber: function(num, type){

      num = Math.abs(num);
      num = num.toFixed(2);

      numSplit = num.split('.');

      int = numSplit[0];

      if(int.length > 3){
          int = int.substr(0, int.length - 3) + ',' + int.substr(int.length -3, 3);
      }
      dec = numSplit[1];

      return (type === 'exp' ?  '-' : '+') + ' ' + int + '.' + dec;

    },

    displayMonth: function(){

      var now, year, month, months ;

      now = new Date();

      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'sep', 'Oct', 'Nov', 'Dec']
      month = now.getMonth();

      year = now.getFullYear();
      document.querySelector(DOMstring.dateLable).textContent = months[month] + ' ' + year;



    },

    getDOMstring : function(){
      return DOMstring;    }

  };

})();



//Global Controller
var controller = (function(budgetctrl, UIcl){


  var setupEventListeners = function(){
    var DOM = UIcl.getDOMstring();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(event){
      if (event.keyCode === 13 || event.which === 13){
          ctrlAddItem();
        }
      });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  };

  var updateBudget = function(){
    var budget;

    //calculate the budget
    budgetctrl.calculateBudget();

    //return the budget
    budget = budgetctrl.getBudget();

    //display the budget
    UIcl.displayBudget(budget);

  };

  var updatePercentages = function() {

    // CALCULATE updatePercentages
    budgetctrl.calculatePercentages();

    var percentages = budgetctrl.getPercentage();

    UIcl.displayPercentages(percentages);


  };

  var ctrlAddItem = function(){
    var input, newItem

    //get the input data
    input = UIcl.getInput();

    if(input.description !== "" && !isNaN(input.value)){

      // add new item to contoller
      newItem = budgetctrl.addItem(input.type, input.description, input.value);

      //add new itenm to UI conroller and display it
      UIcl.addListItem(newItem, input.type);

      // clear the UI feilds after
      UIcl.clearFields();

      updateBudget();

      // calculate and update updatePercentages
      updatePercentages();

    }
  };

  var ctrlDeleteItem = function(event){
    var itemID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if(itemID) {

        splitID = itemID.split('-');
        type = splitID[0];
        ID = parseInt(splitID[1]);

        // delete the item from data structure
        budgetctrl.deleteItem(type, ID);

        // delete item from the UI
        UIcl.deleteListItem(itemID);

        // update and show the new b
        updateBudget();

        updatePercentages();

    }

  };


  return{
      init: function(){
          UIcl.displayMonth();
          UIcl.displayBudget({
            budget: 0,
            totalInc: 0,
            totalExp: 0,
            percentage:-1
          });
       setupEventListeners();
      }
    };

})(budgetController, UIController);

controller.init();
