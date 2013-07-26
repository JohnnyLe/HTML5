/**
 * @Class Name: MyPlanner.js
 * @author: vcnduong
 * @created: May 24, 2013
 * @version: 1.0
 */

var MyPlanner = {

	formatTime: function(stime){	
			try {
				var split = stime.split(" ");		
				return split[0] + "<span class='time-prefix'>"+split[1]+"</span>";
			} catch (e) {
				return "<span class='time-prefix'>"+stime+"</span>";
			}
		},
		
	
	load : function() {
		// Onload page
		$(document)
				.delegate(
						'#my-planner',
						'pageshow',
						function() {
							var noData = "<div class='no-my-planner'><span class='no-favourites'>No favourites saved.</span><br>"
									+ "<span>Select star <span class='star-icon-grey'>.</span> to add to My planner.</span></div>";

							$list = $("#list-planner").empty();

							var sessions = LocalStorageManager.getMyPlanner();
							if (sessions.length == 0)
								$list.append(noData);
							else {
								var listItem = '<ul data-role="listview" class="p-listview-events" id="searchResultList">';
								sessions.sort(function(a, b) 
									{
								        var dateA = new Date(
									    LocalStorageManager.date.toDateString() + ' ' + a.start_time), dateB = new Date(LocalStorageManager.date.toDateString()+ ' ' + b.start_time);
										return dateA - dateB;
									});
								for (i in sessions) {									
									var li = "<li id='"+ sessions[i].session_id+"' class='listEventItem'>"+									
									"<table width='100%'><tr><td width='98%'>" +
									"<a class='p-normal-text'>" + sessions[i].title
									+ "</a> <br> <a class='p-small-text session-time'>"
									+ MyPlanner.formatTime(sessions[i].stime)
									+ "</a><a class='p-small-text p-location'>"
									+ sessions[i].location + "</a>" +
									"</td><td align='right'><img src='static/images/icon_next.png'/></td></tr></table>" +
									"</li>";
									
									listItem = listItem + li;
								}
								listItem = listItem + "</ul>";
								$list.append(listItem);
							}

							// Item tap event
							$("#list-planner ul li").bind('click', function() {
								var session_id = this.id;
								var url = "sessiondetail.html?id=" + session_id;
								$.mobile.changePage( url, { transition: "slide"});	
							});
							
							//Back event							
							$(".back-button").bind('click', function(e){
								 history.back();
							});
							
		});
	},
	

};