/**
 * @Class Name: IndexController.js
 * @author: vcnduong
 * @created: May 24, 2013
 * @version: 1.0
 */

var IndexController = {
	
	loadHomeView:function()
	{
      
		if (LocalStorageManager.OpendDayData.length == LocalStorageManager.listCampus.length) 
		{
			var date = new Date(
					LocalStorageManager.OpendDayData[0].open_day.open_day_date
							.replace(/\-/g, '/'));
			$("#tbHome").append(
					'<tr class="rowHead">'
							+ '<td class="rowLeft" >OPEN DAYS</td>'
							+ '<td class="rowRight">' + date.getMonthName()
							+ '</td>' + '</tr>');
			
			for(i in LocalStorageManager.listCampus) {
				$("#tbHome")
				.append(
						'<tr class="rowItem" id="'
								+ LocalStorageManager.listCampus[i].ID
								+ '">'
								+ '<td class="rowLeft" >'
								+ LocalStorageManager.listCampus[i].Name
								+ '</td>' + '<td class="rowRight">'
								+ LocalStorageManager.getCampusDate(LocalStorageManager.listCampus[i].ID) + 'th</td>'
								+ '</tr>');
			}
			
		}
		else
		{
			// Reload data
			 window.localStorage.removeItem('LocalStorageManager_session_load_date');
		}
		
		//Binding event		
		$(".home-table-content .rowItem").bind('click', function(e){			
			 LocalStorageManager.setCurrentCampus(this.id.toUpperCase());
			 $.mobile.changePage( "openday.html", { transition: "slide"});
		});
		
	}
};
