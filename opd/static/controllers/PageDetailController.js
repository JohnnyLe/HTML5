/**
 * @Class Name: PageDetailController.js
 * @author: lxanh
 * @created: May 23, 2013
 * @version: 1.0
 */
 
var PageDetailController = {
 
    load: function () {
		// Onload page
		$(document)
				.delegate(
						'#session_detail',
						'pageshow',
						function() {
							
							//console.log("Loading page...");
							// get Id
							var session_id = queryString()["id"];
 
							var sessionDetail = LocalStorageManager
									.getSessionDetail(session_id);
							// Binding session detail
							$("#session_name").html(sessionDetail.location);
							$("#session_time").html(sessionDetail.stime);
							$("#session_description").html(
									sessionDetail.description);
							$("#session_title").html(sessionDetail.title);
							$("#pageTitle").html(LocalStorageManager.getCampusName(session_id));
							var locationName = sessionDetail.location; 
							if(locationData.getLocation(locationName)!=null)
							{
					           //Get target location
							  var latitude = locationData.getLocation(locationName).Latitude;
							  var longitude = locationData.getLocation(locationName).Longitude;
							  var sessionLatlng = new google.maps.LatLng(latitude, longitude);	
								 					             
					            //Settings google map will display
								var mapOptions = {
								   zoom: 15,
								   center: sessionLatlng,
								   mapTypeId: google.maps.MapTypeId.ROADMAP
								}
								
					            //Set map to div
								var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

								// Session description 
								 var contentString = '<div id="content" style="">'+
								     '<h4 id="firstHeading">'+locationName+'</h4>'+
								     '<h5 id="bodyContent">'+		
								      sessionDetail.title +
								     '</h5>'+
								     '</div>';                                

								 // Session infor
								 var infowindow = new google.maps.InfoWindow({
								     content: contentString,
								     maxWidth: 200
								 });
					             
								 //Add marker
								 var marker = new google.maps.Marker({
								     position: sessionLatlng,
								     map: map,
								     title: sessionDetail.title
								 });
								 // event
								 google.maps.event.addListener(marker, 'click', function() {
									   infowindow.open(map,marker);
									 });	
								 
								 
									// Load Goole Map	
								  var options = {timeout:60000};
								   if (navigator.geolocation) {
								       navigator.geolocation.getCurrentPosition(function (position) {
								           PageDetailController.showMap(position,map);
								       },function error(err){},options);
								   }
								  
							}
							else
							{
								$("#map_canvas").append('<h5>Sorry, no location information.</h5>');
							}
																					
                            // Check location in my planner
							var isExistInMyPlanner = LocalStorageManager.isExistInMyPlanner(session_id);
							
							//console.log("isExistInMyPlanner: "+isExistInMyPlanner);
							// Binding event on page
							var star_icon_enable ='<span class="star-icon-grey">&nbsp</span>';
							var star_icon_disable ='<span class="star-icon-checked">&nbsp</span>';
							if (!isExistInMyPlanner) {
								// Is not in my planner
								$("#btnAddPlanner").empty();
								$("#btnAddPlanner").append(star_icon_enable);
								$("#btnAddPlanner").trigger('create');
								
 
							} else {
								
								//Is in my planner																
								$("#btnAddPlanner").empty();
								$("#btnAddPlanner").append(star_icon_disable);	
								$("#btnAddPlanner").trigger('create');
								

							}
							
							
							$("#btnAddPlanner").bind('click',function() {
										// Add to my planner
								var isInMyPlanner = LocalStorageManager.isExistInMyPlanner(session_id);
								if (!isInMyPlanner) {
								
									LocalStorageManager.addToMyPlanner(session_id);														
									$("#btnAddPlanner").empty();
									$("#btnAddPlanner").append(star_icon_disable);	
									//console.log("planner: "+LocalStorageManager.myPlannerIDs.length);	
								}
								else
								{
									 LocalStorageManager.removeMyPlanner(session_id);						
								     $("#btnAddPlanner").empty();
								     $("#btnAddPlanner").append(star_icon_enable);
								     //console.log("planner: "+LocalStorageManager.myPlannerIDs.length);	
									
								}
														

							});
																									
 
							// Back event							
							$(".back-button").bind('click', function (e) {
							   history.back();							  
							});
							
						});
	},
	
	
	showMap: function(GPSposition,map) {
			 
			 // Current location info				 
			 if(GPSposition!=null)
			 {

					//Get current location by GPS                               
				  var curlat = GPSposition.coords.latitude;
				  var curlng = GPSposition.coords.longitude;
				  var currentLat = new google.maps.LatLng(curlat, curlng);
				  					

				 var infowindow2 = new google.maps.InfoWindow({
				     content: "My location",
				     maxWidth: 200
				 });
	           
				 var markerGPS = new google.maps.Marker({
				     position: currentLat,
				     map: map,
				     title: 'Current location',
				     icon:'static/images/mylocation.png'
				 });
				
				 google.maps.event.addListener(markerGPS, 'click', function () {
				     infowindow2.open(map, markerGPS);
				 });
			 }		

	}
	
};
