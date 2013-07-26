/**
 * @Class Name: SearchController.js
 * @author: nkdung
 * @created: May 24, 2013
 * @version: 1.0
 */

var SearchController = {
	load : function() {
		// Onload page
		$(document).delegate('#search-page', 'pageshow', function() {			
			// Reload current session
			LocalStorageManager.getCurrentSessions();
			
			// get key search
			var searchkey = LocalStorageManager.searchKey;
			if(LocalStorageManager.inSearchPage == true) {
				$("#searchField").val(searchkey);
			} else {
				LocalStorageManager.inSearchPage = true;
			}
			$("#searchkey",$.mobile.activePage).html(searchkey);
			//empty the list
			
			//get list of result from database and append to list on screen
			var listResult = SearchController.getListEventsByKeyword(searchkey);
			$("#searchResultcontent").empty();
			if(listResult.length > 0) {
				//group by faculty
				listResult = SearchController.groupEventListByFaculty(listResult);
				$("#searchResultcontent").append($(listResult));
			} else {
				$("#searchResultcontent").append("<div class='p-text-empty'> No results </div>");
			}
			
			$("#searchField").bind('keypress', function(e) {
				if(e.keyCode == 13) {				
					searchKey = $("#searchField").val();
					if (searchKey != null && searchKey != "") {
						searchKey = searchKey.trim();
						LocalStorageManager.searchKey = searchKey;
						$.mobile.changePage( "search.html", {reloadPage: true, transition: "none", changeHash: false});
						//$.mobile.changePage(  "search.html?key="+searchKey, { transition: "slide"});		
						
					} else {
						$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all toastMessage'><a>Please input text to search</a></div>").css({ "display": "block", "opacity": 0.96, "top": $(window).scrollTop() + 100 })
						  .appendTo( $.mobile.pageContainer )
						  .delay( 1500 )
						  .fadeOut( 400, function(){
						    $(this).remove();
						  });
					}
					
					return false;
				} else {
					
				}
				
			});
			
			//bind action back button
			$(".back-button").bind('click', function(e){
				 history.back();			
			});
			
			
	  		//Fix toolBar when open keyborad on iOS issue
	  		// Issues is open: https://github.com/jquery/jquery-mobile/issues/4113
            if(/(iPhone|iPad|iPod)\sOS\s6/.test(navigator.userAgent)) {
                
			    $(document).on('focus', '#searchField', function() {
                    $('div[data-role="footer"]').css('position', 'absolute');
					$('div[data-role="header"]').css('position', 'absolute');
					
                    // Scroll to footer                    
                    $.mobile.silentScroll($('#searchField:focus').offset().top - 100);

                });
                $(document).on('blur', '#searchField', function() {
                    $('div[data-role="footer"]').css('position', 'fixed');
					$('div[data-role="header"]').css('position', 'fixed');
                });
              }		
			// End fix issue
			
			$("#searchButton").bind('click', function() {
				searchKey = $("#searchField").val();				
				if (searchKey) {
					searchKey = searchKey.trim();
					LocalStorageManager.searchKey = searchKey;
					$("#searchkey").empty();
					$("#searchkey").append(searchKey).trigger('create');
					$.mobile.changePage( "search.html", {reloadPage: true, transition: "none", changeHash: false});
					//$.mobile.changePage(  "search.html?key="+searchKey, { transition: "slide"});	
					
				} else {
					$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all toastMessage'><a>Please input text to search</a></div>").css({ "display": "block", "opacity": 0.96, "top": $(window).scrollTop() + 100 })
					  .appendTo( $.mobile.pageContainer )
					  .delay( 1500 )
					  .fadeOut( 400, function(){
					    $(this).remove();
					  });
				}
			});
			
			
			$("#searchResultcontent ul li").bind('click', function() {
				var session_id = this.id;
				if (session_id) {
				    var stateSearch = {
				        keyWord: $("#searchkey").text(),
				        keyWordSearch: $("#searchField").val(),
				        idCode: session_id
				    };
				    Router.pushStateSearch(stateSearch);
					var url = "sessiondetail.html?id=" + session_id;
					$.mobile.changePage( url, { transition: "slide"});
				}
					
			});
			

            //State back when don't use cache
			var stateBack = SearchController.getBackState();
			if (stateBack != null) {
			   
			    $("#searchkey").text(stateBack.keyWord);
			    $("#searchField").val(stateBack.keyWordSearch);
                
			} 
						
			//reset keyboard
			$('#searchField').blur();
		    $('#searchResultcontent').focus();
		});
	},
	
	getBackState: function () {
	    return Router.pullStateSearch();
	},

	getListEventsByKeyword: function(keyword) {
		var listResult = new Array();
		keyword = keyword.trim().toLowerCase();
		for(session in LocalStorageManager.sessions) {
			var titleStr =  LocalStorageManager.sessions[session].title.trim().toLowerCase();
			var facultyName = LocalStorageManager.sessions[session].faculty_name.trim().toLowerCase();
			if(titleStr.indexOf(keyword) >= 0 || titleStr == keyword || facultyName.indexOf(keyword) >= 0 || facultyName == keyword) {
				 listResult.push(LocalStorageManager.sessions[session]);
			}
		}
		return listResult;
	},
	
	groupEventListByFaculty: function(sessions) {
		
		var list = '<ul data-role="listview" class="p-listview-events" id="searchResultList">';
		var facultyList = new Array();
		for(i in sessions) {
			var facultyName =  sessions[i].faculty_name;
			if(facultyList.indexOf(facultyName) < 0 && facultyName != null) {
				facultyList.push(facultyName);
			}		
		}
		facultyList.sort();
		
		var listSessionWithNullFaculty = new Array;
		
		for(j in facultyList) {
			var newLi = "<li data-role='list-divider' class='p-divider-search'>" + facultyList[j] + "</li>";
			list = list + newLi;
			for(i in sessions) {
				if (sessions[i].faculty_name == facultyList[j]) {
					var li = "<li id='"+ sessions[i].session_id+"' class='listEventItem'>"+
					
							"<table width='100%'><tr><td width='98%'>" +
							"<a class='p-normal-text'>" + sessions[i].title
							+ "</a> <br> <a class='p-small-text session-time'>"
							+ BrowserController.formatTime(sessions[i].stime)
							+ "</a><a class='p-small-text p-location'>"
							+ sessions[i].location + "</a>" +

							"</td><td align='right'><img src='static/images/icon_next.png'/></td></tr></table>" +

							"</li>";
					list = list + li;
				}
			}
		}
		
		for(i in sessions) {
			if (!sessions[i].faculty_name) {
				listSessionWithNullFaculty.push(sessions[i]);
			}
		}
		
		if(listSessionWithNullFaculty.length > 0) {
			newLi = "<li data-role='list-divider' class='p-divider-search'></li>";
			list = list + newLi;
			for(i in listSessionWithNullFaculty) {
					var li = "<li id='"+ listSessionWithNullFaculty[i].session_id+"' class='listEventItem'>" +
					
					"<table width='100%'><tr><td width='98%'>" +					
					"<a class='p-normal-text'>" + listSessionWithNullFaculty[i].title
					+ "</a> <br> <a class='p-small-text session-time'>"+BrowserController.formatTime(listSessionWithNullFaculty[i].stime)
					+ "</a><a class='p-small-text p-location'>"+ listSessionWithNullFaculty[i].location+ "</a>" +
					
					"</td><td align='right'><img src='static/images/icon_next.png'/></td></tr></table>" +					
					"</li>";
					list = list + li;
			}
		}
		list = list +"</ul>";
		return list;
	}
};