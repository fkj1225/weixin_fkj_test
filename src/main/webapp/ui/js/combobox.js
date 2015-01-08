/**
 * combobox，主要是用于select ui初始化
 * @namespace   $.ui
 * @class combobox
 * @extends		$.widget
 * @version     1.1
 * @author      derrickliu
 */
(function( $ ) {
	$.widget( 'ui.combobox', {
		options: {
			/**
			 * 是否只读，只能通过点击下拉，不能输入，默认为false
			 * @property readonly
			 * @type {Boolean}
			 * @default false
			 */
			readonly: false,

			/**
			 * 是否不可操作，默认为false
			 * @property disabled
			 * @type {Boolean}
			 * @default false
			 */
			disabled: false,
			//callbacks

			/**
			 * 更改选项的时候触发
			 * 
			 * @event change
			 * @param {Event} event jQuery event Object
			 * @param {Dom} option dom Object
			 * @example
			 * $(selector).combobox({ 
			 * 	change: function(event, option){
			 * 		//code
			 * 	} 
			 * });
			 */
			change: null,

			/**
			 * 选择选项的时候触发
			 * 
			 * @event select
			 * @param {Event} event jQuery event Object
			 * @param {Dom} option dom Object
			 * @example
			 * $(selector).combobox({ 
			 * 	select: function(event, option){
			 * 		//code
			 * 	} 
			 * });
			 */
			select: null
		},
		_create: function() {
			this.wrapper = $( '<span>' )
				.addClass( 'ui-combobox' )
				.insertAfter( this.element );

			this.element.hide();
			this._createAutocomplete();
			this._createShowAllButton();
			if(this.options.disabled === true){
				this._setOption('disabled',true);
			}
		},

		_createAutocomplete: function() {
			var selected = this.element.children( ':selected' ),
				value = selected.val() ? selected.text() : '';

			this.input = $( '<input>' )
				.appendTo( this.wrapper )
				.val( value )
				.attr( 'title', '' )
				.addClass( 'ui-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left' )
				.attr('readonly',this.options.readonly);

			//如果设置了需要验证，把验证转移到input
			var rules = this.element.attr('rules');
			if(rules !== undefined){
				this.input.attr('rules',rules);
				this.element.removeAttr('rules');
			}

			this.input.autocomplete({
					delay: 0,
					minLength: 0,
					source: $.proxy( this, '_source' ),
					position: {
						collision: 'flipfit'
					}
				})
				.tooltip({
					tooltipClass: 'ui-state-highlight'
				});

			this._on( this.input, {
				autocompleteselect: function( event, ui ) {
					if(ui.item.option.selected !== true){
						ui.item.option.selected = true;

						//触发绑定在select上onchange事件，不建议直接在select上面绑定change事件
						this.element.trigger('change');

						//触发自定义的回调change事件
						this._trigger( 'change', event, {
							item: ui.item.option
						});
					}
					this._trigger( 'select', event, {
						item: ui.item.option
					});
				},

				autocompletechange: '_removeIfInvalid'
			});
		},

		_createShowAllButton: function() {
			var options = this.options,
				input = this.input,
				wasOpen = false;

			this.button = $( '<a>' )
				.attr( 'tabIndex', -1 )
				// .attr( 'title', 'Show All Items' )
				// .tooltip()
				.appendTo( this.wrapper )
				.button({
					icons: {
						primary: 'ui-icon-triangle-1-s'
					},
					text: false,
				})
				.removeClass( 'ui-corner-all' )
				.addClass( 'ui-combobox-toggle ui-corner-right' )
				.mousedown(function() {
					wasOpen = input.autocomplete( 'widget' ).is( ':visible' );
				})
				.click(function() {
					$(this).blur();
					input.focus();

					// Close if already visible
					if ( wasOpen ) {
						return;
					}

					// Pass empty string as value to search for, displaying all results
					input.autocomplete( 'search', '' );
				});
		},

		_source: function( request, response ) {
			var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), 'i' );
			response( this.element.children( 'option' ).map(function() {
				var text = $( this ).text();
				if ( this.value && ( !request.term || matcher.test(text) ) )
					return {
						label: text,
						value: text,
						option: this
					};
			}) );
		},

		_removeIfInvalid: function( event, ui ) {

			// Selected an item, nothing to do
			if ( ui.item ) {
				
				return;
			}

			// Search for a match (case-insensitive)
			var value = this.input.val(),
				valueLowerCase = value.toLowerCase(),
				optionItem = null,
				valid = false;
			this.element.children( 'option' ).each(function() {
				if ( $( this ).text().toLowerCase() === valueLowerCase ) {
					this.selected = valid = true;
					optionItem = this;
					return false;
				}
			});

			// Found a match, nothing to do
			if ( valid ) {
				//触发绑定在select上onchange事件，不建议直接在select上面绑定change事件
				this.element.trigger('change');

				//触发自定义的回调change事件
				this._trigger( 'change', event, {
					item: optionItem
				});
				return;
			}

			// Remove invalid value
			this.input
				.val( '' )
				.attr( 'title', '没有 ' + value + ' 的选项' )
				.tooltip( 'open' );
			this.element.val( '' );
			this._delay(function() {
				this.input.tooltip( 'close' ).attr( 'title', '' );
			}, 2500 );
			this.input.data( 'ui-autocomplete' ).term = '';
		},

		_destroy: function() {
			this.wrapper.remove();
			this.element.show();
		},
		/**
		 * 设置当前选中项，可以通过value设置，也可以通过text设置
		 * @method select
		 * @param {Object} options {value: 'option的value'}
		 * @example
		 * $(selector).combobox('select', { text: 'option的文本'});
		 */
		select: function(options){
			var self = this,
				key = 'text',
				value = options.text;
			if('value' in options){
				key = 'val';
				value = options.value;
			}

			this.element.children( 'option' ).each(function() {
				if ( $( this )[key]() === value ) {
					this.selected = true;
					self.input.val($(this).text());
					return false;
				}
			});
		},

		_setOption: function(key,value){
			this._super( key, value );
			if ( key === 'disabled' ) {
				this.element.prop( 'disabled', value );
				this.input
					.toggleClass( "ui-state-disabled", !!value )
					.prop( 'disabled', value )
					.attr( "aria-disabled", value );

				this.button.button('option','disabled',value);
			}
			return this;
		},
		/**
		 * 设置enable
		 * @method enable
		 * @example
		 * $(selector).combobox('enable');
		 */
		enable: function() {
			return this._setOption( "disabled", false );
		},
		/**
		 * disable
		 * @method disable
		 * @example
		 * $(selector).combobox('disable');
		 */
		disable: function() {
			return this._setOption( "disabled", true );
		}
	});
})( jQuery );