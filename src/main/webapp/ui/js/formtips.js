/**
 * 表单提示插件
 * @namespace 	$.ui
 * @class formtips
 * @extends		$.widget
 * @author      derrickliu
 * @version     1.1
 * @example
 * $(selector).formtips({
 * 	msg: '电话格式错误',
 * 	position: 'top'
 * });
 */
(function($){
	$.widget('ui.formtips',{
		version: '1.1',
		options: {
			/**
			 * 提示文本
			 * @property msg
			 * @type {String}
			 * @default ''
			 * @link sss
			 */
			msg: '',	
			/**
			 * 提示语显示的相对位置，顶部top，底部bottom，左侧left，右侧right。默认顶部top
			 * @property position
			 * @type {String}
			 * @default 'top'
			 */
			position: 'top'
		},
		
		_create: function(){
			// this._on(this.element,{
			// 	focus: '_hide'
			// });
		},
		
		_init: function(){
			if(!this.tips){
				this.tips = $('<div>')
					.addClass('form-tips ui-state-error ui-corner-all')
					
					.appendTo('body');
			}
			this.tips.html('<span class="ui-icon ui-icon-alert"></span>' + this.option('msg'));
			var 
			targetPosition = this.element.offset(),
			left = targetPosition.left, 
			top = targetPosition.top;
			
			switch(this.options.position){
			case 'right'	: left += this.element.outerWidth(); break;
			case 'bottom'	: top += this.element.outerHeight(); break;
			case 'left'		: left -= this.tips.outerWidth(); break;
			default			: top -= this.tips.outerHeight(); break;
			}
			this.tips.css({
				left : left,
				top: top
			});
			
			if(top < $(window).scrollTop()){
				$(window).scrollTop(top);
			}
			
			this._on(this.document,{
				mousedown: '_hide'
			});
		},
		
		_hide: function(){
			if(this.tips){
				this.tips.remove();
				this.tips = null;
				this._off(this.document,'mousedown');
			}
		}
	});
})(jQuery);