 //<![CDATA[ 
var key = '0ArRwmWo93u-mdG93a2dkSWxIbHEzZjRIeDdxZXdsU1E';
var formkey ='1xADUIiBq1ksH7lxwSch1Nz_p2gSxdJttmv5OJOxJye0';
var sheet = "od6";
    
var talking = [];

$(window).load(function(){   
    var talk_timer = setInterval(talkingbox, 10000);
    function talkingbox() {    
        if($("#ukagaka_msgbox").css("display") != 'none')
        $("#ukagaka_msgbox").fadeOut(500,function(){
            $(this).html(talking[Math.floor(Math.random()*talking.length)]).fadeIn(500)});
    }
});
$(function() {
reloadtalking();    
$("#ukagaka_panel").draggable();
$("span#ukagaka_btn_display").click(function() {$("#ukagaka_panel").fadeToggle(1000);});
$("span#ukagaka_btn_menu").click(function() {$(".ukagaka_box div").fadeOut(500);$("#ukagaka_menubox").delay(500).fadeIn(500);});
$("span#menu_btn_exit").click(function(){$(".ukagaka_box div").fadeOut(500);$("#ukagaka_msgbox").delay(500).fadeIn(500);});
$("span#menu_btn_addstring").click(function(){$(".ukagaka_box div").fadeOut(500);$("#ukagaka_stringinput").delay(500).fadeIn(500);});
$("span#menu_btn_renewlist").click(function(){$(".ukagaka_box div").fadeOut(500);$("#ukagaka_renewlist").delay(500).fadeIn(500);});
$("span#addmenu_add").click(function(){
	var add = $("input#addstring").val();
    if(!((add.length <= 1)||add.indexOf('script') > -1|| add.indexOf('body') > -1 ||
		  add.indexOf('style') > -1 || add.indexOf('link') > -1 || add.indexOf('iframe') > -1 || add.indexOf('head') > -1 ||
		  add.indexOf('nav')>-1||add.indexOf('object')>-1||add.indexOf('embed')>-1)){
		$.ajax({
			type: 'POST',
			url: 'https://docs.google.com/forms/d/' + formkey + '/formResponse',
			data: { "entry.2030600456": add },
			dataType: "xml",
			statusCode: {
                0: function() {
					alert("偽春菜學會了！");
					$("input#addstring").attr("value","");
					reloadtalking();
                },
                200: function() {

					alert("偽春菜學會了！");
					$("input#addstring").attr("value","");
					reloadtalking();
                }
            }
		});
	}else{alert("OOPS！偽春菜不接受這個字串喔！");}
});
});
function reloadtalking(){
    /* JSON / load string from database */
    $.getJSON("https://spreadsheets.google.com/feeds/list/" + key + "/" + sheet + "/public/values?alt=json", function(JData){
        for (var i = 0; i < JData.feed.entry.length; i++) {
        	talking[i] = JData.feed.entry[i].gsx$storedatabase.$t;
        }
		$('input#addstring').attr('placeholder', '目前春菜學會了' + JData.feed.entry.length + '個字彙');
    });
    $("#ukagaka_msgbox").html("歡迎來到拉普菲斯");
};
//]]>