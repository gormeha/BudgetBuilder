
//Budget Contoller
var budgetController = (function(){

  var Expenses = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
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
    percentageLable: '.budget__expenses--percentage'

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
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }else if (type === 'exp') {
        element = DOMstring.expenseContainer;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

     newHtml = html.replace('%id%', obj.id);
     newHtml = newHtml.replace('%description%', obj.description);
     newHtml = newHtml.replace('%value%', obj.value);

     document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
      document.querySelector(DOMstring.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstring.incomeLable).textContent = obj.totalInc;
      document.querySelector(DOMstring.expenseLable).textContent = obj.totalExp;

      if (obj.percentage > 0){
        document.querySelector(DOMstring.percentageLable).textContent = obj.percentage;
      }else{
      document.querySelector(DOMstring.percentageLable).textContent = '---';
    }
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

    }

  };


  return{
      init: function(){
      setupEventListeners();
    }
  };

})(budgetController, UIController);

controller.init();
