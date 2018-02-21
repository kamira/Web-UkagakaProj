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
    
    /* 預設值 */
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

        /* 清單 */
        logArray    : [''],

        /* 按鈕 */
        btn_learn   : "學習",
        btn_log     : "日誌",
        btn_exit    : "結束",
        btn_cancel  : "取消",
        btn_confirm : "確認",

        /* 角色清單 */
        avatarArray : ['']
    
    };

    $.ukagaka.talking = [];

    $.ukagaka.talkValid = true;
    $.ukagaka.nextText = '';
    $.ukagaka.nowText = '';

    /* 主程式 */

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
               
               ubr(ukagaka bottom right) = 下右 
               ur(ukagaka right) = 右方
               ubl(ukagaka bottom left) = 下左
               ul(ukagaka left) = 左方
            */
            
            var dialogHTML = "<div id='ukagakaMsgBox' class='msgBox'></div>";
            var avatarHTML = "<div id='ukagakaAvatar' class='uakagaka avatar1'></div>";
            
            loadString(opts);
            
            loadSetting(opts, elem);
            
            //loadPlayer();
            
        }
        
        /* 通知功能 */
        function uDialog(opts){
            /* 載入字串 */
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
        
        /* 播放器 */
        function uPlayer(opts){
            /* 初始化播放器 */
            function initPlayer(opts){
                switch(opts){
                    case 0:
                        return 0;
                        break;
                    case 1:
                        renderPlayer();
                        break;
                 }
            }
            /* 呈現播放器 */
            function renderPlayer(){
                $("#webUkagakaMusic").html('<audio controls id="ukagakaPlayer"><source src="" type="audio/ogg"><source src="" type="audio/mpeg">您的瀏覽器不支援Audio元素</audio>');
                $("#ukagakaPlayer").onended = function() {
                    playerNext();
                };

                /*window.setInterval(function(){
                    var str = '';
                    if(player[currentTime] == player[duration])
                        nextMusic();
                    document.getElementById('panel').innerHTML = str;
                    }, 1000);*/
            }
            /* 播放下一首 */
            function playerNext(){
                var _target = $("#ukagakaPlayer > source");
                var _currentSrc = _target[0].src();
                var _nextSrc = _target[0].src();

                while( _currentSrc == _nextSrc ){ _nextSrc = playerList[playerList.length * Math.random()]; }

                for(var i = 0; i < _target.length ; i++ )
                    _target[i].src(_nextSrc);
            }
        }

})
