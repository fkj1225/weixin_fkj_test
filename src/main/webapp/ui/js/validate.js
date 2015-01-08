/**
 * 表单验证插件<br>
 * 注：这个方法适合批量处理表单验证，不能直接使用单个表单调用，比如：$('input').validate();
 * 一定要使用表单的包裹层去调用
 * @namespace 	$.ui
 * @class validate
 * @extends		$.widget
 * @extends		ui.formtips
 * @author      derrickliu
 * @version     1.1
 * @example
 * $('form').validate({
 * 	regexp: {
 * 		idcard: [/^\d{17}[\dxX]$/, '请输入正确的身份证号码'],
 * 		fax: [/^0\d{2,3}\-\d{7,8}$/,'请输入正确的传真，格式：020-11112222', true] //true表示可以为空
 * 		chk: [isChkOne, '最少选择一项']
 * 	}
 * });
 *	//定义一个方法，替代正则，可以做一些不好用正则去做验证的事情，返回true表示验证通过
 * function isChkOne(){
 *	//code
 * }
 * */
(function($){
	var
	inputs = ':input',
	
	urlstr = '^((https|http|ftp|rtsp|mms)?://)'  
 			+ "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@  
 			+ '(([0-9]{1,3}\.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184  
 			+ '|' // 允许IP和DOMAIN（域名） 
 			+ "([0-9a-z_!~*'()-]+\.)*" // 域名- www.  
 			+ '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.' // 二级域名  
 			+ '[a-z]{2,6})' // first level domain- .com or .museum  
 			+ '(:[0-9]{1,4})?' // 端口- :80  
 			+ '((/?)|' // a slash isn't required if there is no file name  
 			+ "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$", 
 			
    urlreg = new RegExp(urlstr);  
	
	$.widget('ui.validate',{
		version: '1.1',
		options: {
			/**
			 * 匹配规则配置项，默认配置有email,mobile,tel,qq,url,noBlank，可自定义覆盖默认
			 * 
			 * 配置项为一个数组，[正则|函数，验证错误的提示信息，是否可以为空（可选，用于一些需要验证的但不是必填项，true表示可以为空）]
			 * @property regexp
			 * @type {Object} {}
			 * @example
			 * regexp: {
			 * 	idcard: [/^\d{17}[\dxX]$/, '请输入正确的身份证号码']
			 * }
			 * */
			regexp: {
				email: [/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, '邮件格式不正确'],
				mobile: [/^1[358]\d{9}$/, '请输入正确的手机号码'],
				tel: [/^[^\u4E00-\u9FA5]+$/, '电话号码不能有中文'],
				qq: [/^\d{5,11}$/, 'qq号为5-11位数字'],
				url: [urlreg, '网址格式错误'],
				noBlank: [/[^\s]+/,'内容不能为空']
			},
			
			/**
			 * 验证出错添加的样式
			 * 
			 * @property errClassName
			 * @type {String} 
			 * @default 'text-error'
			 * */
			errClassName: 'text-error',
			/**
			 * 提示信息的位置
			 *
			 * @property position
			 * @type {String}
			 * @default 'top'
			 */
			position: 'top'
		},
		
		_create: function(){
			this.element.delegate(inputs,{
				focusout: $.proxy(this,'_validate'),
				focusin: $.proxy(this,'_hideErr'),
				click: $.proxy(this,'_hideErr')
			});
			
			if(this.element[0].tagName.toLowerCase() === 'form'){
				this._on(this.element,{
					submit: 'submit'
				});
			}
		},
		
		_init: $.noop,
		
		_validate: function(event){
			var target = $(event.currentTarget || event),
				value = target.val(),
				rules = target.attr('rules'),
				rgx, rr;
			if(!rules || value === '' && event.type === 'focusout') return true;
			
			rgx = this.option('regexp');
			rr = rgx[rules];
			if(rr !== undefined){
				if(value === ''){
					if(rr[2] === true) return true;
//					else{
//						this._showErr(target,'内容不能为空');
//						return false;
//					}
				}
				if($.isFunction(rr[0])){
					if(!rr[0](target)){
						this._showErr(target,rr[1]);
						return false;
					}
				}
				else if(rr[0] instanceof RegExp && !rr[0].test(value)){
					this._showErr(target,rr[1]);
					return false;
				}
			}
			return true;
		},
		/**
		 * 非form提交的时候，可以手动调用这个方法对整个表单来遍历一遍进行验证
		 * @method submit
		 * @return {Boolean}
		 * @example
		 * $(selector).validate('submit');
		 */
		submit: function(event){
			var bool = false,
				self = this;
			this.element.find(inputs).each(function(i,n){
				bool = self._validate(this);
				if(!bool) {
					return bool;
				}
			});
			//取消后续的submit绑定
			if(!bool && event){
				event.stopImmediatePropagation();
			}
			return bool;
		},
		
		_showErr: function(target,errMsg){
			target.addClass(this.option('errClassName'));
			target.formtips({
				msg: errMsg,
				position: this.option('position')
			});
		},
		
		_hideErr: function(event){
			$(event.currentTarget).removeClass(this.option('errClassName'));
		}
	});
})(jQuery);