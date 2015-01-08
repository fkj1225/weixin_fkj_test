/**
 * 下拉层，主要是用于需要点击下拉层，点击其他地方隐藏层
 * @namespace   $.ui
 * @class downlayer
 * @extends {$.widget}
 * @version     1.1
 * @author      derrickliu
 */
(function($){
	$.widget('ui.downlayer',{
		version: '1.1',
		
		options: {
			/**
			 * 目标层，点击后显示的层，值是string类型的选择器(selector)，比如target: '#dropHelpBox'
			 * @property target
			 * @type {String}
			 * @default ''
			 * @example
			 * $(selector).downlayer({
			 * target: '#dropHelpBox'
			 * });
			 * @example
			 * $(selector).downlayer('option','target','#dropHelpBox');
			 */
			target: '',
			/**
			 * 下拉层显示后，给点击的目标dom对象增加一个css类
			 * @property tgClass
			 * @type {String}
			 * @default 'droped'
			 */
			tgClass: 'droped',
			/**
			 * 偏移量控制
			 * @property margin
			 * @type {Object}
			 * @default {l: 0, r: 0, b: 0, t: 0}
			 */
			margin: {l: 0, r: 0, b: 0, t: 0},
			/**
			 * 是否相对于当前document偏移
			 * @property offset
			 * @type {Boolean}
			 * @default true
			 */
			offset: true,
			/**
			 * 相对显示位置
			 * @property position
			 * @type {String}
			 * @default 'b'
			 */
			position: 'b',
			/**
			 * 触发的事件类型，支持click、hover
			 * @property eventType
			 * @type {String}
			 * @default 'click'
			 */
			eventType: 'click',

			/**
			 * 是否立即触发
			 * @property isFire
			 * @type {Boolean}
			 * @default false
			 */
			isFire: false,
			
			//callback
			/**
			 * 显示下拉层之前触发的回调
			 * 
			 * @event beforeShow
			 * @param {Event} event jQuery event Object
			 * @example
			 * $(selector).downlayer({ 
			 * 	beforeShow: function(event){
			 * 		//code
			 * 	} 
			 * });
			 * @example
			 * $(selector).accrodion('option', 'beforeShow', function(event){});
			 */
			beforeShow: null,
			/**
			 * 显示下拉层之后触发的回调
			 * 
			 * @event afterShow
			 * @param {Event} event jQuery event Object
			 * @example
			 * $(selector).downlayer({ 
			 * 	afterShow: function(event){
			 * 		//code
			 * 	} 
			 * });
			 * @example
			 * $(selector).accrodion('option', 'afterShow', function(event){});
			 */
			afterShow: null,
			/**
			 * 隐藏下拉层之前触发的回调
			 * 
			 * @event beforeHide
			 * @param {Event} event jQuery event Object
			 * @example
			 * $(selector).downlayer({ 
			 * 	beforeHide: function(event){
			 * 		//code
			 * 	} 
			 * });
			 * @example
			 * $(selector).accrodion('option', 'beforeHide', function(event){});
			 * */
			beforeHide: null,
			/**
			 * 隐藏下拉层之后触发的回调
			 * 
			 * @event afterHide
			 * @param {Event} event jQuery event Object
			 * @example
			 * $(selector).downlayer({ 
			 * 	afterHide: function(event){
			 * 		//code
			 * 	} 
			 * });
			 * @example
			 * $(selector).accrodion('option', 'afterHide', function(event){});
			 * */
			afterHide: null
		},
		
		_create: function(){
			if (this.options.eventType == 'hover') {
				this.element.live('mouseenter', $.proxy(this,'_show'));
				this.element.live('mouseleave', $.proxy(this,'_hoverhide'));
				$(this.options.target).die('mouseleave', $.proxy(this,'_targethide'));
				$(this.options.target).live('mouseleave', $.proxy(this,'_targethide'));
			}else{
				this.element.live('click', $.proxy(this,'_show'));
			}
			if(this.options.isFire){
				this.element.trigger('mouseenter');
			}
		},
		
		_init: $.noop,
		
		_show: function(){
			// if($(this.options.target).is(':visible')) return;
			if(this._trigger('beforeShow', null) === false) return;
			var element = this.element,
				margin = this.options.margin,
				target = $(this.options.target),
				offset = this.options.offset ? element.offset(): element.position(),
				l,t;
			switch(this.options.position){
	            case 'b':
	                l = offset.left + (element.outerWidth() - target.outerWidth()) / 2 + margin.l;
	                t = offset.top + element.outerHeight() + margin.t;
	                break;
	            case 't':
	            	l = offset.left + (element.outerWidth() - target.outerWidth()) / 2 + margin.l;
	            	t = offset.top - element.outerHeight() + margin.t;
	            	break;
	            case 'r':
	                l = offset.left + element.outerWidth() + margin.l;
	                t = offset.top + margin.t;
	                break;
	            case 'l':
	                l = offset.left - target.outerWidth() + margin.l;
	                t = offset.top + margin.t;
	                break;
	        }
			element.addClass(this.options.tgClass);
			target.css({ left: l, top: t }).show();
			
			if (this.options.eventType != 'hover') {
				this.tempNamespace = 'downlayer' + new Date().getTime();
				this.document.bind('click.' + this.tempNamespace,$.proxy(this,'_docClick'));
			}
			this._trigger('afterShow', null);

		},
		
		_hide: function(relatedTarget){
			if(this._trigger('beforeHide', null,relatedTarget) === false) return;
			this.element.removeClass(this.options.tgClass);
			$(this.options.target).hide();
			this.document.unbind('click.' + this.tempNamespace);
			this._trigger('afterHide', null,relatedTarget);
		},
		
		_docClick: function(e){
			var t = $(e.target);
			if(t.closest(this.element).length) {
				$(this.options.target).show();
				return;
			}
			this._hide(t);
		},

		_hoverhide: function(e){
			var t = $(e.relatedTarget);
			if (t.closest(this.options.target).length) {
				return;
			}
			this._hide(t);
		},

		_targethide: function(e){
			var t = $(e.relatedTarget);
			if (t.closest(this.element).length) {
				return;
			}
			this._hide(t);
		}
	});
})(jQuery);