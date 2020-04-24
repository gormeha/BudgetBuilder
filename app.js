
//Budget Contoller
var budgetController = (function(){

})();

//UI Conroller
var UIController = (function(){

  var DOMstring = {
    inputType : '.add__type',
    inputDescription : '.add__description',
    inputValue : '.add__value',
    inputBtn : '.add__btn'

  };

  return{
    getInput : function(){
      return{
        type : document.querySelector(DOMstring.inputType).value,
        description : document.querySelector(DOMstring.inputDescription).value,
        value : document.querySelector(DOMstring.inputValue).value
      };
    },

    getDOMstring : function(){
      return DOMstring;
    }

  };

})();



//Global Controller
var controller = (function(budcl, UIcl){

  var setupEventListeners = function(){
    var DOM = UIcl.getDOMstring();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(event){
      if (event.keyCode === 13 || event.which === 13){
          ctrlAddItem();
        }
      });
  };

  var ctrlAddItem = function(){
    var input = UIcl.getInput();
    console.log(input);
  };

  return{
      init: function(){
      setupEventListeners();
    }
  };

})(budgetController, UIController);

controller.init();
