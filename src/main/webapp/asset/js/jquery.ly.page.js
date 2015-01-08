/**
 * 翻页插件
 * 
 * @namespace 	$.ui
 * @class page
 * @extends		$.widget
 * @author      derrickliu
 * @version     1.1
 * @example
 * $(selector).page({
 * 	pageNo: 1,
 * 	pageSize: 100,
 * 	pageTotal: 1000,
 * 	pageCount: 10	//pageTotal / pageSize
 * 	//点击翻页、跳转的回调
 * 	jump: function(event,options){}
 * });
 */
(function($){
	$.widget('ui.page',{
		version: '1.1',
		options: {
			/**
			 * 当前页码
			 * 
			 * @property pageNo
			 * @type {Number} 
			 * */
			pageNo: 0,
			/**
			 * 每页显示的列表数
			 * 
			 * @property pageSize
			 * @type {Number} 
			 * */
			pageSize: 0,
			/**
			 * 总的列表数
			 * 
			 * @property pageTotal
			 * @type {Number} 
			 * */
			pageTotal: 0,
			/**
			 * 总页数，总的列表数 / 每页显示的列表数
			 * 
			 * @property pageCount
			 * @type {Number} 
			 * */
			pageCount: 0,
	    	
	    	//callbacks
			/**
			 * 点击翻页、跳转的回调
			 * 
			 * @event jump
			 * @param {Event} event jQuery event Object
			 * @param {Object} options {pageNo: 2, pageSize: 100}
			 * @example
			 * $(selector).accrodion({ 
			 * 	click: function(event,options){
			 * 		//code
			 * 	} 
			 * });
			 */
	    	jump: null
		},
		_create: function(){
			this._createPageBar();
			// this.update();
			
			this.element
				.delegate('a', 'click', $.proxy(this, '_pageBtnClick'))
				.delegate(':text', {
					'keypress': $.proxy(this, '_keypressFilter'),
					'keyup': $.proxy(this, '_pageTextJump')
				});
		},
		_init: $.noop,
		
		/**
		 * 更新翻页的表现
		 * 
		 * @method update
		 * @example
		 * 显示第一项
		 * $(selector).page('update');
		 */
		update: function(){
			var firstStatus = false,
				prevStatus = false,
				nextStatus = false,
				lastStatus = false;
		
			if(this.options.pageNo == 1){
				firstStatus = prevStatus = true;
				
			}
			if(this.options.pageNo == this.options.pageCount){
				nextStatus = lastStatus = true;
			}

			this._first.button({
				disabled: firstStatus
			});
			this._prev.button({
				disabled: prevStatus
			});

			this._next.button({
				disabled: nextStatus
			});
			this._last.button({
				disabled: lastStatus
			});

			this._total.text('共' + this.options.pageTotal + '条');
			this._countBar
				.find('.page-count-text').val(this.options.pageNo)
				.end()
				.find('.page-count').text(this.options.pageCount);
			this._sizeBar.find('.page-size-text').val(this.options.pageSize);
		},

		_createPageBar: function(){
			this._total = $('<sapn>').addClass('page-total');
			this._first = $('<li>').append($('<a href="#">').addClass('page-first').text('第一页'));
			this._prev = $('<li>').append($('<a href="#">').addClass('page-prev').text('上一页'));
			this._countBar = 
					$('<span>')
					.addClass('page-count-bar')
					.html('第<input type="text" class="text page-count-text" value="1" title="按回车键跳转" /> /<span class="page-count">1</span>页');
			this._next = $('<li>').append($('<a href="#">').addClass('page-next').text('下一页'));
			this._last = $('<li>').append($('<a href="#">').addClass('page-last').text('最后一页'));
			this._sizeBar = 
					$('<sapn>')
					.addClass('page-size-bar')
					.html('<input type="text" class="text page-size-text" value="0" title="按回车键跳转" /> 条/页');
			this.element
				.append(this._total)
				.append(this._first)
				.append(this._prev)
				.append(this._countBar)
				.append(this._next)
				.append(this._last)
				.append(this._sizeBar);
		},
		
		_jump: function(){
			var o = this.options;
			if(o.pageNo > o.pageCount) o.pageNo = o.pageCount;
			else if(o.pageNo < 1) o.pageNo = 1;
			
			this._trigger('jump', null, {pageNo: o.pageNo, pageSize: o.pageSize});
		},
		
		_pageBtnClick: function(e){
			var t = $(e.currentTarget),
				className = /(page-\w{4,5})/.exec(t.attr('class'))[1],
				o = this.options;
			switch(className){
			case 'page-next':
				o.pageNo++;
				break;
			case 'page-prev':
				o.pageNo--;
				break;
			case 'page-first':
				o.pageNo = 1;
				break;
			case 'page-last':
				o.pageNo = o.pageCount;
				break;
			}
			this._jump();
			return false;
		},
		
		_keypressFilter: function(e){
			if(!/^\d+$/.test(String.fromCharCode(e.charCode)) && e.charCode > 9 && !e.ctrlKey){
				e.preventDefault();
			}
		},
		
		_pageTextJump: function(e){
			var t = $(e.currentTarget),
				value = t.val();
			if(t.is('.page-count-text')){
				this.options.pageNo = parseInt( value, 10 );
			}else{
				this.options.pageSize = parseInt( value, 10 );
			}
			if(e.keyCode == 13){
				this._jump();
			}
		}
	});
})(jQuery);