(function($) {
	//序列化form表单的数据，返回的结果类似:{name1: value1, name2: value2}
	//调用方式：$(selector).serializeObj(options);
	//options可选，是不在form表单里面的数据，需要添加进去的参数
	$.fn.extend({
		serializeObj: function(options, traditional){
			var arrs = this.serializeArray(),
				i = 0,
				j = arrs.length,
				obj = {},
				value,
				name;
			for (; i < j; i++) {
				value = arrs[i].value;
				name = arrs[i].name;
				if(this.find('[name='+ name +']').attr('notrim') === undefined){
					value = $.trim(value);
				}
				if(obj[name]){
					if(traditional){
						if(obj[name] instanceof Array){
							obj[name].push(value);
						}else{
							obj[name] = [obj[name],value];
						}
					}else{
						obj[name] += ',' + value;
					}
				}else{
					obj[name] = value;
				}
			}
			return $.extend({},options,obj);
		},
		serializeStr: function(traditional){
			var obj = this.serializeObj({},traditional),
				tempArrs = [];
			$.each(obj,function(i,n){
				if(n instanceof Array){
					$.each(n,function(j,m){
						tempArrs.push(i + '=' + encodeURIComponent(m));
					});
				}else{
					tempArrs.push(i + '=' + encodeURIComponent(n));
				}
			});
			return tempArrs.join('&').replace(/%20/g, '+');
		}
	});

	//弹iframe窗口的方法,
	//调用方式：$.dialogiframe(id/*窗口id*/,url,options/*窗口参数，跟dialog一样*/)
	$.extend({
		dialogiframe: function(id,url,options){
			var div = $('#' + id),
				iframe;
			if(div.length){
				iframe = div.find('iframe');
				if(url == iframe.attr('src')){
					div.dialog('open');
					return;
				}else{
					div.remove();
				}
			}
			div = $('<div>').attr('id',id).addClass('dialog-iframe-box');
			iframe = $('<iframe>').attr({
				// src: url,
				width: '100%',
				height: '100%'
			});
			div.append(iframe).appendTo('body');
			iframe.attr('src',url);
			div.dialog(options);
		}
	});

	
	//重置系统的alert、confirm方法，$.alert();
	$.extend({
		alert: function(msg,callback) {
			var 
			icon = $('<span>').addClass('ui-icon ui-icon-alert'),
			cnt = $('<div>').addClass('cnt').html(msg),
			div = $('<div>')
				.attr('title','系统提示')
				.addClass('alert')
				.append(icon)
				.append(cnt)
				.appendTo('body');
			div.dialog({
				modal: true,
				buttons: {
					'确 定': function(){
						$(this).dialog('close');
					}
				},
				close: function(argument){
					if($.isFunction(callback)) callback();
					$(this).remove();
					div = null;
				}
			});
		},
		confirm: function(msg,callback){
			var 
			icon = $('<span>').addClass('ui-icon ui-icon-alert'),
			cnt = $('<div>').addClass('cnt').html(msg),
			div = $('<div>')
				.attr('title','系统提示')
				.addClass('alert')
				.append(icon)
				.append(cnt)
				.appendTo('body');
			div.dialog({
				modal: true,
				buttons: {
					'取 消': function() {
						$(this).dialog('close');
					},
					'确 定': function(){
						if($.isFunction(callback)) callback();
						$(this).dialog('close');
					}
				},
				close: function(argument){
					$(this).remove();
					div = null;
				}
			});
		}
	});

	/*********overflowtips**********/
	$(function(){
		//单行
		$('.overflow-tips-one-line').tooltip({
			items: '.overflow-tips-one-line',
			content: function(){
				return $(this).html();
			},
			tooltipClass: 'custom-tooltip'
		});
		//多行
		$('.overflow-tips-multi-line').tooltip({
			items: '.overflow-tips-multi-line',
			content: function(){
				return $(this).html();
			}
		});
	});

	//表单自动收缩
	$(function(){
		var formbox = $('.form-box'),
			formtitle = formbox.find('.form-title'),
			tips = $('<span>').addClass('form-title-tips').text('点击此处可以折叠/打开');

		if(!formbox.length){
			return;
		}


		formtitle.append(tips);
		formbox.accordion({
			collapsible: true
		});

		formbox.on('submit',function(e){
			$('.form-box').accordion('option','active',1);
		});
	});

	//表单高级简单搜索
	$(function(){
		var lm = $('.form-less-more'),
			tagName = '',
			trs = null,
			hideTrs = null,
			hideInputs = null;
		//把带.less-search及其以上的tr显示
		// $('.less-more').find('.less-search').last().show().prev().show();
		
		if(!lm.length){
			return;
		}
		tagName = lm[0].tagName.toLowerCase();

		if(tagName === 'table'){
			trs = lm.find('tr');
		}else if(tagName === 'ul'){
			trs = lm.find('li');
		}

		hideTrs = trs.not('.less-search');
		hideInputs = hideTrs.find(':input');

		//disabled掉隐藏的:input
		hideInputs.attr('disabled',true);

		//从简单切到高级
		$('.ui-btn-zoomin').live('click',function(){
			hideTrs.show();
			if(tagName === 'ul'){
				$.autoLayout();
			}
			hideInputs.removeAttr('disabled');
			$(this).button('destroy')
				.removeClass('ui-btn-zoomin').addClass('ui-btn-zoomout').text('简单查询')
				.button({
					icons: {
						primary: "ui-icon-zoomout"
					}
				}).blur();
		});

		//从高级切到简单
		$('.ui-btn-zoomout').live('click',function(){
			hideTrs.hide();
			hideInputs.attr('disabled',true);
			$(this).button('destroy')
				.removeClass('ui-btn-zoomout').addClass('ui-btn-zoomin').text('高级查询')
				.button({
					icons: {
						primary: "ui-icon-zoomin"
					}
				}).blur();
		});

		
	});

	//ajax set
	$(function(){
		//ajax全局设置
		$.ajaxSetup({
			// dataType: 'json',
			type: 'POST',
			cache: false
		});
		var isErr = false;
		//ajax tips
		function ajaxStart(){
			isErr = false;
			var loading = $('#ajaxLoading');
			if(!loading.length){
				loading = createLoading();
			}
			loading.removeClass()
				.addClass('ajax-succ')
				.text('正在加载...')
				.show();
		}

		function ajaxStop(){
			var time = isErr ? 5000 : 0;
			$('#ajaxLoading').delay(time).fadeOut(500);
		}

		function ajaxError(event,request,settings){
			isErr = true;
			var loading = $('#ajaxLoading');
			if(!loading.length){
				loading = createLoading();
			}
			loading.removeClass()
				.addClass('ui-state-error')
				.text('请求出错：' + settings.url)
				.show();
		}

		function createLoading(){
			var loading = $('<div>')
					.attr('id','ajaxLoading')
					.appendTo('body');
			return loading;
		}
		//ajax状态显示
		$('body')
			.ajaxStart(ajaxStart)
			.ajaxStop(ajaxStop)
			.ajaxError(ajaxError);
	});
})(jQuery);