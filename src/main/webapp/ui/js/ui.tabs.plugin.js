(function(){
	var rhash = /#.*$/;

	function isLocal( anchor ) {
		return anchor.hash.length > 1 &&
			decodeURIComponent( anchor.href.replace( rhash, "" ) ) ===
				decodeURIComponent( location.href.replace( rhash, "" ) );
	}
	$.widget('ui.tabs',$.ui.tabs,{
		_processTabs: function() {
			var that = this;

			this.tablist = this._getList()
				.addClass( "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" )
				.attr( "role", "tablist" );

			this.tabs = this.tablist.find( "> li:has(a[href])" )
				.addClass( "ui-state-default ui-corner-top" )
				.attr({
					role: "tab",
					tabIndex: -1
				});

			/////////////////////////
			if(this.options.closeable){
				this._setColseEvent();
			}

			if(this.options.refreshable){
				this._setRefreshEvent();
			}
			////////////////////////
			this.anchors = this.tabs.map(function() {
					return $( "a", this )[ 0 ];
				})
				.addClass( "ui-tabs-anchor" )
				.attr({
					role: "presentation",
					tabIndex: -1
				});

			this.panels = $();

			this.anchors.each(function( i, anchor ) {
				var selector, panel, panelId,
					anchorId = $( anchor ).uniqueId().attr( "id" ),
					tab = $( anchor ).closest( "li" ),
					originalAriaControls = tab.attr( "aria-controls" );

				// inline tab
				if ( isLocal( anchor ) ) {
					selector = anchor.hash;
					panel = that.element.find( that._sanitizeSelector( selector ) );
				// remote tab
				} else {
					panelId = that._tabId( tab );
					selector = "#" + panelId;
					panel = that.element.find( selector );
					if ( !panel.length ) {
						panel = that._createPanel( panelId );
						panel.insertAfter( that.panels[ i - 1 ] || that.tablist );
					}
					panel.attr( "aria-live", "polite" );
				}

				if ( panel.length) {
					that.panels = that.panels.add( panel );
				}
				if ( originalAriaControls ) {
					tab.data( "ui-tabs-aria-controls", originalAriaControls );
				}
				tab.attr({
					"aria-controls": selector.substring( 1 ),
					"aria-labelledby": anchorId
				});
				panel.attr( "aria-labelledby", anchorId );
			});

			this.panels
				.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom" )
				.attr( "role", "tabpanel" );
		},

		_setColseEvent: function(){
			if(this._isSetColseEvent){
				return;
			}
			this._isSetColseEvent = true;




			this.tabs.append('<span title="关闭" class="ui-icon ui-icon-close"></span>');
			var that = this;
			if ( $.isArray( this.options.noclose ) ) {
				$.each(this.options.noclose,function(i,n){
					that.tabs.eq(n).addClass('ui-tabs-noclose');
				});
			}
			
			this.tablist.on('click','.ui-icon-close',function(event){
				var tab = $( this ).closest( "li" ),
					panelId = tab.attr( "aria-controls" ),
					panel = $( "#" + panelId );
				if(that._trigger( "close", event, {tab: tab, panel: panel} ) !== false){
					tab.remove();
					panel.remove();
					that.refresh();
				}
			});
		},

		_setRefreshEvent: function(){
			if(this._isSetRefreshEvent){
				return;
			}
			this._isSetRefreshEvent = true;
			this.tabs.prepend('<span title="刷新" class="ui-icon ui-icon-refresh"></span>');
			var that = this;
			this.tablist.on('click','.ui-icon-refresh',function(event){
				var tab = $( this ).closest( "li" ),
					panelId = tab.attr( "aria-controls" ),
					panel = $( "#" + panelId );
				that._trigger('frameRefresh', null, panel);
			});
		},

		add: function(tabId,tabTitle,content,cors){
			var isUrl = /http:/.test(tabId);
			
			var close = "<span class='ui-icon ui-icon-close' title='关闭'></span>",
				refresh = "<span class='ui-icon ui-icon-refresh' title='刷新'></span>",
				tabTemplate = "<li>"+ (this.options.refreshable ? refresh : '') +"<a href='#{href}'>#{label}</a> "+ (this.options.closeable ? close : '') +"</li>" ,
				li = $( tabTemplate.replace( /#\{href\}/g, '#' + tabId ).replace( /#\{label\}/g, tabTitle ) );

			this.tablist.append( li );
			this.refresh();
			var idx = li.index();
			if(cors === undefined){
				this.element.append( "<div id='" + tabId + "'>" + content + "</div>" );
			}else if(cors === true){
				this._trigger('cors', null, content);
			}else{
				this.load(idx);
			}
			this.option( "active", idx );
		},

		close: function(idx){
			var tab = this.tablist.children().eq(idx),
				panelId = tab.attr( "aria-controls" ),
				panel = $( "#" + panelId );
			tab.remove();
			panel.remove();
			this.refresh();
		},

		setTitle: function(idx,newTitle){
			var tab = this.tablist.children().eq(idx);
			tab.find('.ui-tabs-anchor').text(newTitle);
		}
	});
})(jQuery);