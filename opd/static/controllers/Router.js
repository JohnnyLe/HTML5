//Author: LQPAn
//Date: 28/06/2013

//Main Router
var Router = {
    //Save state for browser.html
    States: [],

    //Push State browser
    pushState: function (state) {
        this.States.push(state);
    },
    //Pull State Browser
    pullState: function () {
        if (this.States[0] != null){
           // var statePop = this.States[this.States.length - 1];
           //this.States.pop();
        	var statePop=Router.States.pop();
            return statePop;
        }
        else {
            return null;
        }
    },
    //Save state for search.html
    StatesSearch:[],
    pushStateSearch: function (state) {
        this.StatesSearch.push(state);
    },
    pullStateSearch: function () {
        if (this.StatesSearch[0] != null) {
            //var statePop = this.StatesSearch[this.StatesSearch.length - 1];
            //this.StatesSearch.pop();
            var statePop=Router.StatesSearch.pop();
            return statePop;
        }
        else {
            return null;
        }
    }
};

//Define State Browser
var State = {
    facultyCode: 'All',
    idCode: 0
};

//Define State Search
var StateSearch = {
    keyWord: '',
    keyWordSearch: '',
    idCode: 0
};