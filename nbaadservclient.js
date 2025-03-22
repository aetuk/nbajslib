/**
 * This website and its content is copyright of Web and Server Solution - © Web
 * and Server Solution 2012. All rights reserved. Any redistribution or
 * reproduction of part or all of the contents in any form is prohibited. You
 * may not, except with our express written permission, distribute or
 * commercially exploit the content. Nor may you transmit it or store it in any
 * other website or other form of electronic retrieval system.
 */
controller_nbc = function() {

		var dateid = (new Date()).getTime();
	var requestid = dateid.toString();

			
	
        	var http = location.protocol;
			var slashes = http.concat("//");
			var host = slashes.concat(window.location.hostname);
			
			var topcounter = 0;
			var rightbannercounter =0;
			var messagecounter =0;
			var inboxpromotioncounter =0;
		
           var nbainit = function(inputdata) {
				// Also parse cookie at this point and store results in data
				console.log("inputdata :" + inputdata);
				
                $.ajax({
					//url : 'https://awasr.herokuapp.com/bre/getdatajsonp',
			                url : 'http://130.162.186.141:8080/awasr/bre/getdatajsonp',
					data: inputdata,
					dataType: 'jsonp',
                    success: function(dataWeGotViaJsonp){
                        var text = '';

                         var jsondata = dataWeGotViaJsonp.output.displayresults.response;	
						 text = JSON.stringify(dataWeGotViaJsonp.output, null, 2);
						 
						 var datalen = 0;
						 
						if (jsondata.row.length == null)
						{
							datalen = 1;
						}
						else
						{
							datalen = jsondata.row.length;
						}
						
						//for (var i = 0; i < jsondata.row.length; i++) 
						var i = 0;
						
						while (datalen > i) {
						
								var rowdata;
								
								if (jsondata.row.length == null)
								{
									rowdata = jsondata.row;
								}
								else
								{
									rowdata = jsondata.row[i];
								}
								
								console.log(rowdata.proptype);
								
								//TODO - reset counters
								if(rowdata.proptype == "topbanner")
								{
										//if(topcounter == 0)
										{
											$("#" + rowdata.proptag).html("");
											 setprop(rowdata,inputdata);
											 topcounter++;
										}
								}
								if(rowdata.proptype == "rightbanner")
								{
										//if(rightbannercounter == 0)
										{
											$("#" + rowdata.proptag).html("");
											 setprop(rowdata,inputdata);
											 rightbannercounter++;
										}
								}
								if(rowdata.proptype == "messagebanner")
								{
										if(messagecounter == 0)
										{
											$("#" + rowdata.proptag).html("");
											//$("#OnlineMsgInboxBody").html("");
										}
											 setprop(rowdata,inputdata);
											 messagecounter++;
									
								}
								if(rowdata.proptype == "inboxpromotion")
								{
										//if(inboxpromotioncounter == 0)
										{
											$("#" + rowdata.proptag).css("display", "none");
											//$("#OnlineMsgInboxBody").html("");
										
											 setprop(rowdata,inputdata);
											 inboxpromotioncounter++;
										}
									
								}
								i++;
						} 
						resetcounters();
                        $('#jsontext').html(text);
						return false;
                    }
                });
			}

			function setprop(propdata,inputdata) {
					
					var proptag;
					
					if (jQuery.isEmptyObject(propdata.proptag)) 
					{
						proptag =  propdata.proptype;
					}
					else
					{
						proptag =  propdata.proptag;
					}
	
					console.log("proptag :" + proptag);
					console.log(propdata.description);
					
					//Set message if required
					 if(propdata.proptype == "messagebanner")
					{
						
						if (typeof OnlineMsg === "function") { 
							// safe to use the function
							OnlineMsg(messagecounter, propdata);
						}
						
					}
					else if(propdata.proptype == "inboxpromotion")
					{
						
						if (typeof InboxPromotionMsg === "function") { 
							// safe to use the function
							InboxPromotionMsg(inboxpromotioncounter, propdata);
						}
						
					}
					else //Set carousel if required 
					{
						//Set image details
						var Image = '<img id=' + proptag + 'Image" src=\"' + propdata.imageref + '\"/>';
						var Tooltip=propdata.propname;
						Image = '<a id="' + proptag + 'ImageLink" href=\"' +  propdata.clickurl + '\" title="'+ Tooltip + '">'+ Image + '</a>';
						$("#" + proptag).html(Image); 
					 
					
							//Set response
							$( "#" + proptag ).click(function() {
                   			if (propdata.clickurl){		
                   				//window.open(RHBClickURL, '_blank');
								;
                   			}
							inputdata["response"] = "click";
							inputdata["propid"] = propdata.propid;
							inputdata["brecontext"] = propdata.brecontext;
							saveResponse(inputdata);
						});
					 }
					 return false;
			}
			
			function resetcounters() {
				topcounter=0;
				rightbannercounter=0;
				messagecounter=0;
				inboxpromotioncounter =0;				
			}

			
	function saveResponse(inputdata){
	
		$.ajax({
			url : 'https://awasr.herokuapp.com/bre/getdatajsonp',
			data: inputdata,
			dataType: 'jsonp',
            success: function(dataWeGotViaJsonp){
			var text = '';
			
            var jsondata = dataWeGotViaJsonp.output.displayresults.response;
						
			text = JSON.stringify(dataWeGotViaJsonp.output, null, 2);
						 
			for (var i = 0; i < jsondata.row.length; i++) {
				var rowdata = jsondata.row[i];
				console.log(rowdata.proptype);
				settopbanner(rowdata);
				setright(rowdata);
				setmessage(rowdata);
			} 
			
            $('#jsontext').html(text);
			return false;
          }
      });
	//======= SaveCustomerResponse FINISH
	}
			
			
	function myIP() {
	
		if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
			else 
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

		xmlhttp.open("GET","http://api.hostip.info/get_html.php",false);
		xmlhttp.send();

		hostipInfo = xmlhttp.responseText.split("\n");

		for (i=0; hostipInfo.length >= i; i++) {
			ipAddress = hostipInfo[i].split(":");
			if ( ipAddress[0] == "IP" ) return ipAddress[1];
		}

		return false;
	}
	
	//Detect mobiles

	function DetectDevice() {

		var deviceAndroid = "android";
		var deviceIphone = "iphone";
		var deviceBlackberry = "blackberry";
		var uagent = navigator.userAgent.toLowerCase();
		if (uagent.search(deviceAndroid) > -1) {
			return deviceAndroid;
		}
		else if (uagent.search(deviceIphone) > -1) {
			return deviceAndroid;
		}
		else if (uagent.search(deviceBlackberry) > -1) {
			return deviceAndroid;
		}
	}
	

	return {

		nbc : function(text) {
			nbainit(text);				},
		init : function() {
			//initEventHandlers();
		},
		detectchannel : function() {
			//DetectChannel();
		}
	}
}();

 
 function DetectChannel() {
		
	var deviceAndroid = "android";
	var deviceIphone = "iphone";
	var deviceBlackberry = "blackberry";
	var uagent = navigator.userAgent.toLowerCase();
		
	if ((uagent.search(deviceAndroid) > -1) || (uagent.search(deviceIphone) > -1) || (uagent.search(deviceBlackberry) > -1)) 
	{
		return "mobile";
	}
	else
	{
		return "web";
	}
}

saveEvent = function(inputdata, eventtype, propid) {
	
		console.log("eventtype :" + eventtype);
		console.log("propid :" + propid);

		
		inputdata["response"] = eventtype;
		inputdata["propid"] = propid;
		inputdata["operation"] = "response";
		//inputdata["brecontext"] = brecontext;
	
		$.ajax({
			url : 'https://awasr.herokuapp.com/bre/getdatajsonp',
			//url : 'http://localhost:8083/wasso/bre/getdatajsonp',
			data: inputdata,
			dataType: 'jsonp',
            success: function(dataWeGotViaJsonp){
			var text = '';
			
            var jsondata = dataWeGotViaJsonp.output.displayresults.response;
						
			text = JSON.stringify(dataWeGotViaJsonp.output, null, 2);
						 
			//for (var i = 0; i < jsondata.row.length; i++) {
				//var rowdata = jsondata.row[i];
				//console.log(rowdata.proptype);
				//settopbanner(rowdata);
				//setright(rowdata);
				//setmessage(rowdata);
			//} 
			
            //$('#jsontext').html(text);
			console.log("text" + text);
			return false;
          }
      });
}
	

