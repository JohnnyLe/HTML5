/**
 * @Class Name: OpendayController.js
 * @author: vcnduong
 * @created: May 24, 2013
 * @version: 1.0
 */

var OpendayController = {

	load : function() {
		// Onload page
		$(document).delegate('#openday_page', 'pageshow', function(event,ui) {
			// Reload current session
			LocalStorageManager.getCurrentSessions();			
			var titleList = new Array();
			for(session in LocalStorageManager.sessions) {
				var title = LocalStorageManager.sessions[session].title;
				if(title) {
					titleList.push(title);
				}
			}
			$("#openDayTitle").html(LocalStorageManager.getCurrentCampusName());
			
			$("#browerLink").bind('click', function(e) {
				LocalStorageManager.backBrowser = false;			
			});
			
			$("#search-field").bind('keypress', function(e) {
				if(e.keyCode == 13) {
					var searchKey = $("#search-field").val();
					if (searchKey) {
						searchKey = searchKey.trim();
						var url = "search.html";
						LocalStorageManager.searchKey = searchKey;
						LocalStorageManager.backSearch = false;
						LocalStorageManager.inSearchPage = false;
						LocalStorageManager.inSearchPage = false;
						$.mobile.changePage( url, { transition: "slide"});				
					} else {
						$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all toastMessage'><a>Please input text to search</a></div>").css({ "display": "block", "opacity": 0.96, "top": $(window).scrollTop() + 100 })
						  .appendTo( $.mobile.pageContainer )
						  .delay( 1500 )
						  .fadeOut( 400, function(){
						    $(this).remove();
						  });
					}
					return false;
				}
							
				
			});
			
			// Binding event on page
			$("#search-button").bind('click', function() {
				LocalStorageManager.inSearchPage = false;
				$('#searchResultcontent').focus();
				LocalStorageManager.backSearch = false;
				var searchKey = $("#search-field").val();
				if (searchKey) {
					searchKey = searchKey.trim();
					LocalStorageManager.searchKey = searchKey;
					LocalStorageManager.inSearchPage = false;
					var url = "search.html";
					$.mobile.changePage( url, { transition: "slide"});				
				} else {
					
					$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all toastMessage'><a>Please input text to search</a></div>").css({ "display": "block", "opacity": 0.96, "top": $(window).scrollTop() + 100 })
					  .appendTo( $.mobile.pageContainer )
					  .delay( 1500 )
					  .fadeOut( 400, function(){
					    $(this).remove();
					  });
				}
				
				$('#search-field').blur();
			});
			$("#search-button").bind('touchend', function() {
				$('#search-field').blur();
				$('#searchResultcontent').focus();
			});
			
			$("#search-button").bind('taphold', function() {
				$('#search-field').blur();
				$('#searchResultcontent').focus();
			});
			
			
			
			//search button
			
			//back button						
			$(".back-button").bind('click', function(e){
				 history.back();			
			});
			
			
			// Save myplanner to storage when back to OpenDay
			// Save my planner
			LocalStorageManager.saveMyPlanner();	
			
		});
	}
};