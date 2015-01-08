/**
 * 表单文本框<br>
 * $(selector).textui();
 * @class textui
 * @namespace 	$.ui
 * @extends		$.widget
 * @author      derrickliu
 * @version     1.0
 * @example
 * $(selector).textui();
 */
(function($){
	$.widget('ui.textui',{
		version: '1.0',
		
		_create: function(){
			this.element.addClass('ui-state-default ui-corner-all');
			this._on(this.element,{
				focus: '_focus',
				blur: '_blur'
			});
		},
		
		_init: $.noop,

		_focus: function(){
			this.element.addClass('ui-state-highlight');
		},
		_blur: function(){
			this.element.removeClass('ui-state-highlight');
		},
		_hover: function(){
			this.element.toggleClass('ui-state-hover');
		}
	});
})(jQuery);