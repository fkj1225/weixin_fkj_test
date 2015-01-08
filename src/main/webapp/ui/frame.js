//自适应和顶部的共用收藏本站代码
$(function(){
	var win = $(window),
		box = $('.wrapper'),
		frameBox = $('.iframe-box');
	
	win.resize(resize);
	
	function resize(){
		var wh = win.height();
		box.height(wh - 34);
		frameBox.height(wh - 34 - 33);
		$('.tree').height(wh - 34 - 33 - 20);
	}
	
	resize();

	//收藏本站代码
	$.fn.addFavorite = function(l, h) {
	    return this.click(function() {
	        var t = jQuery(this);
	        if(jQuery.browser.msie) {
	            window.external.addFavorite(h, l);
	        } else if (jQuery.browser.mozilla || jQuery.browser.opera) {
	            t.attr("rel", "sidebar");
	            t.attr("title", l);
	            t.attr("href", h);
	        } else {
	            alert("请使用Ctrl+D将本页加入收藏夹！");
	        }
	    });
	};

    $('#favorite').addFavorite('运营管理系统UI',location.href);
});

$(function(){
	//左侧tabs绑定
	$('.side').tabs({
		activate: function(event,ui){
			var id = ui.newPanel.attr('id')
			if (id == 'docs') {
				getDocs();
			}
		}
	});

	//绑定demos树数据
	$('#demos').tree({
		data: demos,
		lazyload: true,
		click: treeNodeClick
	});

	function treeNodeClick(event,data){
		if(data.url){
			event.preventDefault();
			tabsAdd(data.id,data.text,data.url);
		}
		// if (data.url) {
		// 	$("#navShow").html(data.nav);
		// 	$('.support').text('技术支持：' + data.supportUser);
		// 	$("#nowMenuIdHasUrl").val(data.id);
		// 	$("#nowUrl").val(data.url);
		// 	// if($("#navSection").is(':hidden')){
		// 	// 	$("#navSection").show();
		// 	// 	$('.iframe-box').height($('.iframe-box').height() - 38);
		// 	// }
		// }
		// else{
		// 	$('.iframe-box').removeAttr('style');
		// 	$("#navSection").hide();
		// }
	}

	// function getDocs(){
	// 	$.ajax({
	// 		url: 'url',
	// 		type: 'post',
	// 		dataType: 'json',
	// 		success: getFavSuc
	// 	});
	// }

	function getDocs(){
			$('#docs').tree({
				data: docs,
				click: treeNodeClick
			});
	}

	//删除收藏
	$("#fav").on('click','.clear-fav',function(event){
		event.stopPropagation();
		var nodeid = $(event.currentTarget).attr('nodeid');
		//
	});

});

$(function(){
	//侧栏展开收缩
	$('.side-handle')
	.draggable({
		axis: 'x',
		iframeFix: true,
		delay: 100,
		opacity: .5,
		helper: 'clone',
		stop: function(event,ui){
			var left = ui.position.left;
			$('.side').width(left - 6);
			$(this).css('left',left - 1);
			$('.main').css('marginLeft',left + 6);
		}
	})
	.live('dblclick',function(){
		var t = $(this),
			left = t.position().left;
		if(left != 0){
			t.css('left', 0);
			t.data('left',left);
			$('.side').hide();
			$('.main').css('marginLeft', 6);
		}else{
			var pLeft = t.data('left');
			t.css('left', pLeft);
			$('.side').show();
			$('.main').css('marginLeft', pLeft + 6);
		}
	});
});

$(function(){
	//收藏、拷贝
	$('.btn:first').button({
		icons: {
			primary: "ui-icon-star"
		}
	})
	.on('click', addToFav)
	.next()
	.button({
		icons: {
			primary: "ui-icon-copy"
		}
	})
	.on('click', _copyUrl);

	//加入收藏
    function addToFav(){
    	$(this).blur();
    	//code here
    }

    function _copyUrl(){
    	$(this).blur();
    	$('#copyUrl')
    	.dialog({
    		modal: true,
    		shadow: true,
    		width: 400,
    		buttons: [{
    			'text': '关闭',
    			'click': function(){
    				$(this).dialog('close');
    			}
    		}]
    	});
    }

    //取消收藏
    $('#delFromfavorite').live('click',function(){
  		//code here
    });
});

$(function(){
	var hoverTimerOut = null,
		hoverTimerIn = null,
		hoverStart = 0;
		pathBar = $('.path-bar');
	function pathBarHide(speed){
		speed = speed || 0;
		clearTimeout(hoverTimerIn);
		if(new Date().getTime() - hoverStart <= 100){
			return;
		}
		hoverTimerOut = setTimeout(function(){
			pathBar.animate({
				top: '-43px' },
				600, 'easeOutQuint', function() {
				$('.path-arrow').show();
				pathBar.delay(speed).animate({
					top: '-37px',
					},
					300);
			});
			
		},1000);
	}
	function pathBarShow(){
		clearTimeout(hoverTimerOut);
		hoverStart = new Date().getTime();
		hoverTimerIn = setTimeout(function(){
			pathBar.animate({
					top: '0px' },
					200, 'easeOutQuint', function() {
					// $('.path-arrow').hide();
					
				});
			$('.path-arrow').hide();
		},100);
	}
	pathBar.hover(pathBarShow,pathBarHide);
	setTimeout(function(){pathBarHide(500)},1000);
});

$(function(){
	var tabs = $('#tabs').tabs({
		closeable: true,
		noclose: [0],
		refreshable: true,
		cors: function(event,content){
			$(event.target).find('.iframe-box').append(content);
		},
		frameRefresh: function(event,panel){
			var src = panel.attr('src');
			$('.frame-loading').show();
			panel.attr('src', src);
		}
	});

	tabs.find( ".ui-tabs-nav" ).sortable({
		axis: "x",
		stop: function() {
			tabs.tabs( "refresh" );
		}
	});

	window.tabsAdd = function(id,title,url){
		var page = $('#' + id);

		if(page.length){
			tabs.tabs('option','active', page.index());
		}else{
			var content = '<iframe name="mainFrame" src="'+ url +'" id="'+ id +'" style="padding:0;"></iframe>',
				mask = $('.frame-loading').show();
			tabs.tabs('add',id,title,content,true);

			bindFrameLoadEnd(id);
			
		}
	}

	function bindFrameLoadEnd(id){
		$('#' + id).load(function(){
			$('.frame-loading').hide();
		});
	}

	//默认绑定首页的
	bindFrameLoadEnd('tabMain');
});

