(function($)
	$.fn.extend({
		//plugin name
		ukagaka: function(options) {

			var defaults = {
				//Google Sheet Key
				GSK : '0ArRwmWo93u-mdG93a2dkSWxIbHEzZjRIeDdxZXdsU1E',
				//Google Sheet Table
				GST: "od6",
				//Google Form Key
				GFK : '1xADUIiBq1ksH7lxwSch1Nz_p2gSxdJttmv5OJOxJye0',
				//Google Form Field
				GFF : "entry.2030600456",
                //millisecond
				time: 3000
			};

			var options = $.extend(defaults, options);

			return this.each(function(){
				var obj     = $(this);
				var key     = options.GSK,
					sheet   = options.GST,
					formkey = options.GFK,
					inputid = options.GFF;
				var TalkList = [];
				
				function GetDataFromGoogleVisualization(pkey, target_col){
					var query = new google.visualization.Query('//spreadsheets.google.com/tq?key='+ pkey +'&range='+ target_col);
					query.send(function(response){
						if(!response.isError()){
							var JSONdata = JSON.parse(response.getDataTable().toJSON());
							
							for(var i = TalkList.length;i < JSONdata.rows.length; i++)
								TalkList.push(JSONdata.rows[i].c[0].v);
						}
					});
				};
				
				function CreatControlPanel(){
					obj.append("<div id='U_Con_Panel'><span id='U_btn_display'>Display</span> | <span id='U_btn_menu>Menu</span></div>");
				}
				
				function SetListener(){};
				
				function StringAdder(str){
					var sendData = {};
					sendData[inputid] = str;
					
					$.ajax({
						type: 'POST',
						url: 'https://docs.google.com/forms/d/' + formkey + '/formResponse',
						data: sendData,
						dataType: "xml",
						statusCode: {
							0: function() {
							}
							200: function() {
							}
						}
					});
				};
				
				function ChangeMenu(){};
				
				function init(){
					var LoadGoogleApi=document.createElement('script');
                    LoadGoogleApi.setAttribute("type","text/javascript");
					LoadGoogleApi.setAttribute("src", '//www.google.com/jsapi?autoload={"modules":[{"name":"visualization","version":"1"}]}');
					
					document.getElementsByTagName("head")[0].appendChild(LoadGoogleApi);
					
					GetDataFromGoogleVisualization(GSK,'B');
					CreatControlPanel();
				};
				
				
				
				//$.getJSON("//spreadsheets.google.com/feeds/list/" + key + "/" + sheet + "/public/values?alt=json", function(JData){
				//	for(var i = 0; i < JData.feed.entry.length; i++)
				//		TalkString.push(JData.feed.entry[i].g)
				//});

			});
		}
	})
)
