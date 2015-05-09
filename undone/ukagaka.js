(function($) {
    $.fn.extend({
        ukagaka: 
            function( opts , arg ) {
                if( opt && typeof(opts) == 'object' ) {
                    opts = $.extend({}, $.ukagaka.defaults , opts );
                }else{
                    opts = $.extend( $.ukagaka.defaults , opts );
                }
                
                this.each(function(){
                    new $.ukagaka( this , opts , arg );
                });
                return;
            }
    });
    
    /* Default Setting */
    $.ukagaka.defaults = {
        googleKey : "",
        googleFormKey : "",
        googleFormField : "",
        
        delay : 13000, //Default 13000
        
        ukagakaName : "偽春菜",

        /* Main Text */
        mainText    : "",
        learnText   : "請輸入想讓" + ukagakaName + "學習的句子", 
        logText     : "更新日誌",

        /* List */
        logArray    : [''],

        /* Button Text */
        btn_learn   : "學習",
        btn_log     : "日誌",
        btn_exit    : "結束",
        btn_cancel  : "取消",
        btn_confirm : "確認",

        /* avatar list */
        avatarArray : ['']
    
    };

    $.ukagaka.talking = [];

    $.ukagaka.talkValid = true;
    $.ukagaka.nextText = '';
    $.ukagaka.nowText = '';

    /* Main Function */

    $.ukagaka = function(elem, opts, arg) {
        if (opts && typeof(opts) == "string") {
            if (opt == "loadTalk") {
                loadTalk(opts);
            }
            return;
        }else{
            init(elem, opts);
        }

        function init(elem, opts) {
            var obj = $(elem);
            var o = opts;
            
            var panelHTML = "<div id='ukagakaPanel' class='ukagakapanel gray ubr'></div>"; 
            /* 
               ubr = bottom right
               urr = right
               ubl = bottom left
               ull = left
            */
            
            var dialogHTML = "<div id='ukagakaMsgBox' class='msgBox'></div>";
            var avatarHTML = "<div id='ukagakaAvatar' class='uakagaka avatar1'></div>";
            
            loadString(opts);
            
            loadSetting(opts, elem);
            
            //loadPlayer();
            
        }
        
        function loadString(opts){
            var o = opts;
            
            /*
            $.getJSON("https://spreadsheets.google.com/feeds/list/" + o.key + "/" + o.sheet + "/public/values?alt=json", function(JData) {
                for (var i = 0; i < JData.feed.entry.length; i++) {
                    $.ukagaka.talking[i] = JData.feed.entry[i].gsx$storedatabase.$t;
                }
                showText($.ukagaka.talking[Math.floor(Math.random() * $.ukagaka.talking.length)]);
            });
            */
        }
    }

})
