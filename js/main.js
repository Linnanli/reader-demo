(function (factory) {
    window.main = factory(window, void 0);
    console.log(
        'project:reader-demo\n' +
        'author:林楠力'
    );
})(function (window, undefined) {
    'use strict';
    //工具方法
    var util = {
        storagePrefix: location.hostname + '_',
        getStorage: function (name) {
            return JSON.parse(localStorage.getItem(util.storagePrefix + name));
        },
        setStorage: function (name, value) {
            localStorage.setItem(util.storagePrefix + name, JSON.stringify(value));
        },
        getSession: function (name) {
            return JSON.parse(sessionStorage.getItem(util.storagePrefix + name));
        },
        setSession: function (name, value) {
            sessionStorage.setItem(util.storagePrefix + name, JSON.stringify(value));
        }
    };

    //渲染UI view
    var readerUI = {
        navShow: false,
        ftPanelShow: false,
        ftColorData: ['#f7eee5', '#e9dfc7', '#a4a4a4', '#cdefce', '#283548', '#0f1410'],
        ftColorIndex: 0,
        ftSize: 14,
        maxFtSize: 20,
        minFtSize: 14,
        nightState: false,
        init: function () {
            this.articleMiddle = $('#articleMiddle');
            this.menuBar = $('#menuBar');
            this.fictionBox = $('#fiction_box');
            this.container = this.fictionBox.children('.fiction-continer');
            this.butBar = this.fictionBox.children('.but-bar');
            this.prevBut = this.butBar.children('.prev-but');
            this.nextBut = this.butBar.children('.next-but');
            this.menuNav = this.menuBar.find('.menu_nav');
            this.ftPanelNav = this.menuBar.find('.ft_panel_nav');
            this.nightButton = this.menuBar.find('.night_button');
            this.navBar = $('#navBar');
            this.ftPanel = $('#ftPanel');
            this.ftColor = this.ftPanel.find('.ft_color');
            this.ftColorItem = $([]);
            //字体大小按钮
            this.sizePlus = this.ftPanel.find('.size_plus');
            this.sizeLess = this.ftPanel.find('.size_less');

            //创建背景颜色选择按钮列表
            this.createBgColorList();
            //初始化字体大小
            this.setFtSize(util.getStorage('ftSize') || this.ftSize);
            //设置日夜间按钮状态
            this.setNightState(util.getStorage('nightState') || this.nightState);
            //初始化设置页面背景
            this.setFictionBg(util.getStorage('ftColorIndex') || this.ftColorIndex);
            //各个元素绑定事件
            this.eventHandle();
        },
        setFictionBg: function (index) {
            this.ftColorIndex = index;
            this.fictionBox.css('background-color', this.ftColorData[index]);
            this.ftColorItem.removeClass('active');
            this.ftColorItem.eq(index).addClass('active');
            util.setStorage('ftColorIndex', index);
        },
        setFtSize: function (size) {
            this.ftSize = size;
            util.setStorage('ftSize', size);
            this.container.css('font-size', size);
        },
        setNightState: function (nightState) {
            if (!this.nightText)
                this.nightText = this.nightButton.next()

            if (nightState) {
                this.nightButton.addClass('icon-night').removeClass('icon-day');
                this.nightText.text('夜间');
            } else {
                this.nightButton.removeClass('icon-night').addClass('icon-day');
                this.nightText.text('日间');
            }
            this.nightState = nightState;
            util.setStorage('nightState', nightState);
        },
        createBgColorList: function () {
            var list = this.ftColorData,
                item = null;
            for (var i = 0; i < list.length; i++) {
                item = $('<div class="ft-bk-but">').data('index', i);
                if (i == this.ftColorIndex)
                    item.addClass('active');

                item.css('background-color', list[i]);
                this.ftColorItem.push(item[0]);
                this.ftColor.append(item);
            }
        },
        generateContent: function (data) {
            var content = data.p;
            var html = '<h4>' + data.t + '</h4>';
            for (var i = 0; i < content.length; i++) {
                html += '<p>' + content[i] + '</p>';
            }
            this.container.html(html);
        },
        eventHandle: function () {
            var _this = this;
            //点击页面中间部分,切换导航的显示隐藏
            this.articleMiddle.on('click', function () {
                if (!_this.navShow) {
                    _this.menuBar.show();
                    _this.navBar.show();
                    _this.navShow = true;
                } else {
                    _this.menuBar.hide();
                    _this.navBar.hide();
                    _this.ftPanel.hide();
                    _this.navShow = false;
                }
            });
            //唤出字体设置面板
            this.ftPanelNav.on('click', function () {
                if (_this.ftPanelShow) {
                    _this.ftPanel.hide();
                    _this.ftPanelShow = false;
                } else {
                    _this.ftPanel.show();
                    _this.ftPanelShow = true;
                }
            });
            //监控鼠标滚动事件,关闭导航栏
            $(window).scroll(function () {
                if (_this.navShow) {
                    _this.menuBar.hide();
                    _this.navBar.hide();
                    _this.ftPanel.hide();
                    _this.navShow = false;
                }
            });
            //背景颜色选择事件绑定
            this.ftColorItem.on('click', function () {
                _this.setFictionBg(this.dataset['index']);
            });
            //增加字体大小
            this.sizePlus.on('click', function () {
                if (_this.ftSize < _this.maxFtSize) {
                    _this.ftSize += 2;
                    _this.setFtSize(_this.ftSize);
                }
            });
            //减少字体大小
            this.sizeLess.on('click', function () {
                if (_this.ftSize > _this.minFtSize) {
                    _this.ftSize -= 2;
                    _this.setFtSize(_this.ftSize);
                }
            });
            //日间和夜间的切换
            this.nightButton.on('click', function () {
                _this.nightState = !_this.nightState;
                _this.setNightState(_this.nightState);
                _this.setFictionBg(_this.nightState ? 4 : 1);
            });
            //上一页
            this.prevBut.on('click', function () {
                readerModel.prev(function(chapter){
                    $(window).scrollTop(0);
                    _this.generateContent(chapter);
                });
            });
            //下一页
            this.nextBut.on('click', function () {
                readerModel.next(function(chapter){
                    $(window).scrollTop(0);
                    _this.generateContent(chapter);
                });
            });
        }
    };

    //读取数据 model
    var readerModel = {
        chapterDir: [],
        curChapterIndx: 1,
        init:function(callback){
            //获取目录
            this.getDir(function (chapterDir) {
                this.chapterDir = chapterDir;
                this.curChapterIndx = util.getSession('curChapterIndx') || this.curChapterIndx;
                //获取文章
                this.getChapter(this.chapterDir[this.curChapterIndx].chapter_id, function (chapter) {
                    callback&&callback(chapter);
                });
            });
        },
        prev:function(callback){
            var curChapterIndx = this.curChapterIndx - 1;
            var curChapter = this.chapterDir[curChapterIndx];
            if (curChapter) {
                readerModel.getChapter(curChapter.chapter_id, function (chapter) {
                    this.curChapterIndx = curChapterIndx;
                    util.setSession('curChapterIndx', curChapterIndx);
                    callback&&callback.call(this,chapter);
                });
            }
        },
        //获取下一页数据
        next:function(callback){
            var curChapterIndx = this.curChapterIndx + 1;
            var curChapter = this.chapterDir[curChapterIndx];
            if (curChapter) {
                this.getChapter(curChapter.chapter_id, function (chapter) {
                    this.curChapterIndx = curChapterIndx;
                    util.setSession('curChapterIndx', curChapterIndx);
                    callback&&callback.call(this,chapter);
                });
            }
        },
        //获取目录
        getDir: function (callback) {
            var _this = this;
            $.ajax({
                type: 'GET',
                url: '/data/chapter.json',
                success: function (response) {
                    if (response.result == 0) {
                        callback && callback.call(_this, response.chapters);
                    }
                }
            });
        },
        //获取文章
        getChapter: function (chapterId, callback) {
            var _this = this;
            $.ajax({
                type: 'GET',
                url: '/data/data' + chapterId + '.json',
                cache: true,
                success: function (response) {
                    if (response.result == 0) {
                        var url = response.data;
                        $.ajax({
                            type: "GET",
                            url: url,
                            cache: true,
                            success: function (response) {
                                var decodeJson = $.base64.decode(response.data);
                                var resData = decodeURIComponent(escape(decodeJson));
                                callback && callback.call(_this, JSON.parse(resData));
                            }
                        });
                    }

                }
            });
        }
    };


    return function main() {
        readerUI.init();
        //初始化章节
        readerModel.init(function(chapter){
            readerUI.generateContent(chapter);
        });
    }
});