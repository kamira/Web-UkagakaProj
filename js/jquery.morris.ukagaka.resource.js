(function($) {
    $.fn.extend({
        /*
            $('selector').myplugin( { key: 'value' } );
            $('selector').myplugin( 'mymethod1', 'argument' );
        */
        ukagaka: function(options, arg) {
            if (options && typeof(options) == 'object') {
                options = $.extend({}, $.ukagaka.defaults, options);
            } else {
                options = $.extend($.ukagaka.defaults, options);
            }

            this.each(function() {
                new $.ukagaka(this, options, arg);
            });
            return;
        }
    });

    $.ukagaka = function(elem, options, arg) {

        if (options && typeof(options) == 'string') {
            if (options == 'loadTalk') {
                loadTalk(options);
            }
            return;
        } else {
            init(elem, options);
        }

        function init(elem, options) {
            var o = options;

            var obj = $(elem);

            var sheetfield = o.googleSheetField;

            var loadingText = o.loadingText,
                learnPlaceholder = o.learnPlaceholder,
                logText = o.logText,
                menuMainText = o.menuMainText,
                menuLearnText = o.menuLearnText,
                menuLogText = o.menuLogText,
                menuExitText = o.menuExitText,
                menuCancelText = o.menuCancelText,
                menuSubmitText = o.menuSubmitText,
                menuQueryText = o.menuQueryText;
            ukagakaText = o.ukagakaText;

            var innerSettingHTML = "";
            innerSettingHTML += "<img class='ukagaka_img' src='img/uk.png'></img>";
            innerSettingHTML += "<div class='ukagaka_box'>";
            innerSettingHTML += "<div class='ukagaka_msg' id='ukagaka_msgbox'>" + loadingText + "</div>";
            innerSettingHTML += "<div class='ukagaka_msg' id='ukagaka_menubox' style='display:none'>" + menuMainText + "<br/><br/><span id='ukagaka_menu_btn_addstring'>" + menuLearnText + "</span><span id='ukagaka_menu_btn_renewlist'>" + menuLogText + "</span><span id='ukagaka_menu_btn_exit'>" + menuExitText + "</span></div>";
            innerSettingHTML += "<div class='ukagaka_msg' id='ukagaka_stringinput' style='display:none'>" + menuQueryText + "<input id='ukagaka_addstring' type='text' placeholder='" + learnPlaceholder + "'/><span id='ukagaka_addmenu_add'>" + menuSubmitText + "</span><span id='ukagaka_btn_menu'>" + menuCancelText + "</span></div>";
            innerSettingHTML += "<div class='ukagaka_msg' id='ukagaka_renewlist' style='display:none'>" + logText + "<span id='ukagaka_btn_menu'>" + menuCancelText + "</span></div>";
            innerSettingHTML += "<input id='ukagaka_sheetfield' type='hidden' value='" + sheetfield + "'>";
            innerSettingHTML += "</div>";

            var footerMenuHTML = "";
            footerMenuHTML += "<div id='ukagaka_controlpanel'>";
            footerMenuHTML += "<input id='ukagaka_usertalk'>";
            footerMenuHTML += "<span id='ukagaka_btn_showmenu' title='menu'></span><span id='ukagaka_btn_up' title='gotop'></span>";
            footerMenuHTML += "<div id='ukagaka_menu_list'>";
            footerMenuHTML += "<span id='ukagaka_btn_menu' title='learn'></span>";
            footerMenuHTML += "<span id='ukagaka_btn_mail' title='mail'></span>";
            footerMenuHTML += "<span id='ukagaka_btn_music' title='music'></span>";
            footerMenuHTML += "<span id='ukagaka_btn_down' title='godown'></span>";
            footerMenuHTML += "</div>";
            footerMenuHTML += "</div>";

            obj.append(innerSettingHTML);
            obj.after(footerMenuHTML);

            /* $.ajax({
                    type: 'GET',
                    url: 'http://localhost:8080',
                    data: sendData,
                    success: function(JData){
                        var NumOfJData = JData.length;
                        console.log(JData);
                    }
                });*/

            loadTalk(options);

            actionSetting(options, elem);
        }

        function loadTalk(options) {
            var o = options;

            var key = o.googleKey,
                sheet = o.googleSheet,
                formkey = o.googleFormkey,
                sheetfield = o.googleSheetField;

            $.getJSON("https://spreadsheets.google.com/feeds/list/" + key + "/" + sheet + "/public/values?alt=json", function(JData) {
                for (var i = 0; i < JData.feed.entry.length; i++) {
                    $.ukagaka.talking[i] = JData.feed.entry[i].gsx$storedatabase.$t;
                    // console.log("talk stmt : " + talking[i]);
                }
                $('input#ukagaka_addstring').attr('placeholder', ukagakaText + '學會了' + JData.feed.entry.length + '個字彙');
            });
        }

        function sendLearnText(options) {
            var add = $("input#ukagaka_addstring").val(),
                googleSheetField = $('input#ukagaka_sheetfield').val(),
                sendData = {};

            sendData[googleSheetField] = add;
            if (!((add.length <= 1) || add.indexOf('script') > -1 || add.indexOf('body') > -1 ||
                add.indexOf('style') > -1 || add.indexOf('link') > -1 || add.indexOf('iframe') > -1 || add.indexOf('head') > -1 ||
                add.indexOf('nav') > -1 || add.indexOf('object') > -1 || add.indexOf('embed') > -1)) {
                $.ajax({
                    type: 'POST',
                    url: 'https://docs.google.com/forms/d/' + formkey + '/formResponse',
                    data: sendData,
                    dataType: "xml",
                    statusCode: {
                        0: function() {
                            $("input#ukagaka_addstring").attr("value", "");
                            $(".ukagaka_box div").fadeOut(500);
                            $("#ukagaka_msgbox").fadeOut(500, function() {
                                $(this).html(ukagakaText + "學習了 !").fadeIn(1000)
                            });
                        },
                        200: function() {
                            $("input#ukagaka_addstring").attr("value", "");
                            $(".ukagaka_box div").fadeOut(500);
                            $("#ukagaka_msgbox").fadeOut(500, function() {
                                $(this).html(ukagakaText + "學習了 !").fadeIn(1000)
                            });
                        }
                    }
                });
            } else {
                alert("OOPS！" + ukagakaText + "不接受這個字串喔！");
            }
        }

        function actionSetting(options, elem) {

            var obj = $(elem);

            var o = options;

            var loadingText = o.loadingText,
                learnPlaceholder = o.learnPlaceholder,
                logText = o.logText,
                menuMainText = o.menuMainText,
                menuLearnText = o.menuLearnText,
                menuLogText = o.menuLogText,
                menuExitText = o.menuExitText,
                menuCancelText = o.menuCancelText,
                menuSubmitText = o.menuSubmitText,
                menuQueryText = o.menuQueryText;

            $("#ukagaka_usertalk").hide();
            if (navigator.userAgent.match(/Android|iPhone|iPad/i)) {
                $(".ukagaka_img").hide();
                $(".ukagaka_box").hide();
            } else {
                $(window).load(function() {
                    var talk_timer = setInterval(talkingbox, o.talkTime);

                    function talkingbox() {
                        if ($("#ukagaka_msgbox").css("display") != 'none' && $.ukagaka.talkValid == true) {
                            $("#ukagaka_msgbox").fadeOut(500, function() {
                                $(this).html($.ukagaka.talking[Math.floor(Math.random() * $.ukagaka.talking.length)]).fadeIn(500)
                            });
                        }
                    }
                });
                loadTalk(options);
            }

            $(window).scroll(function() {
                if ($(this).scrollTop() > 1800) {
                    if ($.ukagaka.talkValid == true) {
                        $("#ukagaka_msgbox").html($("#toc").html());
                        $.ukagaka.talkValid = false;
                    }
                } else {
                    if ($.ukagaka.talkValid == false) {
                        $("#ukagaka_msgbox").html(loadingText);
                        $.ukagaka.talkValid = true;
                    }
                }
            });
            $("#ukagaka_menu_list").hide();

            $("#ukagaka_usertalk").keypress(function(e) {
                code = (e.keyCode ? e.keyCode : e.which);
                if (code == 13) {
                    var sendData = {};
                    sendData['msg'] = $("#ukagaka_usertalk").val();
                    $("#ukagaka_usertalk").val("");
                    $.ajax({
                        type: 'GET',
                        url: 'http://140.115.205.194:8080',
                        data: sendData,
                        success: function(JData) {
                            $("#ukagaka_msgbox").fadeOut(500, function() {
                                $(this).html(JData).fadeIn(1000);
                            });
                        },
                        error: function(argument) {
                            $("#ukagaka_msgbox").fadeOut(500, function() {
                                $(this).html("主機關閉中 ...").fadeIn(1000);
                            });
                        }
                    });
                }
            });

            $(document).on('click', "#ukagaka_btn_mail", function(event) {
                $("#ukagaka_usertalk").toggle('slide', null, 500)
                $("#ukagaka_menu_list").toggle('slide', null, 500);
            }).on('click', "#ukagaka_btn_up", function(event) {
                $("html,body").animate({
                    scrollTop: 0
                }, 1000);
            }).on('click', "#ukagaka_btn_down", function(event) {
                $("html,body").animate({
                    scrollTop: document.body.scrollHeight
                }, 1000);

                $("#ukagaka_menu_list").toggle('slide', null, 500);
            }).on('click', "#ukagaka_btn_showmenu", function(event) {
                var hideElem = $('#ukagaka_menu_list');
                hideElem.toggle('slide', null, 500);
            }).on('click', "#ukagaka_menu_btn_exit", function(event) {
                $(".ukagaka_box div").fadeOut(500);
                $("#ukagaka_msgbox").delay(500).fadeIn(500);
            }).on('click', "#ukagaka_btn_menu", function(event) {
                $(".ukagaka_box div").fadeOut(500);
                $("#ukagaka_menubox").delay(500).fadeIn(500);
            }).on('click', "#ukagaka_menu_btn_addstring", function(event) {
                $(".ukagaka_box div").fadeOut(500);
                $("#ukagaka_stringinput").delay(500).fadeIn(500);
            }).on('click', "#ukagaka_menu_btn_renewlist", function(event) {
                $(".ukagaka_box div").fadeOut(500);
                $("#ukagaka_renewlist").delay(500).fadeIn(500);
            }).on('click', "#ukagaka_addmenu_add", function(event) {
                sendLearnText(options);
            });
        }
    };

    $.ukagaka.defaults = {
        googleKey: '0ArRwmWo93u-mdG93a2dkSWxIbHEzZjRIeDdxZXdsU1E',
        googleFormkey: '1xADUIiBq1ksH7lxwSch1Nz_p2gSxdJttmv5OJOxJye0',
        googleSheet: "od6",
        googleSheetField: "entry.2030600456",
        talkTime: 30000,

        ukagakaText: "史蒂芙",
        loadingText: "Wryyyyy",
        learnPlaceholder: "default: input for learn.",
        menuMainText: "使用選單功能&#65292; 為什麼要聽你的！",
        menuLearnText: "$ 學習",
        menuLogText: "$ 日誌",
        menuExitText: "$ 結束",
        menuCancelText: "$ 取消",
        menuSubmitText: "$ 確認",
        menuQueryText: "請輸入想要讓史蒂芙學的話<br/><br/>",
        logText: "更新日誌<br/><br/>Morris 修正<br/><br/>找尋 AI 系統<br/>找尋 AI 對話<br/>",
    };

    $.ukagaka.talking = [];

    $.ukagaka.talkValid = true;

})(jQuery);