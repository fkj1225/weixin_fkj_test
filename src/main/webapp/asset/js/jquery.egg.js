var TipsLayer = function(target){
	this.target = target;
};
jQuery.ajaxSettings.traditional = true;
jQuery.extend(TipsLayer.prototype, {
	$div : null,
	init : function(){
		$div = $(this.target);
	},
	clearText : function(){
		$div.find('ul').empty();
	},
	appendText : function(text){
		$div.find('ul').append('<li>' +text+ '</li>');
	},
	show : function(text, append){
		if(!append){
			this.clearText();
		}
		this.appendText(text);
		$div.css('height', document.body.clientHeight).show();
	},
	hide : function(){
		$div.hide();
	}
});

jQuery.extend({
	
	tipsLayer : function(selector){
		var _tipsLayerInstance = $(selector)._tipsLayer;
		if(!_tipsLayerInstance){
			_tipsLayerInstance = $(selector)._tipsLayer = new TipsLayer(selector);
			_tipsLayerInstance.init();
		}
		return _tipsLayerInstance;
	},
	
	datepair : function(startDateTextBox, endDateTextBox, format){
		 if(format == undefined){
			 format = 'yy-mm-dd';
		 }
	   	 startDateTextBox.datepicker({
	   		 	changeYear: true,
	   			dateFormat:format,
	            onClose: function(dateText, inst) {
	                if (endDateTextBox.val() != '') {
	                    var testStartDate = startDateTextBox.datepicker('getDate');
	                    var testEndDate = endDateTextBox.datepicker('getDate');
	                    if (testStartDate > testEndDate)
	                        endDateTextBox.datepicker('setDate', testStartDate);
	                }
	                else {
	                    endDateTextBox.val(dateText);
	                }
	            },
	            onSelect: function (selectedDateTime){
	                endDateTextBox.datepicker('option', 'minDate', startDateTextBox.datepicker('getDate') );
	            }
	        });
	        endDateTextBox.datepicker({
	        	changeYear: true,
	        	dateFormat:format,
	            onClose: function(dateText, inst) {
	                if (startDateTextBox.val() != '') {
	                    var testStartDate = startDateTextBox.datepicker('getDate');
	                    var testEndDate = endDateTextBox.datepicker('getDate');
	                    if (testStartDate > testEndDate)
	                        startDateTextBox.datepicker('setDate', testEndDate);
	                }
	                else {
	                    startDateTextBox.val(dateText);
	                }
	            },
	            onSelect: function (selectedDateTime){
	                startDateTextBox.datepicker('option', 'maxDate', endDateTextBox.datepicker('getDate') );
	            }
	        });
	     },
	     timepair: function(startTimeTextBox, endTimeTextBox){
	    	 startTimeTextBox.timepicker({
	    		 	changeYear: true,
		   			dateFormat:'hh:mm',
		            onClose: function(dateText, inst) {
		                if (endTimeTextBox.val() != '') {
		                    var testStartDate = startTimeTextBox.datepicker('getDate');
		                    var testEndDate = endTimeTextBox.datepicker('getDate');
		                    if (testStartDate > testEndDate)
		                        endTimeTextBox.timepicker('setDate', testStartDate);
		                }
		                else {
		                    endTimeTextBox.val(dateText);
		                }
		            },
		            onSelect: function (selectedDateTime){
		                endTimeTextBox.timepicker('option', 'hourMin', startTimeTextBox.datepicker('getDate').getHours() );
		                endTimeTextBox.timepicker('option', 'minuteMin', startTimeTextBox.datepicker('getDate').getMinutes() );
		            }
		        });
		        endTimeTextBox.timepicker({
		        	changeYear: true,
		        	dateFormat:'hh:mm',
		            onClose: function(dateText, inst) {
		                if (startTimeTextBox.val() != '') {
		                    var testStartDate = startTimeTextBox.datepicker('getDate');
		                    var testEndDate = endTimeTextBox.datepicker('getDate');
		                    if (testStartDate > testEndDate)
		                        startTimeTextBox.timepicker('setDate', testEndDate);
		                }
		                else {
		                    startTimeTextBox.val(dateText);
		                }
		            },
		            onSelect: function (selectedDateTime){
		            	var startTime = startTimeTextBox.datepicker('getDate');
		            	startTimeTextBox.timepicker('option', 'maxDate', endTimeTextBox.datepicker('getDate') );
		            	if(startTime < endTimeTextBox.datepicker('getDate')){
		            		startTimeTextBox.timepicker('setDate', startTime);
		            	}
		            }
		        });
		     },
		     datetimepair: function(startTimeTextBox, endTimeTextBox){
		    	 startTimeTextBox.datetimepicker({
		    	    	changeYear: true,
			   			dateFormat:'yy-mm-dd hh:mm',
			            onClose: function(dateText, inst) {
			                if (endTimeTextBox.val() != '') {
			                    var testStartDate = startTimeTextBox.datepicker('getDate');
			                    var testEndDate = endTimeTextBox.datepicker('getDate');
			                    if (testStartDate > testEndDate)
			                        endTimeTextBox.datetimepicker('setDate', testStartDate);
			                }
			                else {
			                    endTimeTextBox.val(dateText);
			                }
			            },
			            onSelect: function (selectedDateTime){
			                endTimeTextBox.datetimepicker('option', 'hourMin', startTimeTextBox.datepicker('getDate').getHours() );
			                endTimeTextBox.datetimepicker('option', 'minuteMin', startTimeTextBox.datepicker('getDate').getMinutes() );
			            }
			        });
			        endTimeTextBox.datetimepicker({
			        	changeYear: true,
			        	dateFormat:'yy-mm-dd hh:mm',
			            onClose: function(dateText, inst) {
			                if (startTimeTextBox.val() != '') {
			                    var testStartDate = startTimeTextBox.datepicker('getDate');
			                    var testEndDate = endTimeTextBox.datepicker('getDate');
			                    if (testStartDate > testEndDate)
			                        startTimeTextBox.datetimepicker('setDate', testEndDate);
			                }
			                else {
			                    startTimeTextBox.val(dateText);
			                }
			            },
			            onSelect: function (selectedDateTime){
			                startTimeTextBox.datetimepicker('option', 'maxDate', endTimeTextBox.datepicker('getDate') );
			            }
			        });
			     }
	
});

jQuery.fn.extend({
	serializeObj: function(options){
		var arrs = this.serializeArray(),
			i = 0,
			j = arrs.length,
			obj = {};
		for (; i < j; i++) {
			if(obj[arrs[i].name]){
				if(!(obj[arrs[i].name] instanceof Array)){
					var tmp = obj[arrs[i].name];
					obj[arrs[i].name] = [];
					obj[arrs[i].name].push(tmp);
				}
				obj[arrs[i].name].push(arrs[i].value);
			}else{
				obj[arrs[i].name] = arrs[i].value;
			}
		}
		return $.extend(options,obj);
	},
	
	serializeForm: function(options){
		
		var arrs = this.serializeArray(),
			i = 0,
			j = arrs.length,
			obj = {};
		for (; i < j; i++) {
			if(obj[arrs[i].name]){
				if(!(obj[arrs[i].name] instanceof Array)){
					var tmp = obj[arrs[i].name];
					obj[arrs[i].name] = [];
					obj[arrs[i].name].push(tmp);
				}
				obj[arrs[i].name].push(arrs[i].value);
			}else{
				obj[arrs[i].name] = arrs[i].value;
			}
		}
		for(var idx in obj){
			var e = obj[idx];
			if(e instanceof Array){
				obj[idx] = e.join(',');
			}
		}
		return $.extend(options,obj);
	},
	
	optTmp : function(iterable, kv, defaultValue, append){
		var currentValue = this.value;
		//0 or undefined
		if(currentValue){
			if(!!defaultValue){
				defaultValue = currentValue;
			}
		}
		
		if(!append){
			this.empty();
		}
		
		for(var i in iterable){
			var e = iterable[i];
			var isSelected = (!!defaultValue) ? ((defaultValue ==  e[kv[0]]) ? ' selected="selected"': '') : '';
			this.append('<option value="'+e[kv[0]]+'"'+isSelected+'>' +e[kv[1]]+ '</option>');
		}
		
		return this;
	},
	
	radioSet : function(defaultValue, preventClick){
		var radios = this;
		for(var i = 0;i<radios.length;i++){
			(function(r){
				$(r).click(function(){
					$(radios).parent().removeClass('radiochecked');
					$(r).parent().addClass('radiochecked');
				});
			})(radios[i]);
		}
		var checked = $(this).filter(':checked').val();
		if(preventClick == undefined || !preventClick){
			if(!!defaultValue){
				checked = defaultValue;
				$(this).filter('[value=' + checked+']').click();
			}else if(!!checked){
				$(this).filter('[value=' + checked+']').click();
			}else{
				$(this).eq(0).click();
			}
		}
	},
	
	switcher : function(checked){
		
		var checkboxes = this;
		
		var switcherText = $(checkboxes).data('switcher-text');
		var switchers = ['是','否'];
		if(switcherText){
			switchers = switcherText.split(',');
		}
		
		for(var i = 0;i<checkboxes.length;i++){
			(function(r){
				$(r).click(function(){
					if(checked || $(r).attr('checked')){
						console.log('checked');
						$(r).parent().addClass('ui-switcher-on').removeClass('ui-switcher-off');
					}else{
						console.log('unchecked');
						$(r).parent().addClass('ui-switcher-off').removeClass('ui-switcher-on');
					}
					$(r).parent().find('i.slider').text($(r).attr('checked')?switchers[0]:switchers[1]);
				});
				
			})(checkboxes[i]);
		}
	}
});

jQuery.each( [ "put", "delete", "option" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});
/*
Handlebars.registerHelper('dict', function(kv, id) {
	
	return new Handlebars.SafeString(kv[id]);
});
*/
Handlebars.registerHelper('moment', function(datetime) {
	return moment(datetime).fromNow();
});

Handlebars.registerHelper('isSame', function(a, b, options) {
	if(a === b) {
		return options.fn(this);
	}
	return options.inverse(this);
});