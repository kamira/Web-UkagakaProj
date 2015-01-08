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

            var footerMenuHTML = "";
            footerMenuHTML += "<div id='ukagaka_controlpanel'><ul>";
            // footerMenuHTML += "<input id='ukagaka_usertalk'>";
            footerMenuHTML += "<li id='ukagaka_btn_up'><i class='icon-gotop'></i></li>";
            footerMenuHTML += "<li id='ukagaka_btn_down'><i class='icon-godown'></i></li>";
            footerMenuHTML += "<li id='ukagaka_btn_menu'><i class='icon-learn'></i></li>";
            footerMenuHTML += "<li id='ukagaka_btn_music'><i class='icon-music'></i></li>";
            footerMenuHTML += "<li id='ukagaka_btn_refresh'><i class='icon-refresh'></i></li>";
            footerMenuHTML += "<li id='ukagaka_btn_power'><i class='icon-power'></i></li>";
            // footerMenuHTML += "<li id='ukagaka_btn_mail'><i class='icon-mail'></i></li>";
            footerMenuHTML += "</ul></div>";

            var dialogHTML = "";
            dialogHTML += playerHTML();
            dialogHTML += "<div class='ukagaka_box'>";
            dialogHTML += "<div class='ukagaka_msg' id='ukagaka_msgbox'></div>";
            dialogHTML += "<div class='ukagaka_msg' id='ukagaka_menubox' style='display:none'>" + menuMainText + "<br/><br/><span id='ukagaka_menu_btn_addstring'>" + menuLearnText + "</span><span id='ukagaka_menu_btn_renewlist'>" + menuLogText + "</span><span id='ukagaka_menu_btn_exit'>" + menuExitText + "</span></div>";
            dialogHTML += "<div class='ukagaka_msg' id='ukagaka_stringinput' style='display:none'>" + menuQueryText + "<input id='ukagaka_addstring' type='text' placeholder='" + learnPlaceholder + "'/><br/><span id='ukagaka_addmenu_add'>" + menuSubmitText + "</span><span id='ukagaka_btn_menu'>" + menuCancelText + "</span></div>";
            dialogHTML += "<div class='ukagaka_msg' id='ukagaka_renewlist' style='display:none'>" + logText + "<span id='ukagaka_btn_menu'>" + menuCancelText + "</span></div>";
            dialogHTML += "<input id='ukagaka_sheetfield' type='hidden' value='" + sheetfield + "'>";
            dialogHTML += "</div>";


            var innerSettingHTML = "";
            innerSettingHTML += "<div id='ukagaka_logbox' class='ukagaka_block'>";
            innerSettingHTML += "<div class=\"chat-box-content\">" + dialogHTML + "</div>";
            innerSettingHTML += "</div>";

            obj.append(innerSettingHTML);
            obj.after(footerMenuHTML);
            obj.after("<img class='ukagaka_img' src='" + options.imgs[0] + "'></img>");

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

            playerDeploy();

            $("#playblock").hide();
            // $("#ukagaka_logbox").hide();
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
                }
                showText($.ukagaka.talking[Math.floor(Math.random() * $.ukagaka.talking.length)]);
                $('input#ukagaka_addstring').attr('placeholder', ukagakaText + '學會了' + JData.feed.entry.length + '個字彙');
            });
        }

        function showText(text) {
            $.ukagaka.nextText = text;
        }

        function sendLearnText(options) {
            var o = options;

            var key = o.googleKey,
                sheet = o.googleSheet,
                formkey = o.googleFormkey,
                sheetfield = o.googleSheetField;

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
                            showText(ukagakaText + "學習了 !");
                        },
                        200: function() {
                            $("input#ukagaka_addstring").attr("value", "");
                            $(".ukagaka_box div").fadeOut(500);
                            showText(ukagakaText + "學習了 !");
                        }
                    }
                });
            } else {
                alert("OOPS！" + ukagakaText + "不接受這個字串喔！");
            }
        }

        function typed(text) {
            setInterval(function() {
                if ($.ukagaka.nowText == $.ukagaka.nextText)
                    return;
                $("#ukagaka_msgbox").typed('reset');
                $.ukagaka.nowText = $.ukagaka.nextText;
                $("#ukagaka_msgbox").typed({
                    strings: [$.ukagaka.nowText],
                    typeSpeed: 20,
                    contentType: 'html',
                    loop: false,
                    backDelay: 500,
                    loopCount: false,
                    callback: function() {},
                    resetCallback: function() {}
                });
            }, 1000);
        }

        function actionSetting(options, elem) {
            typed('');

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
                            showText($.ukagaka.talking[Math.floor(Math.random() * $.ukagaka.talking.length)]);
                        }
                    }
                });
                loadTalk(options);
            }
            showText(loadingText);
            $(window).scroll(function() {
                if ($(this).scrollTop() > 1800) {
                    showText($("#toc").html());
                }
            });

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
                            showText(JData);
                        },
                        error: function(argument) {
                            showText("主機關閉中 ...");
                        }
                    });
                }
            });

            $(document).on('click', "#ukagaka_btn_mail", function(event) {
                // $("#ukagaka_usertalk").toggle('slide', null, 500)
                alert('AIML 入口，正在永久推遲建造 ...');
            }).on('click', "#ukagaka_btn_music", function(event) {
                // $("#ukagaka_usertalk").toggle('slide', null, 500)
                $("#playblock").toggle('slide', null, 500);
            }).on('click', "#ukagaka_btn_up", function(event) {
                $("html,body").animate({
                    scrollTop: 0
                }, 1000);
            }).on('click', "#ukagaka_btn_down", function(event) {
                $("html,body").animate({
                    scrollTop: document.body.scrollHeight
                }, 1000);
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
            }).on('click', "#ukagaka_btn_refresh", function(event) {
                $(".ukagaka_img").attr("src", options.imgs[Math.floor(Math.random() * options.imgs.length)]);
            }).on('click', "#ukagaka_btn_power", function(event) {
                $(".chat-box-content, .ukagaka_img").toggle();
            });
        }

        function playerHTML() {
            var html;
            var header = '',
                ctrl = '',
                progress = '';
            header += '<div class="tag"><strong>Title</strong><span class="artist">Artist</span><span class="album">Album</span></div>';
            ctrl += '<div class="control">';
            ctrl += '<i class="icon-backward"></i><i class="icon-play"></i><i class="icon-forward"></i>';
            ctrl += '<span class="progress"><i class="icon-repeat repeat"></i><i class="icon-random"></i></span>';
            ctrl += '<span class="volume"><i class="icon-volume-up"></i><div class="slider"><div class="pace"></div></div></span>';
            ctrl += '</div>';
            progress += '<div class="progress"><div class="slider"><div class="loaded"></div><div class="pace"></div></div><div class="timer right">0:00</div></div>';

            html = '<div id="playblock"><div id="player"><div class="ctrl">';
            html = html + header + ctrl + progress;
            html = html + '</div></div></div>';
            return html;
        }

        function playerDeploy() {
            var player = $('#playblock');
            var repeat = localStorage.repeat || 0,
                shuffle = localStorage.shuffle || 'false',
                continous = true,
                autoplay = false,
                playlist = [{
                    title: 'さよならのこと',
                    artist: 'WHITE ALBUM2 ED',
                    album: '',
                    cover: '',
                    mp3: 'music/WHITE-ALBUM2-ED-Piano.mp3',
                    ogg: 'music/WHITE-ALBUM2-ED-Piano.mp3'
                }, {
                    title: '光るなら',
                    artist: '四月は君の嘘 OP',
                    album: '',
                    cover: '',
                    mp3: 'music/Shigatsu-wa-Kimi-no-Uso-OP-Piano.mp3',
                    ogg: 'music/Shigatsu-wa-Kimi-no-Uso-OP-Piano.mp3'
                }];

            var time = new Date(),
                currentTrack = shuffle === 'true' ? time.getTime() % playlist.length : 0,
                trigger = false,
                audio, timeout, isPlaying, playCounts;

            var play = function() {
                audio.play();
                player.find('.icon-play').addClass('icon-pause');
                timeout = setInterval(updateProgress, 500);
                isPlaying = true;
            }

            var pause = function() {
                audio.pause();
                player.find('.icon-play').removeClass('icon-pause');
                clearInterval(updateProgress);
                isPlaying = false;
            }

            // Update progress
            var setProgress = function(value) {
                var currentSec = parseInt(value % 60) < 10 ? '0' + parseInt(value % 60) : parseInt(value % 60),
                    ratio = value / audio.duration * 100;

                player.find('.timer').html(parseInt(value / 60) + ':' + currentSec);
                player.find('.progress .pace').css('width', ratio + '%');
                player.find('.progress .slider a').css('left', ratio + '%');
            }

            var updateProgress = function() {
                setProgress(audio.currentTime);
            }

            // Progress slider
            player.find('.progress .slider').slider({
                step: 0.1,
                slide: function(event, ui) {
                    $(this).addClass('enable');
                    setProgress(audio.duration * ui.value / 100);
                    clearInterval(timeout);
                },
                stop: function(event, ui) {
                    audio.currentTime = audio.duration * ui.value / 100;
                    $(this).removeClass('enable');
                    timeout = setInterval(updateProgress, 500);
                }
            });

            // Volume slider
            var setVolume = function(value) {
                audio.volume = localStorage.volume = value;
                player.find('.volume .pace').css('width', value * 100 + '%');
                player.find('.volume .slider a').css('left', value * 100 + '%');
            }

            var volume = localStorage.volume || 0.5;
            player.find('.volume .slider').slider({
                max: 1,
                min: 0,
                step: 0.01,
                value: volume,
                slide: function(event, ui) {
                    setVolume(ui.value);
                    $(this).addClass('enable');
                    player.find('.icon-volume-up').removeClass('enable');
                },
                stop: function() {
                    $(this).removeClass('enable');
                }
            }).children('.pace').css('width', volume * 100 + '%');

            player.find('.icon-volume-up').click(function() {
                if ($(this).hasClass('enable')) {
                    setVolume($(this).data('volume'));
                    $(this).removeClass('enable').removeClass('icon-volume-off');
                } else {
                    $(this).data('volume', audio.volume).addClass('enable').addClass('icon-volume-off');
                    setVolume(0);
                }
            });

            // Switch track
            var switchTrack = function(i) {
                if (i < 0) {
                    track = currentTrack = playlist.length - 1;
                } else if (i >= playlist.length) {
                    track = currentTrack = 0;
                } else {
                    track = i;
                }

                $('audio').remove();
                loadMusic(track);
                if (isPlaying == true) play();
            }

            // Shuffle
            var shufflePlay = function() {
                var time = new Date(),
                    lastTrack = currentTrack;
                currentTrack = time.getTime() % playlist.length;
                if (lastTrack == currentTrack)++currentTrack;
                switchTrack(currentTrack);
            }

            // Fire when track ended
            var ended = function() {
                pause();
                audio.currentTime = 0;
                playCounts++;
                if (continous == true) isPlaying = true;
                if (repeat == 1) {
                    play();
                } else {
                    if (shuffle === 'true') {
                        shufflePlay();
                    } else {
                        if (repeat == 2) {
                            switchTrack(++currentTrack);
                        } else {
                            if (currentTrack < playlist.length) switchTrack(++currentTrack);
                        }
                    }
                }
            }

            var beforeLoad = function() {
                var endVal = this.seekable && this.seekable.length ? this.seekable.end(0) : 0;
                player.find('.progress .loaded').css('width', (100 / (this.duration || 1) * endVal) + '%');
            }

            // Fire when track loaded completely
            var afterLoad = function() {
                if (autoplay == true) play();
            }

            // Load track
            var loadMusic = function(i) {
                var item = playlist[i],
                    newaudio = $('<audio>').html('<source src="' + item.mp3 + '"><source src="' + item.ogg + '">').appendTo('#player');

                player.find('.tag').html('<strong>' + item.title + '</strong><span class="artist">' + item.artist + '</span><span class="album">' + item.album + '</span>');
                // player.find('#playlist li').removeClass('playing').eq(i).addClass('playing');
                audio = newaudio[0];
                audio.volume = player.find('.icon-volume-up').hasClass('enable') ? 0 : volume;
                audio.addEventListener('progress', beforeLoad, false);
                audio.addEventListener('durationchange', beforeLoad, false);
                audio.addEventListener('canplay', afterLoad, false);
                audio.addEventListener('ended', ended, false);
            }

            loadMusic(currentTrack);
            player.find('.icon-play').on('click', function() {
                if ($(this).hasClass('icon-pause')) {
                    pause();
                } else {
                    play();
                }
            });
            player.find('.icon-forward').on('click', function() {
                if (shuffle === 'true') {
                    shufflePlay();
                } else {
                    switchTrack(--currentTrack);
                }
            });
            player.find('.icon-backward').on('click', function() {
                if (shuffle === 'true') {
                    shufflePlay();
                } else {
                    switchTrack(++currentTrack);
                }
            });

            if (shuffle === 'true') player.find('.icon-random').addClass('enable');
            if (repeat == 1) {
                player.find('.repeat').addClass('once');
            } else if (repeat == 2) {
                player.find('.repeat').addClass('all');
            }

            player.find('.icon-repeat').on('click', function() {
                if ($(this).hasClass('once')) {
                    repeat = localStorage.repeat = 2;
                    $(this).removeClass('once').addClass('all').addClass('icon-refresh');
                } else if ($(this).hasClass('all')) {
                    repeat = localStorage.repeat = 0;
                    $(this).removeClass('all').removeClass('icon-refresh');
                } else {
                    repeat = localStorage.repeat = 1;
                    $(this).addClass('once');
                }
            });

            player.find('.icon-random').on('click', function() {
                if ($(this).hasClass('enable')) {
                    shuffle = localStorage.shuffle = 'false';
                    $(this).removeClass('enable');
                } else {
                    shuffle = localStorage.shuffle = 'true';
                    $(this).addClass('enable');
                }
            });
        }
    };

    $.ukagaka.defaults = {
        googleKey: '0ArRwmWo93u-mdG93a2dkSWxIbHEzZjRIeDdxZXdsU1E',
        googleFormkey: '1xADUIiBq1ksH7lxwSch1Nz_p2gSxdJttmv5OJOxJye0',
        googleSheet: "od6",
        googleSheetField: "entry.2030600456",
        talkTime: 15000,

        ukagakaText: "千代",
        loadingText: ' .^100.^100.',
        learnPlaceholder: "default: input for learn.",
        menuMainText: "使用選單功能&#65292; 為什麼要聽你的！",
        menuLearnText: "$ 學習",
        menuLogText: "$ 日誌",
        menuExitText: "$ 結束",
        menuCancelText: "$ 取消",
        menuSubmitText: "$ 確認",
        menuQueryText: "請輸入想要讓千代學的話<br/><br/>",
        logText: "更新日誌<br/><br/>Morris 修正<br/><br/>找尋 AI 系統<br/>找尋 AI 對話<br/>",
        imgs: ['img/uk12.png', 'img/uk13.png', 'img/uk14.png', 'img/uk15.png', 'img/uk16.png', 'img/uk17.png', 'img/uk18.png'
                , 'img/uk20.png', 'img/uk21.png', 'img/uk23.png', 'img/uk24.png', 'img/uk25.png', 'img/uk26.png']
    };

    $.ukagaka.talking = [];

    $.ukagaka.talkValid = true;
    $.ukagaka.nextText = '';
    $.ukagaka.nowText = '';

})(jQuery);