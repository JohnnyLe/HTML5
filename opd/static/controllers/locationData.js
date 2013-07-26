var locationData={
			 		
		   locations:[],
		   
		   loadData:function()
			  {
				  $.getJSON("data.json", function(data) {				   
					   locationData.locations=data;
					});
			  }, 
			  
		    //list campus
		    listCampus:[		    
		  		      {id:"BU",name:"Melbourne"},
		  		      {id:"BE",name:"Bendigo"},
		  		      {id:"AW",name:"Albury-Wodonga"},
		  		      {id:"MI",name:"Mildura"},
		  		      {id:"SH",name:"Shepparton"}		                
		  		    ],
		  		    
		    getLocation: function(locationName)
		    {
		    	var listLocation=locationData.locations;
                var locationDetail=null;
		    	for(var index=0;index<listLocation.length;index++)
		    	{
		    		   if(listLocation[index].Location==locationName)
		    			   {
		    			     locationDetail=listLocation[index];
		    			     break;
		    			   }
		    			  
		    	}			    	
		    	return locationDetail;
		    },
		    		    
		    //get Campus Name
		    getCampusName: function(id) {
		    	for(var index=0;index<this.listCampus.length;index++)
		    	{
		    	  if(this.listCampus[index].id==id)
		    		  return this.listCampus[index].name;
		    	}
			},
			
	
			
	  //For Test purpose
	  logDataMissLatLong : function() {
		var list = "";
		if (LocalStorageManager.OpendDayData.length > 0) {
			for ( var index = 0; index < LocalStorageManager.OpendDayData.length; index++) {
				var sessions = LocalStorageManager.OpendDayData[index].sessions;
				for ( var i = 0; i < sessions.length; i++) {
					console.log(sessions[i].location +"---"+LocalStorageManager.OpendDayData[index].open_day.campus_name);
					if (this.getLocation(sessions[i].location) == null) {
						list += sessions[i].location.replace(',', '')
								+ ","
								+ LocalStorageManager.OpendDayData[index].open_day.campus_name
								+ "\n";
					}
				}

			}
		}
		console.log(list);
	}
};