/**
 * h5 上传插件
 * 支持h5的浏览器使用h5上传
 * 不支持h5的浏览器使用uploadify上传
 * @namespace  $.ui
 * @version 1.0
 * @author      derrickliu
 * @class fileupload
 * @extends {$.widget}
 */
(function($){
	$.widget('ui.fileupload',{
		version: '1.0',
		options: {
			/**
			 * 上传地址
			 * @type {String}
			 * @property url
			 * @default ''
			 */
			url: '',
			/**
			 * 上传要带的参数
			 * @type {Object}
			 * @property data
			 * @default null
			 */
			data: null,
			/**
			 * 上传图片是否需要预览
			 * @type {Boolean}
			 * @property preview
			 * @default true
			 */
			preview: true,
			/**
			 * 上传文件的大小限制，有B,KB,MB,GB四种单位，默认为KB
			 * @type {String}
			 * @property size
			 * @default ''
			 */
			size: '',
			/**
			 * 上传按钮的文字
			 * @type {String}
			 * @property text
			 * @default '选择文件'
			 */
			text: '选择文件',
			/**
			 * 基于uploadify上传需要加的配置，具体参考http://www.uploadify.com/documentation/
			 * @type {Object}
			 * @property text
			 * @default '选择文件'
			 * @example
			 * uploadify: {
			 * width: 100,
			 * height: 20,
			 * uploadLimit: 5
			 * }
			 */
			uploadify: null,

			//callbacks
			/**
			 * 上传成功的回调
			 * 返回的json格式：{result: 0, msg: '上传成功', info: { url: '',...}}。
			 * 
			 * @event success
			 * @param {Event} event jQuery event Object
			 * @param {Object} data {}
			 * @example
			 * $(selector).fileupload({ 
			 * 	success: function(event, json){
			 * 		//code
			 * 	} 
			 * });
			 */
			success: null,
			/**
			 * 上传失败的回调
			 * 
			 * @event error
			 * @param {Event} event jQuery event Object
			 * @param {Object} data {}
			 * @example
			 * $(selector).fileupload({ 
			 * 	error: function(event,json){
			 * 		//code
			 * 	} 
			 * });
			 */
			error: null,
			/**
			 * 删除的回调
			 * 
			 * @event remove
			 * @param {Event} event jQuery event Object
			 * @param {String} fileId 
			 * @example
			 * $(selector).fileupload({ 
			 * 	remove: function(event,fileId){
			 * 		//code
			 * 	} 
			 * });
			 */
			remove: null
		},
		_create: function(){
			// 判断是否支持html5
			if(typeof FormData != 'undefined'){
				this.wrap = $('<a>')
					.attr('href','javascript:void(0)')
					.addClass('file-upload-btn')
					.text(this.options.text).button({
						icons: {
							primary: 'ui-icon-folder-collapsed'
						}
					}).insertAfter(this.element);
					
				this.element.appendTo(this.wrap.find('.ui-button-text'));

				this._on({
					change: '_change'
				});
			}else{
				//flash upload
				this._flashUpload();
			}
		},
		_init: function(){

		},
		_change: function(event){
			var target = event.target,
				that = this;
			
			$.each(target.files,function(i,n){
				var fd = new FormData();

				$.each(that.options.data,function(k,m){
					fd.append(k,m);
				});
				
				fd.append('file',n);


				//给file生成一个预览的id
				var fileId = 'file' + $.now();
				

				//根据type类型生成对应的icon，展现进度条
				var nameSplit = n.name.split('.');
					type = nameSplit[nameSplit.length - 1].toLowerCase();

				if(/^image/.test(n.type)){
					type = 'image';
				}

				//生成框架
				that._createUploadFrame(type,fileId);
				//如果是图片,并且配置了可预览,预览图片
				if(type === 'image' && that.options.preview){
					var reader = new FileReader();
					reader.readAsDataURL(n);
					reader.onload = $.proxy(that,'_preview',{fileId: fileId});
				}

				//检测大小
				var size = that.options.size,
					iSize = parseInt(size);
				if(size){
					if(/mb/i.test(size)){
						iSize = iSize * 1024 * 1024;
					}else if(/kb/i.test(size)){
						iSize = iSize * 1024;
					}else if(/gb/i.test(size)){
						iSize = iSize * 1024 * 1024 * 1024;
					}else if(/b/i.test(size)){
						iSize = iSize;
					}else{
						iSize = iSize * 1024;
					}

					if(n.size > iSize){
						that._sizeBig(fileId, size);
						return;
					}
				}

				//上传
				that._upload(fd, fileId, n.name);
			});
		},

		_sizeBig: function(fileId,size){
			var that = this,
				item = $('#' + fileId);
			item.find('.filename').addClass('error').html('超过了限制：' + size);

			setTimeout(function(){
				that._remove(item, fileId);
			},2500);
		},

		_remove: function(item, id){
			this._trigger('remove',null,id);
			item.animate({
				opacity: 0
			},500,function(){
				item.remove();

				$('#' + id + 'input').remove();
			});
		},

		_createUploadFrame: function(type,fileId){
			var that = this,
				imgPreviewBox = $('.img-preview-box'),
				className = '',
				img = null;
			if(!imgPreviewBox.length){
				imgPreviewBox = $('<div>').addClass('img-preview-box');
				this.wrap.after(imgPreviewBox);
			}

			switch(type){
				case 'image': 	className = 'file-upload-type-img'; break;
				case 'csv': 	className = 'file-upload-type-csv'; break;
				case 'doc':   	className = 'file-upload-type-doc'; break;
				case 'zip':   	className = 'file-upload-type-zip'; break;
				case 'xls':   	className = 'file-upload-type-xls'; break;
				default:   		className = 'file-upload-type-default'; break;
			}

			// if(type === 'image' )
			img = this._getPreviewTmpl({id: fileId, className: className});
			imgPreviewBox.append(img);

			var removeBtn = imgPreviewBox.find('.preview-remove');
			removeBtn.on('click',function(){
				var item = $(this).closest('.preview-item'),
					fileId = item.attr('id');
				that._remove(item,fileId);
			})
		},
		_preview: function(data,e){
			var imgBox = $('#' + data.fileId);
			imgBox.find('img').attr('src',e.target.result)
				.end().find('.preview-img')
					.removeClass('file-upload-type')
					.removeClass('file-upload-type-img');

		},

		_getPreviewTmpl: function(o){
			var tmpl = '<div class="preview-item" id="'+ o.id +'">'
						+ '<div class="preview-img file-upload-type '+ o.className +'">'
							+ '<img  />'
						+ '</div>'
						+ '<p class="filename">0%</p>'
						+ '<div class="file-upload-progress"></div>'
						+ '<span class="preview-remove" title="删除"></span>'
					+'</div>';
			return tmpl;
		},

		_upload: function(formData, fileId, fileName){
			// var request = new XMLHttpRequest();

			// request.upload.addEventListener('progress',function(e){
			// 	if (e.lengthComputable) {
		 //          var percentage = Math.round((e.loaded * 100) / e.total);
		 //          console.log(percentage);
		 //        }
				
			// },false);
			// request.onreadystatechange = function() {
			// 	console.log(request.readyState + '-----' + request.status);
               
   //          };
			// request.onload=function(){
			// 	console.log("上传完成！");
			// }
			// 上传进度
			// request.upload.onprogress=function(e){
			// 	// if (e.lengthComputable) {
			// 		var percent = (e.loaded / e.total * 100 | 0)+"%";
			// 		console.log(percent);
			// 	// }
			// }
			// request.open("POST", this.options.url);
			// request.send(formData);
			// 
			var that = this;
			$.ajax({
				url: this.options.url,
				dataType: 'json',
				type: 'post',
				data: formData,
				processData: false,
				contentType: false,
				xhr: function(){
					var xhr = $.ajaxSettings.xhr();
				        xhr.upload.addEventListener('progress', $.proxy(that,'_progress',{fileId: fileId, fileName: fileName}), false);
				    return xhr;
				},
				success: function(json,status){
					that._success(json,fileId);
				},
				error: function(){
					// if(that.options.error){
					// 	that.options.error(json);
					// }
					that._trigger('error',null,json);
				}
			});
		},
		_success: function(json,fileId){
			var input = $('<input type="hidden">').val(json.info.url),
				wrap = this.wrap;

			if(wrap){
				input.attr('id',fileId + 'input');
			}else{
				wrap = $('#' + this.element.attr('id'));
			}
			wrap.after(input);
			this._trigger('success',null,json);
		},
		_progress: function(data,e){
			var id = data.fileId,
				item = $('#' + id),
				p = item.find('.file-upload-progress'),
				fn = item.find('.filename');
			if (e.lengthComputable) {
				if(e.loaded > e.total) return;
				var percent = Math.floor(e.loaded / e.total * 100);
				p.height((100 - percent) + '%');
				fn.text(percent + '%');
				if(percent === 100){
					fn.html('<i class="ui-icon ui-icon-circle-check"></i>' + data.fileName);
				}
			
				this._trigger('progress',null,e);
			}
		},

		__upload: function(){
			var o = $.extend({},this.options,
					{fileElementId: this.element.attr('id'),secureuri:false});
			$.ajaxFileUpload(o);
		},

		_flashUpload: function(){
			var o = this.options,
				that = this,
				u = {
					swf: '../uploadify/uploadify.swf',
					uploader: o.url,
					formData: o.data,
					fileSizeLimit: o.size,
					buttonText: o.text,
					onUploadSuccess: function(event,json){
						that._success($.parseJSON(json));
					},
					onUploadError: o.error
				};
				$.extend(u,o.uploadify)
			this.element.uploadify(u);
		}
	});
})(jQuery);