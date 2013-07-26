/**
 * @Class Name: BrowserController.js
 * @author: vcnduong
 * @created: May 24, 2013
 * @version: 1.0
 */

var BrowserController = {
	load : function() {
		// On loading page
		$(document).delegate('#browser_page', 'pageshow', function() {
			// Reload current session
			LocalStorageManager.getCurrentSessions();

			var stateBack = BrowserController.getBackState();

			//var session_id = LocalStorageManager.session_id_detail;
            //Set header title
			$("#browseTitle").html(LocalStorageManager.getCurrentCampusName());

            //New list and detaillist of Faculty
			var facultyNameList = new Array();
			var facultyCodeList = new Array();
			var faculties = {};
			faculties["All"] = "All";

            //Get all information in Init function
			for(i in LocalStorageManager.sessions) {
				var facultyName =  LocalStorageManager.sessions[i].faculty_name;
				if(facultyNameList.indexOf(facultyName) < 0 && facultyName != null) {
					if(facultyName != "General") {
						facultyNameList.push(facultyName);
					}
					faculties[facultyName] = LocalStorageManager.sessions[i].faculty_code;
				}
			}
			
            //sort list name
			facultyNameList.sort();
			if(faculties["General"] != null) {
				facultyNameList.splice(0, 0, "General");
			}

			facultyNameList.splice(0, 0, "All");
			for(k in facultyNameList) {
				facultyCodeList.push(faculties[facultyNameList[k]]);
			}
			
            //For init search list
			$("#facultyCode").empty();
			var selectList = "";
			for(j in facultyCodeList) {
				var option = '<option value="' + facultyCodeList[j] + '">' + facultyNameList[j] + '</option>';
				selectList = selectList + option;
			}
			$("#facultyCode").append($(selectList));
			$("#facultyCode").selectmenu('refresh', true);
			
            //Init first list
			var sessions = BrowserController.getSessionsByFaculty('All');
            //Init list tag for collapse
			BrowserController.groupSessionsByTime(sessions);
			
            //Change search list
			$("#facultyCode").bind('change', function() {
				
				var faculty = $("#facultyCode").val();
				var sessions = BrowserController.getSessionsByFaculty(faculty);
				BrowserController.groupSessionsByTime(sessions);
				
				$("#session-results .session-time-header").bind('click', function() {
					if(LocalStorageManager.currentOpenHeader1 != null) {
						$(collapseWarpCenter).attr("class", "session-time-collapsed");
						LocalStorageManager.currentOpenHeader1=null;
					}				
					if(LocalStorageManager.currentOpenHeader != null && LocalStorageManager.currentOpenHeader != this.parentNode) {
						//close the old one
						LocalStorageManager.currentOpenHeader.className = "session-time-collapsed";
					}
					if(this.parentNode.className == "session-time-collapsed") {
						this.parentNode.className = "session-time-expand";
						LocalStorageManager.currentOpenHeader = this.parentNode;
						var num = $(this).offset().top -100;
						$('html, body').animate({ scrollTop: num }, 500);						

					}else{
						this.parentNode.className = "session-time-collapsed";
						LocalStorageManager.currentOpenHeader = null;
						
					}
																				
				});
				
				$("#session-results ul li").bind('click', function() {
				     var session_id = this.id;
				     var stateBrowser = {
				        facultyCode: $("#facultyCode").val(),
				        idCode: session_id
				     };
				     Router.pushState(stateBrowser);
				     
					 var url = "sessiondetail.html?id=" + session_id;
					 $.mobile.changePage( url, { transition: "slide"});	
				   
				});
			});
			
			//bind action back button			
			$(".back-button").bind('click', function(e){				
				history.back();
				
			
			});
			
			//Collapse or expand tag
			$("#session-results .session-time-header").bind('click', function() {
				if(LocalStorageManager.currentOpenHeader1 != null) {
					$(collapseWarpCenter).attr("class", "session-time-collapsed");
					LocalStorageManager.currentOpenHeader1=null;
				}
				if(LocalStorageManager.currentOpenHeader != null && LocalStorageManager.currentOpenHeader != this.parentNode) {
					LocalStorageManager.currentOpenHeader.className = "session-time-collapsed";
				}
				if(this.parentNode.className == "session-time-collapsed") {
					this.parentNode.className = "session-time-expand";
					LocalStorageManager.currentOpenHeader = this.parentNode;
					var num = $(this).offset().top -100;
					$('html, body').animate({ scrollTop: num }, 500);

				}else{
					this.parentNode.className = "session-time-collapsed";
					LocalStorageManager.currentOpenHeader = null;

				} 
				
			});
			
            //Move to detail page
			$("#session-results ul li").bind('click', function() {
			    var session_id = this.id;
			    var stateBrowser = {
			        facultyCode: $("#facultyCode").val(),
			        idCode: session_id
			    };
			    Router.pushState(stateBrowser);
				var url = "sessiondetail.html?id=" + session_id;
				 //console.log("Go to detail from  binding event home");
				$.mobile.changePage( url, { transition: "slide"});	
			  	
			});
			
			
			
			// New update: Remove Catch DOM
            //For back from detail page not use cache
			if (stateBack != null) {
				if(stateBack.facultyCode!="All")
				{
					 $("#facultyCode").val(stateBack.facultyCode);
					 $("#facultyCode").trigger("change");
				}
			   
			    
                //find element center screen
//			    var height = $(window).height()/2;
//			    var width = $(window).width()/2;
			    var collapseWarpCenter = $("#" + stateBack.idCode).parents(".session-time-collapsed");
			    $(collapseWarpCenter).attr("class", "session-time-expand");
			    LocalStorageManager.currentOpenHeader1 = $(collapseWarpCenter);
			    
			    
			}
			
		});
		
	},
	
	getBackState: function () {
	    return Router.pullState();
	},

	getGroupSessionByTime: function(time, sessions){
		var list = "<ul data-role='listview' data-inset='true' class='p-listview-all'>";
		var listData = new Array();
		for(j in sessions) {
			var stime =  sessions[j].stime;
			if(stime == time){
				listData.push(sessions[j]);
			}			
		}
		//sort list
		listData.sort(function(a, b) {
			return ((a.title.trim() < b.title.trim()) ? -1 : ((a.title.trim() > b.title.trim()) ? 1 : 0));
		});
       
		for(i in listData) {
			var li = "<li id='"+ listData[i].session_id+"'>"+
			
			"<table width='100%'><tr><td width='98%'>" +	              
			           "<a class='p-normal-text'>" + listData[i].title
						+ "</a> <br> <a class='session-time'>"+BrowserController.formatTime(listData[i].stime) + "<span class='session-location'>"
						+ listData[i].location+ "</span><span class='o-li-icon'></span></a>"+
			
			
			"</td><td align='right'><img src='static/images/icon_next.png'/></td></tr></table>" +	
			"</li>";
			list = list +li;
		}
		
		
		list = list +"</ul>";
		return list;
	},
	
	formatTime: function(stime){
		
		try {
			var split = stime.split(" ");		
			return split[0] + "<span class='time-prefix'>"+split[1]+"</span>";
		} catch (e) {
			return "<span class='time-prefix'>"+stime+"</span>";
		}
				
	},
	
	getSessionsByFaculty: function(facultyCode) {
		if(facultyCode == "All") {
			return LocalStorageManager.sessions;
		} else {
			var listResult = new Array();
			for(i in LocalStorageManager.sessions) {
				if(LocalStorageManager.sessions[i].faculty_code == facultyCode) {
					listResult.push(LocalStorageManager.sessions[i]);
				}		
			}

			return listResult;
		}
	},
	
	groupSessionsByTime: function(sessions) {
		var timearray = new Array();	
		
		$list = $('#session-results').empty();
		for(session in sessions) {
			var stime =  sessions[session].stime;
			var y = timearray.indexOf(stime);
			
			if(y < 0){
				timearray.push(stime);
				var timeFormat = BrowserController.formatTime(stime);
				var div = "<div class='session-time-collapsed'><div class='session-time-header'>" + timeFormat +"</div>";
				var list = BrowserController.getGroupSessionByTime(stime, sessions);
				div = div + list + "</div>";
				$list.append($(div));
			}
		}
	}
};