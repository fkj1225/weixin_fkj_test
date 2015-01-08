/**
 * 树插件<br>
 * 1、支持惰性加载<br>
 * 2、可设定默认显示具体节点下的子节点<br>
 * 3、可设置checkbox<br>
 * 4、节点数据可以页面直出，也可以ajax获取，但都必须是json格式
 * @namespace 	$.ui
 * @class tree
 * @extends		$.widget
 * @author      derrickliu
 * @version     1.1
 * @example
 * $(selector).tree({
 * 	hasCheckbox: false,
 * 	url: 'http://xx.xx', //(或者 data: [],如果两个参数都有，url优先)
 * 	idAttribute: 'treeId',
 * 	//点击树节点的回调
 * 	click: function(event,nodeData){}
 * });
 * */
(function($){
	$.widget('ui.tree',{
		version: '1.1',
		defaultElement: '<ul>',
		options: {
			/**
			 * 是否惰性加载，默认为false
			 * 
			 * @property lazyload
			 * @type {Boolean}
			 * @default false
			 * */
			lazyload: false,
			/**
			 * 是否带checkbox，默认为false
			 * 
			 * @property hasCheckbox
			 * @type {Boolean}
			 * @default false
			 * */
			hasCheckbox: false,
			/**
			 * ajax获取数据的地址
			 * 
			 * @property url
			 * @type {String}
			 * */
			url: '',
			/**
			 * @description 不通过ajax获取数据，直接拿页面上的数据
			 * @description 如果配置了url，url优先
			 * 
			 * @property data
			 * @type {Array}
			 * */
			data: [],
			/**
			 * ajax获取数据以及惰性加载时需要用到的参数设置
			 * 
			 * @property params
			 * @type {Object}
			 * @example
			 * params: {treeId: 100}
			 * */
			params: {},
			/**
			 * 节点唯一标识名称，默认为'id'
			 * 
			 * @property idAttribute
			 * @type {String}
			 * @default 'id'
			 * */
			idAttribute: 'id',
			
			//callbacks
			/**
			 * 点击树节点的回调方法，返回两个参数(event,nodeData),分别为事件对象，和节点相关的数据。	
			 * 
			 * @event click
			 * @param {Event} event jQuery event Object
			 * @param {Object} nodeData {}
			 * @example
			 * $(selector).tree({ 
			 * 	click: function(event,nodeData){
			 * 		//code
			 * 	} 
			 * });
			 * */
			click: null,
			/**
			 * 树节点的mouseenter回调方法，返回两个参数(event,targetNode),分别为事件对象，和当前节点的jquery对象。	
			 * 
			 * @event mouseenter
			 * @param {Event} event jQuery event Object
			 * @param {jQuery} target 
			 * @example
			 * $(selector).tree({ 
			 * 	mouseenter: function(event,target){
			 * 		//code
			 * 	} 
			 * });
			 * */
			mouseenter: null,
			/**
			 * 树节点的mouseleave回调方法，返回两个参数(event,targetNode),分别为事件对象，和当前节点的jquery对象。	
			 * 
			 * @event mouseleave
			 * @param {Event} event jQuery event Object
			 * @param {jQuery} target 
			 * @example
			 * $(selector).tree({ 
			 * 	mouseleave: function(event,target){
			 * 		//code
			 * 	} 
			 * });
			 * */
			mouseleave: null								
		},
		
		_create: function(){
			this._getData();
			this.element
			.on('click','.node',$.proxy(this,'_click'))
			.on('click','.chk',$.proxy(this,'_chkClick'))
			.on('mouseenter','.node',$.proxy(this,'_mouseenter'))
			.on('mouseleave','.node',$.proxy(this,'_mouseleave'));
		},
		
		_init: $.noop,
		
		_getData: function(){
			var self = this;
			if(this.options.url){
				$.ajax({
					url: this.options.url,
					type: 'POST',
					data: this.options.params,
					dataType: 'json',
					success: $.proxy(this,'_createByData')
				});
			}else if(this.options.data){
				this._createByData(this.options.data);
			}
		},
		
		_createByData: function(data){
			this.element.html(this._html(data,0));
		},
		
		_html: function(data,deep){
			var html = '',
				self = this,
				deepStep = 12;
			$.each(data,function(i,n){
				var chk = '',
					id = n[self.options.idAttribute],
					hide = 'hide',
					text = n.text,
					cn = 'ui-icon ui-icon-plus';
				if(self.options.hasCheckbox){
					chk = '<input type="checkbox" class="chk" name="'+ id +'" />';
				}

				if(n.url){
					text = '<a href="'+ n.url +'" target="'+ n.target +'">'+ text +'</a>';
				}

				//如果数据节点配置了show: true,这个优先级比全局配置的lazyload要高
				if(n.show){
					if(n.child && n.child.length){
						//带迭代的html，子节点显示
						hide = '';
						cn = 'ui-icon ui-icon-minus';
						html += '<li>'
							+ '<div nodeId="'+ id +'" class="node parent" style="text-indent: '+ (deep * deepStep) +'px"><span class="'+ cn +'"></span>'+ chk + text+'</div>'
							+ '<ul class="'+ hide +'">'
								+ self._html(n.child, deep + 1)
							+ '</ul>'
						+ '</li>';
					}else{
						//没有子节点，或者子节点为空，直接生成叶子节点html
						html += '<li><div nodeId="'+ id +'" class="node child" style="text-indent: '+ ((deep + 1) * deepStep) +'px">'+ chk + text +'</div></li>';
					}
				}else{
					if(n.child && n.child.length) {
						if(self.options.lazyload) {
							//带加载提示的html
							html += '<li>'
								+ '<div nodeId="'+ id +'" class="node parent" style="text-indent: '+ (deep * deepStep) +'px"><span class="'+ cn +'"></span>'+ chk + text +'</div>'
								+ '<ul class="'+ hide +'">'
									+ '<li style="text-indent: '+ ((deep + 1) * deepStep) +'px">正在加载...</li>'
								+ '</ul>'
							+ '</li>';
						}else{
							//带迭代的html，子节点隐藏
							html += '<li>'
								+ '<div nodeId="'+ id +'" class="node parent" style="text-indent: '+ (deep * deepStep) +'px"><span class="'+ cn +'"></span>'+ chk + text +'</div>'
								+ '<ul class="'+ hide +'">'
									+ self._html(n.child, deep + 1)
								+ '</ul>'
							+ '</li>';
						}
					}else{
						//没有子节点，或者子节点为空，直接生成叶子节点html
						html += '<li><div nodeId="'+ id +'" class="node child" style="text-indent: '+ ((deep + 1) * deepStep) +'px">'+ chk + text +'</div></li>';
					}
				}

				n.deep = deep;
				self._setCache(id,n);
			});
			return html;
		},
		
		_click: function(e){
			var t = $(e.currentTarget),
				nodeId = t.attr('nodeId'),
				nodeData = this._getCache(nodeId);
			
			this._setCurrentClass(t);
			
			this._setCurrentTreeNodeId(nodeId);
			
			if(t.is('.parent')){
				var span = t.find('span');
				if(span.is('.ui-icon-minus')){
					span.removeClass('ui-icon-minus').addClass('ui-icon-plus');
					t.next().slideUp(200);
				}else{
					span.removeClass('ui-icon-plus').addClass('ui-icon-minus');
					t.next().slideDown(200);
					
					//如果属于惰性加载，并且是首次加载
					if(this.options.lazyload && !nodeData.show && !t.data('isLoad')){
						this.options.params[this.options.idAttribute] = nodeId;
						this._loadLazy(t,nodeData);
						t.data('isLoad',true);
					}
				}
			}else if(t.is('.child')){
				if(e.target.tagName.toLowerCase() != 'a' && t.find('a').length){
					t.find('a')[0].click();
				}
			}
			
			this._trigger('click', e, nodeData);
		},
		
		_chkClick: function(e){
			var t = $(e.currentTarget),
				p = t.parent(),
				s = p.next(),
				isChk = e.currentTarget.checked;
			if(s && s.length){
				s.find(':checkbox').attr('checked',isChk);
			}
			
			e.stopPropagation();
		},
		
		_cache: {},
		
		_setCache: function(id,nodeData){
			this._cache[id] = nodeData;
		},
		
		_getCache: function(id){
			if(id === undefined){
				return this._cache;
			}else{
				return this._cache[id];
			}
		},
		
		_loadLazy: function(t,data){
			var self = this,
				ul = t.next('ul');
			if(this.options.url){
				$.ajax({
					url: this.options.url,
					type: 'POST',
					data: this.options.params,
					dataType: 'json',
					success: function(childData){
						ul.html(self._html(childData,data.deep + 1));
					}
				});
			}else if(this.options.data){
				ul.html(self._html(data.child,data.deep + 1));
			}
		},
		/**
		 * 重新加载
		 * @method reload
		 * @example
		 * $(selector).tree('reload');
		 */
		reload: function(){
			this._getData();
		},

		_setCurrentClass: function(element){
			this.element.find('.node').removeClass('current');
			element.addClass('current');
		},

		_setCurrentTreeNodeId: function(nodeId){
			this._currentTreeNodeId = nodeId;
		},
		/**
		 * 获取当前选中树节点数据
		 * @method getCurrentTreeNode
		 * @example
		 * $(selector).tree('getCurrentTreeNode');
		 */
		getCurrentTreeNode: function(){
			return this._getCache[this._currentTreeNodeId];
		},
		/**
		 * 根据节点id展开
		 * @method expand
		 * @param {String} nodeId 节点ID
		 * @example
		 * $(selector).tree('expand',nodeId);
		 */
		expand: function(nodeId){
			this._setNodeStatus(nodeId,'visible');
		},
		/**
		 * 根据节点id收缩
		 * @method close
		 * @param {String} nodeId 节点ID
		 * @example
		 * $(selector).tree('close',nodeId);
		 */
		close: function(nodeId){
			this._setNodeStatus(nodeId,'hidden');
		},

		_setNodeStatus: function(nodeId,status){
			var node = this._getNodeElement(nodeId);
			if(node.next('ul').is(':' + status)){
				this._setCurrentClass(node);
				return;
			}
			node.trigger('click');
		},

		_getNodeElement: function(nodeId){
			return this.element.find('.node[nodeid='+ nodeId +']');
		},

		_mouseenter: function(event){
			this._trigger('mouseenter', null, $(event.currentTarget));
		},
		_mouseleave: function(event){
			this._trigger('mouseleave', null, $(event.currentTarget));
		}
	});
})(jQuery);