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
				var o = options;

				$.getJSON("", function(JData){});

			});
		}
	})
)