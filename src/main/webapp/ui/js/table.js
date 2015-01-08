/**
 * 表格插件<br>
 * 1、可设置checkbox和行数<br>
 * 2、支持排序<br>
 * 3、支持页面直出html<br>
 * @example
 * 最简单的用法
 * $(selector).table();
 * 
 * 最全面的使用
 * @example
 * 
 * $(selector).table({	
 * 	sort: true,					//是否支持排序，默认为false
 * 	singleSelect: true,			//单选，false表示可以多选，默认为单选true
 * 	hasRowNumbers: true,
 * 	hasCheckbox: true,
 * 	params: {},					//获取table列表的参数
 * 	head: [],					//定义头部，每个数组是一个对象：{name: '列字段(key)', text: '列名称', width: '列宽度', sort: true}
 * 	url: '',					//ajax获取数据的地址，返回的数据格式参考下面的data
 * 	data: null,					//页面自定义或者直接吐到页面的数据，如果设置了url，url优先
 * 	//callbacks
 * 	loadBefore: function(){}	//加载数据之前触发的回调
 * 	loadEnd: function(event,data){}		//加载数据之后触发的回调
 * 	selected: function(event,rowData){}		//选择行触发的回调
 * 	unselected: function(event,rowData){}	//取消选择行触发的回调
 * 	dblclick: function(event,rowData){}		//双击行触发的回调
 * 	allSelected: function(event,allRowData){}	//全选触发的回调
 * 	allUnSelected: function(event,allRowData){}	//取消全选触发的回调
 * });
 * @namespace   $.ui
 * @version     1.1
 * @author      derrickliu
 * @class table
 * @extends {$.widget}
 */
(function($){
	$.widget('ui.table',{
		version: '1.1',
		defaultElement: '<table>',
		options: {
			/**
			 * 是否支持排序，默认为false
			 * @property sort
			 * @type {Boolean}
			 * @default false
			 */
			sort: false,
			/**
			 * 是否只能选中一行，如果没有设置行带checkbox，默认为true，表示只能选中一行，如果设置了带checkbox，这个配置可以忽略
			 * @property singleSelect
			 * @type {Boolean}
			 * @default true
			 */
			singleSelect: true,
			/**
			 * 是否带行号，默认不带，false
			 * @property hasRowNumbers
			 * @type {Boolean}
			 * @default false
			 */
			hasRowNumbers: false,
			/**
			 * 是否带checkbox，默认不带，false
			 * @property hasCheckbox
			 * @type {Boolean}
			 * @default false
			 */
			hasCheckbox: false,
			/**
			 * 获取表格列表的参数
			 * @property params
			 * @type {Object}
			 */
			params: {					
				pageNo: 1,				//当前第几页
				pageSize: 50				//当前页可显示的列表数
			},
			/**
			 * 行的唯一标识名称，默认为'id'
			 * @property idAttribute
			 * @type {String}
			 * @default 'id'
			 * */
			idAttribute: 'id',
			/**
			 * 定义表格列表头部，数组的每个项是一个对象：
			 * {
			 * 	name: '列字段(key)', 
			 * 	text: '列名称', 
			 * 	width: '列宽度', 
			 * 	sort: true, 
			 * 	tmpl: '模板', 
			 * 	order: 'desc', 
			 * 	sortBy: '按其他字段排序',
			 * 	show: '是否显示' //默认为true
			 * }
			 * 其中name和text是必选的，其他的可选
			 * @property head
			 * @type {Array}
			 * @default []
			 */
			head: [],					
			/**
			 * ajax获取数据的地址
			 * @property url
			 * @type {String}
			 * @default ''
			 */
			url: '',					
			/**
			 * 页面自定义或者直接吐到页面的数据，如果设置url，url优先
			 * @property data
			 * @type {Object}
			 * @default null
			 * @example
			 * data: {
			 * 	list: [],		//list是个数组，每项都是一个对象，至少有一个键值对，如：{id: 1, filenName: 'xx.html', fileSize: '100M'}
			 * 	pageNo: 1,
			 * 	pageSize: 100,
			 * 	pageTotal: 1000,
			 * 	pageCount: 10
			 * }
			 */
			data: null,
			/**
			 * data里面字段的自定义配置
			 * @property dataKeyConfig
			 * @type {Object}
			 * @default 
			 * {
			 *	list: 'list',
			 *	pageNo: 'pageNo',
			 *	pageSize: 'pageSize',
			 *	pageTotal: 'pageTotal',
			 *	pageCount: 'pageCount'
			 * }
			 */
			dataKeyConfig: {
				list: 'list',
				pageNo: 'pageNo',
				pageSize: 'pageSize',
				pageTotal: 'pageTotal',
				pageCount: 'pageCount'
			},					
			
			//callbacks
			/**
			 * 加载表格数据之前触发的回调，
			 * 如果返回false将阻止table后续load，包括ajax请求、按data数据生成html。
			 * 
			 * @event loadBefore
			 * @param {Event} event jQuery event Object
			 * @example
			 * $(selector).table({ 
			 * 	loadBefore: function(event){
			 * 		//code
			 * 	} 
			 * });
			 */
			loadBefore: null,
			/**
			 * ajax拿到数据后，用这个方法可以处理你的原始数据，这个方法需要返回处理好的数据
			 * 
			 * @event origin
			 * @param {Object} data {}
			 * @return {Object} data {}
			 * @example
			 * $(selector).table({ 
			 * 	origin: function(data){
			 * 		//返回的data为当前页面获得的表格数据
			 *		//return data;	
			 * 	} 
			 * });
			 */
			origin: null,
			/**
			 * 拿到数据后，用这个方法可以处理进过dataKeyConfig配置后的原始数据，这个方法需要返回处理好的数据
			 * 
			 * @event process
			 * @param {Object} data {}
			 * @return {Object} data {}
			 * @example
			 * $(selector).table({ 
			 * 	process: function(data){
			 * 		//返回的data为当前页面获得的表格数据
			 *		//return data;	
			 * 	} 
			 * });
			 */
			process: null,
			/**
			 * 加载表格数据之后触发的回调
			 * 
			 * @event loadEnd
			 * @param {Event} event jQuery event Object
			 * @param {Object} data {}
			 * @example
			 * $(selector).table({ 
			 * 	loadEnd: function(event,data){
			 * 		//返回的data为当前页面获得的表格数据
			 * 	} 
			 * });
			 */
			loadEnd: null,
			/**
			 * 点击行触发的回调
			 * 
			 * @event click
			 * @param {Event} event jQuery event Object
			 * @param {Object} rowData {}
			 * @example
			 * $(selector).table({ 
			 * 	click: function(event,rowData){
			 * 		//返回的rowData为当前行的数据
			 * 	} 
			 * });
			 */
			click: null,
			/**
			 * 选择行触发的回调
			 * 
			 * @event selected
			 * @param {Event} event jQuery event Object
			 * @param {Object} rowData {}
			 * @example
			 * $(selector).table({ 
			 * 	selected: function(event,rowData){
			 * 		//返回的rowData为当前行的数据
			 * 	} 
			 * });
			 */
			selected: null,				
			/**
			 * 取消选择行触发的回调
			 * 
			 * @event unselected
			 * @param {Event} event jQuery event Object
			 * @param {Object} rowData {}
			 * @example
			 * $(selector).table({ 
			 * 	unselected: function(event,rowData){
			 * 		//返回的rowData为当前行的数据
			 * 	} 
			 * });
			 */
			unselected: null,			
			/**
			 * 双击行触发的回调
			 * 
			 * @event dblclick
			 * @param {Event} event jQuery event Object
			 * @param {Object} rowData {}
			 * @example
			 * $(selector).table({ 
			 * 	dblclick: function(event,rowData){
			 * 		//返回的rowData为当前行的数据
			 * 	} 
			 * });
			 */
			dblclick: null,				
			/**
			 * 全选触发的回调
			 * 
			 * @event allSelected
			 * @param {Event} event jQuery event Object
			 * @param {Array} allRowData []
			 * @example
			 * $(selector).table({ 
			 * 	allSelected: function(event,allRowData){
			 * 		//返回的allRowData为当前页面所有行的数据
			 * 	} 
			 * });
			 */
			allSelected: null,			
			/**
			 * 取消全选触发的回调
			 * 
			 * @event allUnSelected
			 * @param {Event} event jQuery event Object
			 * @param {Array} allRowData []
			 * @example
			 * $(selector).table({ 
			 * 	allUnSelected: function(event,allRowData){
			 * 		//返回的allRowData为当前行的数据
			 * 	} 
			 * });
			 */
			allUnSelected: null,
			/**
			 * 排序的回调，table为直出的html需要排序功能可以使用
			 * 
			 * @event sortStart
			 * @param {Event} event jQuery event Object
			 * @param {Object} sortParams {}
			 * @example
			 * $(selector).table({ 
			 * 	sortStart: function(event,sortParams){
			 * 		//sortParams = {sortBy: '排序的字段', order: '升序|降序', pageNo: 1}
			 * 	} 
			 * });
			 */
			sortStart: null,
			/**
			 * 排序的回调，table为直出的html需要排序功能可以使用
			 * 
			 * @event sortEnd
			 * @param {Event} event jQuery event Object
			 * @param {Object} ui {}
			 * @example
			 * $(selector).table({ 
			 * 	sortEnd: function(event,ui){
			 		//ui = {
						current: {},
						old: []
			 		}
			 * 	} 
			 * });
			 */
			sortEnd: null,
			/**
			 * ajax获取数据错误的回调
			 * 
			 * @event error
			 * @param {Xhr} xhr
			 * @param {String} msg
			 * @example
			 * $(selector).table({ 
			 * 	error: function(xhr,msg){
			 * 		//alert('错误：' + xhr.responseText);
			 * 	} 
			 * });
			 */
			error: null			
		},
		_create: function(){
			//检验是否localStorage存有head字段
			var _head = null;
			if(localStorage){
				_head = localStorage.getItem(this._getLocalStorageItemId());
				if(_head){
					this.options.head = null;
					this.options.head = $.parseJSON(_head);
				}
			}

			this._createThead();
			if(this.options.page){
				$(this.options.page).page({
					jump: $.proxy(this,'_pageJump')
				});
			}
			
			this._getData();
			var that = this;
			this.element
				.delegate('tbody tr', {
					'mouseenter': $.proxy(this,'_mouseenter'),
					'mouseleave': $.proxy(this,'_mouseleave'),
					'click': $.proxy(this,'_click'),
					'dblclick': $.proxy(this,'_dblclick')
				})
				.delegate('thead :checkbox','click', $.proxy(this, '_selectAll'))
				
				.on('click','thead .sort',$.proxy(this,'_sort'))

				.on('mousemove', 'thead th', $.proxy(this, '_dragGuid'))
				
				.on('mousedown', '.e-resize', $.proxy(this, '_drag'))

				.on('click', '.thead-set', $.proxy(this,'_setThead'));
		},
		
		_init: $.noop,
		
		_createThead: function(){
			if(!this.options.head || !this.options.head.length) return;

			var headLen = this.options.head.length,
				heads = [],
				sort = this.options.sort;
			$.each(this.options.head,function(i,n){
				if(n.show !== false){
					var text = n.text;
					if(n.sort || sort === true && n.sort != false){
						var order = '';
						if(n.order){
							order = ' ' + n.order;
						}
						text = '<a href="" class="sort'+ order +'" name="'+ (n.sortBy || n.name) +'">'+ text +'<span class="oi"></span></a>';	
					} 
					
					heads.push('<th '+ (n.width ? 'width="'+ n.width +'"' : '') +'>' + text + '</th>');
				}
			});

			this.element.append('<thead class="ui-state-default"><tr>' + heads.join('') + '</tr></thead>');
			//最后一个单元格加上设置
			this.element.find('th:last').append('<a href="#" class="thead-set ui-icon ui-icon-gear" title="表头设置"></a>');
		},
		
		_getData: function(){
			if(this._trigger('loadBefore', null) === false) return;
			if(!this.options.url && !this.options.data) return;
			var tbody = this.element.find('tbody');
			if(!tbody.length){
				tbody = $('<tbody>').appendTo(this.element);
			}
			tbody.html(this._createSingleTr('正在加载...'));
			var self = this,
				params = this.options.params;
			if(this.options.url){
				$.ajax({
					url: this.options.url,
					type: 'POST',
					data: params,
					dataType: 'json',
					success: function(json){
						var _json = json;
						if(self.options.origin){
							var origin = self.options.origin;
							_json = origin.call(self.element[0],json) || json;
						}
						
						self._createByData(self._dataCofig(_json),'url');
					},
					error: function(xhr,msg){
						if(self.options.error){
							self.options.error(xhr,msg);
							return;
						}
						$.alert('错误：' + xhr.responseText);
					}
				});
			}else if(this.options.data){
				var d = this._dataCofig(this.options.data,'data'),
					data = null,
					i = 0,
					len = d.list.length;
				if(d.pageNo == undefined){
					data = {
						list: []
					}
				}else{
					data = {
						pageNo: d.pageNo,
						pageSize: d.pageSize,
						pageTotal: d.pageTotal,
						pageCount: d.pageCount,
						list: []
					};
					data.pageNo = Math.min( data.pageNo, data.pageCount );
					i = ( data.pageNo - 1 ) * data.pageSize;
					len = Math.min( data.pageNo * data.pageSize, data.pageTotal );
				}
				
				for(; i < len; i++){
					data.list.push(d.list[i]);
				}
				this._createByData(data);

				this._dealWithData = data;
			}
		},

		_dataCofig: function(data,type){
			var dkc = this.options.dataKeyConfig;

			this._dealWithData = {
				list: data[dkc.list],
				pageNo: data[dkc.pageNo],
				pageSize: data[dkc.pageSize],
				pageTotal: data[dkc.pageTotal],
				// pageCount: type == 'url' ? data[dkc.pageCount] : Math.ceil( data[dkc.pageTotal] / data[dkc.pageSize] )
				pageCount: data[dkc.pageCount] || Math.ceil( data[dkc.pageTotal] / data[dkc.pageSize] )
			};
			return this._dealWithData;
		},
		
		_createByData: function(data){
			if(this.options.process){
				var process = this.options.process;
				data = process.call(this.element[0],data) || data;
			}
			this._createTbody(data.list);
			this._trigger('loadEnd', null, data);
			if(this.options.page){
				var page = $(this.options.page);

				page.page('option',{
					pageNo: data.pageNo,
			    	pageSize: data.pageSize,
			    	pageCount: data.pageCount,
			    	pageTotal: data.pageTotal
				});
				page.page('update');
			}
		},

		_createTbody: function(data){
			var trs = [],
				self = this;
			
			if(this.options.hasCheckbox){
				$.each(data,function(i,n){
					n['checkbox'] = '<input type="checkbox" />';
				});
				if(!this.isLoad && this.options.head[0].name != 'checkbox' && this.options.head[1].name != 'checkbox'){
					this._createTheadPre('checkbox', '<input type="checkbox" />');
				}
			}
			
			if(this.options.hasRowNumbers){
				$.each(data,function(i,n){
					n['number'] = i + 1;
				});
				if(!this.isLoad && this.options.head[0].name != 'number'){
					this._createTheadPre('number', '&nbsp;');
				}
			}
			
			this.isLoad = true;

			if(data && data.length){
				this._setCache(data);
				$.each(data,function(i,n){
					trs[i] = self._createRow(n);
				});
			}else{
				trs[0] = this._createSingleTr('你要的啥都没有~');
			}
			
			var tbody = this.element.find('tbody');
			if(!tbody.length){
				tbody = $('<tbody>').appendTo(this.element);
			}
			tbody.html(trs.join('')).effect('highlight',1000);
		},

		_createSingleTr: function(msg){
			return '<tr class="tb-tips"><td colspan="'+ this.options.head.length +'">'+ msg +'</td></tr>';
		},
		
		_createTheadPre: function(name,html){
			this.element.find('thead').find('tr').find('th:first').before('<th width="30">'+ html +'</th>');
			
			this.options.head.unshift({name: name, text: html, width: 30});
		},
		
		_createRow: function(data){
			var	html = '<tr>';
			$.each(this.options.head,function(i,n){
				if(n.show !== false){
					var text = n.tmpl ? Handlebars.compile(n.tmpl)(data) : data[n.name];
					html += '<td' + (n.align ? ' style="text-align:' + n.align + ';"' : '') + '>'+  text +'</td>';
				}
			});
			return html + '</tr>';
		},
		
		_setCache: function(data){
			this._cache = data;
		},
		
		_getCache: function(idx){
			if(!this._cache) return null;
			return idx !== undefined ? this._cache[idx] : this._cache;
		},
		
		_removeCache: function(idx){
			this._cache.splice(idx,1);
		},
		
		_mouseenter: function(e){
			$(e.currentTarget).addClass('hover');
		},
		
		_mouseleave: function(e){
			$(e.currentTarget).removeClass('hover');
		},
		
		_click: function(e){
			var t = $(e.currentTarget),
				idx = t.index(),
				bool;
			if(this._trigger('click',e,this._getCache(idx)) === false) return;
			
			t.toggleClass('select');

			bool = t.is('.select');
			
			if(this.options.hasCheckbox) {
				t.find(':checkbox').attr('checked',bool);
			}
			if(this.options.singleSelect && !this.options.hasCheckbox){
				t.siblings('.select').removeClass('select').find(':checkbox').attr('checked',false);;
			}
			var callback = bool ? 'selected' : 'unselected';
			
			this._trigger(callback,e,this._getCache(idx));
		},
		
		_dblclick: function(e){
			e.stopPropagation();
			var idx = $(e.currentTarget).index();
			
			this._trigger('dblclick',e,this._getCache(idx));
		},
		
		_selectAll: function(e){
			var bool = e.currentTarget.checked,
				trs = this.element.find('tbody tr');
			trs.toggleClass('select',bool).find(':checkbox').attr('checked',bool);
			var callback = '',
				cache = [];
			if(bool){
				callback = 'allSelected';
				cache = this._getCache();
			}else{
				callback = 'allUnSelected';
			}
			this._trigger(callback,e,cache);
		},
		
		_getParamsKey: function(){
			return this.option('url') ? 'params' : 'data';
		},
		
		_pageJump: function(ev,o){
			var key = this._getParamsKey();
			$.extend(this.options[key],o);
			this._getData();
		},
		/**
		 * 获取选中行的数据
		 * @method getChecked
		 * @return {Array}
		 * @example
		 * $(selector).table('getChecked');
		 */
		getChecked: function(){
			var chks = [];
			var self = this;
			this.element.find('tr.select').each(function(i,n){
				var idx = $(this).index();
				chks[i] = self._getCache(idx);
			});
			return chks;
		},
		/**
		 * 重新加载表格，可设置重置的参数，参数类型参考配置项params
		 * @method reload
		 * @param {Object} newParams {}
		 * @param {Boolean} isClearOldParams Boolean
		 * @example
		 * $(selector).table('reload',newParams,isClearOldParams);
		 */
		reload: function(newParams,isClearOldParams){
			var key = this._getParamsKey();
			if(isClearOldParams){
				this.options[key] = {};
			}
			$.extend(this.options[key],newParams);
			this._getData();
		},
		/**
		 * 获取配置项的参数
		 * @method getParams
		 * @return {Object}
		 * @example
		 * $(selector).table('getParams');
		 * 
		 * 不建议使用，建议使用通用的获取配置项方法：
		 * $(selector).table('option','params');
		 */
		getParams: function() {
			return this.options.params;
		},
		/**
		 * 重置表格，使用最初配置的项重新加载表格
		 * @method reset
		 * @example
		 * $(selector).table('reset');
		 */
		reset: function(){
			this.element.html('');
			this.isLoad = false;
			this._createThead();
			this._getData();
		},
		
		_sort: function(e){
			e.preventDefault();
			var t = $(e.currentTarget),
				order = '',
				options = this.options,
				name = t.attr('name'),
				oi = '',
				sortParams = {};
			

			//DESC降序
			//ASC升序
			if(t.is('.desc')){			
				t.removeClass('desc').addClass('asc');
				order = 'ASC';
				oi = '↑'
			}else{
				t.removeClass('asc').addClass('desc');
				order = 'DESC';
				oi = '↓'
			}

			t.data('order',order);
			
			t.find('.oi').text(oi);
			t.parent().siblings().find('.oi').text('');

			sortParams = {
				sortBy: name,
				order: order,
				pageNo: 1
			}

			if(options.url){
				var ui = {
					current: sortParams,
					old: this._getCellSort()
				};

				if(!this._trigger('sortStart',e, ui)){
					return;
				}

				$.extend(options.params, sortParams);

				this._getData();
			}
			this._trigger('sortEnd',e,sortParams);
		},

		_getCellSort: function(){
			var sort = [],
				cells = this.element.find('thead').find('.sort');
			cells.each(function(i,n){
				var target = $(this),
					order = target.data('order')
				if(order){
					sort.push({
						sortBy: target.attr('name'),
						order: order
					});
				}
			});

			return sort;
		},

		_dragGuid: function(e){
			var target = $(e.currentTarget),
				left = target.offset().left,
				width = target.outerWidth(),
				mouseLeft = e.clientX,
				scrollLeft = $(window).scrollLeft(),
				jj =  left + width - mouseLeft - scrollLeft;

			if(jj < 10 && jj >= 0){
				target.addClass('e-resize');
			}else{
				target.removeClass('e-resize');
			}
		},

		_drag: function(e){
			var target = $(e.currentTarget),
				table = this.element,
				height = table.height(),
				scrollLeft = $(window).scrollLeft(),
				proxyDiv = $('<div>').addClass('drag-proxy')
					.css({
						left: e.clientX + scrollLeft,
						top: target.offset().top
					})
					.height(height)
					.appendTo('body');

			var isStart = false;

			proxyDiv
				.draggable({
					axis: 'x',
					delay: 50,
					opacity: .5,
					start: function(){
						isStart = true;
					},
					stop: function(event,ui){
						var width = target.width() + ui.position.left - ui.originalPosition.left;
						if(width < 30) width = 30;
						target.width(width);
						$(this).remove();
					}
				}).trigger(e)

				.on('mouseup',function(e){
					if(!isStart){
						$(this).remove();
					}
				});
		},

		_setThead: function(e){
			e.preventDefault();
			var html = '',
				head = this.options.head,
				setBox = null,//$('#theadSetBox'),
				target = $(e.target),
				targetOffset = target.offset(),
				left = targetOffset.left - 200,
				top = targetOffset.top + 16;

			setBox = $('<ul>').attr('id','theadSetBox').appendTo('body');

			setBox.on('click',':checkbox',$.proxy(this,'_theadSetBoxClick'));
			
			$.each(head,function(i,n){
				var isChecked = n.show !== false ? 'checked' : '';
				//过滤掉行号、checkbox
				if(n.name === 'number' || n.name === 'checkbox'){
					return;
				}
				html += '<li><label><input type="checkbox" '+ isChecked +' name="'+ n.name +'" /> '+ n.text +'</label></li>'
			});

			setBox
			.html(html)
			.position({
				my: 'right top',
				at: 'left top',
				of: e.target
			})
			.position({
				my: 'right top',
				at: 'left bottom',
				of: e.target,
				using: function(to){
					var o =  {opacity: 1};
					$.extend(o, to);
					$( this ).stop( true, false ).css('opacity',0).animate( o );
				}
			})

			//排序
			.sortable({
				placeholder: "placeholder",
				stop: $.proxy(this,'_sortHead')
			})
			.disableSelection();

			this.document.bind('click.theadSetBox',$.proxy(this,'_docClick'));
			this._setBox = setBox;
		},

		_docClick: function(e){
			var t = $(e.target);
			if(!t.closest(this._setBox).length && !t.is('.thead-set')) {
				this._hideTheadSetBox(t);
			}
			
		},
		_hideTheadSetBox: function(){
			this._setBox.off('click').remove();
			this.document.unbind('click.theadSetBox');
			this._setBox = null;
		},

		_theadSetBoxClick: function(e){
			var target = $(e.currentTarget),
				name = target.attr('name'),
				checked = target.is(':checked'),
				lastChecked = this._setBox.find('input:checked'),
				checkedLen = lastChecked.length;

			//判断是否是最后一个勾选的
			if(!checked && checkedLen === 1){
				lastChecked.attr('disabled',true);
			}

			if(checked && checkedLen === 2){
				lastChecked.removeAttr('disabled');
			}

			$.each(this.options.head,function(i,n){
				if(n.name === name){
					n.show = checked;
					return false;
				}
			});

			this._headChange();
			
		},
		_setLocalStorage: function(){
			if(localStorage){
				localStorage.setItem(this._getLocalStorageItemId(),JSON.stringify(this.options.head));
			}
		},

		_getLocalStorageItemId: function(){
			var pathname = location.pathname.replace(/\//g,'_'),
				itemId = pathname + '_' + this.element.attr('id');
			return itemId;
		},

		_sortHead: function(event,ui){
			var items = this._setBox.find(':checkbox'),
				oldhead = this.options.head,
				newHead = [];
			items.each(function(i,n){
				var name = $(this).attr('name');

				$.each(oldhead,function(j,m){
					if(m.name === name){
						newHead.push(m);
						return false;
					}
				});
			});
			this.options.head = null;
			this.options.head = newHead;
			this._headChange();
		},

		_headChange: function(){
			this.element.html('');
			this.isLoad = false;
			this._createThead();
			this._createByData(this._dealWithData);

			//set localStorage
			this._setLocalStorage();
		}
	});
})(jQuery);