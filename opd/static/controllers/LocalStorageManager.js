/**
 * @Class Name: LocalStorageManager.js
 * @author: lxanh
 * @created: May 23, 2013
 * @version: 1.0
 */

var LocalStorageManager = {
	searchKey: "",
	inSearchPage: true,
	currentOpenHeader: null,
	currentOpenHeader1: null,
	/* Define Campus
	 * Melbourne = BU
	   Bendigo = BE
	   Albury-Wodonga = AW
	   Mildura = MI
	   Shepparton = SH */
		
    // list campus	
    listCampus : [

	   {
		    "ID" : "BU",
		    "Name" : "Melbourne",
	   },
	   
	   {
			  "ID" : "BE",
			  "Name" : "Bendigo",
	   },
	   
	   {
			  "ID" : "AW",
			  "Name" : "Albury-Wodonga",
	   },
	   
	   {
			  "ID" : "MI",
			  "Name" : "Mildura",
	   },
	   
	   {
			  "ID" : "SH",
			  "Name" : "Shepparton",
	   },

	],
		
    // URL for jsonp data call
	apiUrl : 'http://www.latrobe.edu.au/openday/planner/planner_api.php?f=refresh_all&c={cid}&year=2013&sw=',

	// Should tracking be enabled
	enableTracking : true,

	// Array of sessions
	sessions : [],
	
	// Array of OpenDay data
	OpendDayData:[],
	
	// Array of sessioniD planner
	myPlannerIDs:[],
	    
	// Set default
	currentCampus: "BU",
	// Date of the open day
	date : new Date(),

	// Last load date time of session data
	sessionLoadDate : null,

	// Session data cache lifetime in milliseconds
	sessionCacheLifetime : 1000 * 60 * 60 * 48,

	// Indicates if we're online
	isOnline : false,

	// Indicates if localstorage is available
	hasLocalStorage : false,

	// Indicates whether we have an application cache available
	hasApplicationCache : !!window.applicationCache,

	// Runs all check the local storage
	runChecks : function() {
		// Check for local storage
		// Default is online
		LocalStorageManager.isOnline = true;
		try {
			LocalStorageManager.hasLocalStorage = !!localStorage.getItem;
		} catch (e) {
		}
		
		//Load data
		LocalStorageManager.loadData();
	},

	// Initialise the page
	init : function() {
		if (LocalStorageManager.hasApplicationCache) {
			// Watch for cache update events
			$(window.applicationCache).bind(
					'updateready noupdate error cached obsolete', function(e) {

						if (e.type == 'updateready' || e.type == 'cached') {
							// Update ready needs to swap in the new cache, then
							// reload to run off the updated cache.
							window.applicationCache.swapCache();
							window.location.reload();
						}

					});

			LocalStorageManager.runChecks();

		} else {
			// no application cache... jump straight to the connectivity test.
			LocalStorageManager.runChecks();
		}

	},

	// Loads in session data
	loadData : function() {
		// Check for a last cached time in the session and skip ajax load if we
		// can.
		var reloadData = true;
		// Check data is expiry or not
		if (LocalStorageManager.hasLocalStorage) {
			LocalStorageManager.sessionLoadDate = new Date(window.localStorage.getItem('LocalStorageManager_session_load_date'));
			if (LocalStorageManager.sessionLoadDate !== null) {
				var c = new Date();
				if (LocalStorageManager.sessionLoadDate.getTime() > (c.getTime() - LocalStorageManager.sessionCacheLifetime)) {
					reloadData = false;
				}
			}
		}

		if (LocalStorageManager.isOnline && reloadData) {
			// Load data via an ajax request
			// Load all campus data
			var countNumberOfServiceComplete=0;	 
			//Call 5 service APIs
			for(var i=0;i<LocalStorageManager.listCampus.length;i++)
			{
				// API URL
				var _url=LocalStorageManager.apiUrl.replace('{cid}', LocalStorageManager.listCampus[i].ID);			
				//console.log('load URL: '+ _url);
				//Start call ajax
				$.ajax({
					url : _url,
					dataType : 'jsonp',
					jsonp : 'jsonp',
					timeout: 12000,
					beforeSend: function() {
						$.mobile.loading( "show", {
							text: "Loading data",
							textVisible: true,
							theme: "a",
							html: ""
							});
					},
					success : function(data) {
						// Date is in the wrong format and needs - replaced
						LocalStorageManager.date = new Date(data.open_day.open_day_date.replace(/\-/g,'/'));
						// Sort sessions by time (rather than faculty as
						// they are now)
						data.sessions.sort(function(a, b) 
							{
						        var dateA = new Date(
							    LocalStorageManager.date.toDateString() + ' ' + a.start_time), dateB = new Date(LocalStorageManager.date.toDateString()+ ' ' + b.start_time);
								return dateA - dateB;
							});

						// Update sessions with NULL 
						for(var j=0;j<data.sessions.length;j++)
						{
							if(data.sessions[j].faculty_code==null)
							{
								data.sessions[j].faculty_code='General';
								data.sessions[j].faculty_name='General';
							}
						}
						
						 // Add to OpenDay data
						  LocalStorageManager.OpendDayData.push(data);

						
					},
					complete: function() { 
						
						    countNumberOfServiceComplete++;
						    // Complete all calling services
						    if(countNumberOfServiceComplete==LocalStorageManager.listCampus.length)
						    	{
							        $.mobile.loading( "hide" );						    						    
								   // Save data to local storage
									LocalStorageManager.sessionLoadDate = new Date();
									//LocalStorageManager.sessions = data.sessions;
									if (LocalStorageManager.hasLocalStorage) {
																													
										//Clear all old data
										window.localStorage.clear();
										
										// Save Openday data
										if(LocalStorageManager.OpendDayData.length>0)
										{
											window.localStorage.setItem('LocalStorageManager_openday_data',JSON.stringify(LocalStorageManager.OpendDayData));
											window.localStorage.setItem('LocalStorageManager_session_load_date',LocalStorageManager.sessionLoadDate.toString());
										}
																													
									}
									
									//Reload homeView
									IndexController.loadHomeView();
						    	}
						    
						},
					error: function(xhr, message, errorThrown) {
						 $.mobile.loading( "hide" );							 
						 $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all toastMessage'><a>Could not connect to internet.  <br/>Please check your network!</a></div>").css({ "display": "block", "opacity": 0.96, "top": $(window).scrollTop() + 100 })
						  .appendTo( $.mobile.pageContainer )
						  .delay(3000)
						  .fadeOut( 400, function(){
						    $(this).remove();
						  });
					}
				
				   				  
				});
				// End ajax call
			}
			
			
			
		} else {
			// Load data from localstorage if we can
			if (LocalStorageManager.hasLocalStorage) {
				LocalStorageManager.OpendDayData = JSON.parse(window.localStorage.getItem('LocalStorageManager_openday_data'));
			}
		}
	},

	// Write a cookie
	createCookie : function(name, value, days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			var expires = "; expires=" + date.toGMTString();
		} else
			var expires = "";
		document.cookie = name + "=" + value + expires + "; path=/";
	},

	// Read a cookie
	readCookie : function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for ( var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ')
				c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0)
				return c.substring(nameEQ.length, c.length);
		}
		return null;
	},

	// Erase a cookie
	eraseCookie : function(name) {
		createCookie(name, "", -1);
	},

	// Track a page load event with the UniqueStats function
	trackEvent : function(type, info) {
		if (LocalStorageManager.enableTracking) {
			var group, action;
			if (type == 'planner') {
				group = 'sessionPlanner';
				action = 'view';
			} else {
				group = 'sessionFeedback';
				action = 'feedback';
			}
			if (LocalStorageManager.isOnline) {
				// add a tracking hit
				uq_event(group, action, info, 'n', 0);
			} else {
				if (LocalStorageManager.hasLocalStorage) {
					// TODO: Store tracking hits in a cache
				}
			}
		}
	},

	// Get session Detail
	getSessionDetail : function(session_id) {
		var sessionDetail = {};
		
		for ( var index = 0; index < LocalStorageManager.OpendDayData.length; index++) 
		{
			var _sessions=LocalStorageManager.OpendDayData[index].sessions;
			for ( var i = 0; i < _sessions.length; i++) {
				if (_sessions[i].session_id == session_id) {
					sessionDetail = _sessions[i];
					sessionDetail['campusID']=LocalStorageManager.OpendDayData[index].open_day.campus_code;
					break;
				}

			}
		}
		
		
		
		return sessionDetail;
	},

	// Add to my planner
	addToMyPlanner : function(session_id) {
		
		try {
				this.myPlannerIDs.push(session_id);
		
		} catch (e) {
			// TODO: handle exception
		}

	},
	
	// Add to my planner
	removeMyPlanner : function(session_id) {
		
		try {
			   //this.myPlannerIDs.pop(session_id);
			   var index = this.myPlannerIDs.indexOf(session_id);
			   this.myPlannerIDs.splice(index, 1);
		
		} catch (e) {
			// TODO: handle exception
		}

	},
	
	// Add to my planner
	saveMyPlanner : function() {		
		try {
			   // set current planer
			 window.localStorage.removeItem('session_data_planner');
			 window.localStorage.setItem('session_data_planner', JSON.stringify(this.myPlannerIDs));

		
		} catch (e) {
			// TODO: handle exception
		}

	},
	
	// Add to my planner
	loadMyPlanner : function() {
		
		try {
			   // Get current planer
			   this.myPlannerIDs =  JSON.parse(window.localStorage.getItem('session_data_planner'));		
		} catch (e) {
			// TODO: handle exception
		}
		
		if(this.myPlannerIDs==null)
			this.myPlannerIDs=new Array();
	},

	// Get my planner
	getMyPlanner : function() {

		var listSessions = [];
		if (this.myPlannerIDs != null) {
			for ( var index = 0; index < this.myPlannerIDs.length; index++) {
				listSessions.push(LocalStorageManager.getSessionDetail(this.myPlannerIDs[index]));
			}
		}
		
		return listSessions;
	},

	// Check isMyPlanner
	isExistInMyPlanner : function(session_id) {
		var isexist = false;
		for ( var index = 0; index < this.myPlannerIDs.length; index++) {

			if (this.myPlannerIDs[index] == session_id)
				isexist = true;

		}
		return isexist;
	},
	
	
	// Campus settings
	setCurrentCampus:function(campusID)
	{
		window.localStorage.setItem('LocalStorageManager_openday_currentCampus',campusID);
		LocalStorageManager.currentCampus=campusID;
		//Reset session data by Campus settings	
		for ( var index = 0; index <  LocalStorageManager.OpendDayData.length; index++) 
		{
			if(LocalStorageManager.OpendDayData[index].open_day.campus_code==campusID)
				LocalStorageManager.sessions=LocalStorageManager.OpendDayData[index].sessions;
		}			 
	},
	// Get current campus id
	getCurrentCampus:function()
	{
		if(window.localStorage.getItem('LocalStorageManager_openday_currentCampus')==null)
			return this.currentCampus;
		else			
		    return window.localStorage.getItem('LocalStorageManager_openday_currentCampus');
	},
	
	//getCurrentCampus name
	getCurrentCampusName: function() {
		for(index in LocalStorageManager.OpendDayData) {
			if(this.currentCampus == LocalStorageManager.OpendDayData[index].open_day.campus_code) {
				return LocalStorageManager.OpendDayData[index].open_day.campus_name;
			}
		}
	},
	
	//get Campus date by ID
	getCampusDate: function(campusID) {
		for(index in LocalStorageManager.OpendDayData) {
			if(campusID == LocalStorageManager.OpendDayData[index].open_day.campus_code) {				
				var openDayDate = new Date(LocalStorageManager.OpendDayData[index].open_day.open_day_date.replace(/\-/g, '/'));
				return openDayDate.getDate();
			}
		}
	},
	
	//get Campus Name by ID
	getCampusName: function(sessionID) {
		for ( var index = 0; index <  LocalStorageManager.OpendDayData.length; index++) 
		{
			var sessions=LocalStorageManager.OpendDayData[index].sessions;
			for(session in sessions) {
				if(sessions[session].session_id == sessionID) {
					return LocalStorageManager.OpendDayData[index].open_day.campus_name;
				}
			}
		}	
	},
	
	// get current session by campus
	getCurrentSessions : function() {
		if (LocalStorageManager.sessions.length > 0) 
		{
			return LocalStorageManager.sessions;
		} 
		else 
		{
			var currentCampus = LocalStorageManager.getCurrentCampus();
			for ( var index = 0; index <  LocalStorageManager.OpendDayData.length; index++) 
			{
				if(LocalStorageManager.OpendDayData[index].open_day.campus_code==currentCampus)
					LocalStorageManager.sessions=LocalStorageManager.OpendDayData[index].sessions;
			}
			return LocalStorageManager.sessions;
		}
	}
		
};