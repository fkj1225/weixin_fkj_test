mplete,{
		_renderItem: function(ul, item) {
			this._bindPluginEvents();
			return $( "<li>" )
				.append( $( "<a>" )
					.html( (this.options.multiple ? '<input type="checkbox"'+ (item.option.selected ? ' checked' : '') +'> ' : '') + item.label ) )
				.appendTo( ul );
		},
		_bindPluginEvents: function(){
			if(this._isBind || !this.options.multiple){
				return;
			}
			this._isBind = true;
			this._bindMenuEvents();
			this._bindElementEvent();
		},
		_bindElementEvent: function() {
			this._off(this.element,'blur');
			this._on( this.element, {
				blur: function(event){
					if ( this.cancelBlur ) {
						delete this.cancelBlur;
						return;
					}

					clearTimeout( this.searching );
					// this.close( event );

					var menuElement = this.menu.element[ 0 ];
					if ( !$( event.target ).closest( ".ui-menu-item" ).length ) {
						this._delay(function() {
							var that = this;
							this.document.one( "mousedown", function( event ) {
								if ( event.target !== that.element[ 0 ] &&
										event.target !== menuElement &&
										!$.contains( menuElement, event.target ) ) {
									that.close();
								}
							});
						});
					}

					this._change( event );
				}
			} );
		},
		_bindMenuEvents: function(){
			this._off(this.menu.element,'mousedown menuselect');
			this._on( this.menu.element, {
				mousedown: function( event ) {
					// prevent moving focus out of the text field
					// event.preventDefault();

					// IE doesn't prevent moving focus even with event.preventDefault()
					// so we set a flag to know when we should ignore the blur event
					this.cancelBlur = true;
					this._delay(function() {
						delete this.cancelBlur;
					});

					// clicking on the scrollbar causes focus to shift to the body
					// but we can't detect a mouseup or a click immediately afterward
					// so we have to track the next mousedown and close the menu if
					// the user clicks somewhere outside of the autocomplete
					var menuElement = this.menu.element[ 0 ];
					if ( !$( event.target ).closest( ".ui-menu-item" ).length ) {
						this._delay(function() {
							var that = this;
							this.document.one( "mousedown", function( event ) {
								if ( event.target !== that.element[ 0 ] &&
										event.target !== menuElement &&
										!$.contains( menuElement, event.target ) ) {
									that.close();
								}
							});
						});
					}
				},
				menuselect: function( event, ui ) {
					var item = ui.item.data( "ui-autocomplete-item" ),
						previous = this.previous;

					// only trigger when focus was lost (click on menu)
					if ( this.element[0] !== this.document[0].activeElement ) {
						this.element.focus();
						this.previous = previous;
						// #6109 - IE triggers two focus events and the second
						// is asynchronous, so we need to reset the previous
						// term synchronously and asynchronously :-(
						this._delay(function() {
							this.previous = previous;
							this.selectedItem = item;
						});
					}

					if ( false !== this._trigger( "select", event, { item: item } ) ) {
						this._value( item.value );
					}
					// reset the term after the select event
					// this allows custom select handling to work properly
					this.term = this._value();

					// this.close( event );
					this.selectedItem = item;
				}
			} )
		}
	});