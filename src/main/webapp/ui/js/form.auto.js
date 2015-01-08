(function($){
	$.extend({
		autoLayout: function(){
			var fa = $('.form-auto'),
				faWidth = fa.width() + 2,
				lis,
				layer = {},
				arrs = [];
			if(!fa.length){
				return;
			}
			lis = fa.find('.form-li');
	
			lis.each(function(i,n){
				var li = $(this),
					width = li.width(),
					height = li.height(),
					allWidth = width,
					last,
					idx = 0;
				if(arrs.length){
					last = arrs[arrs.length - 1];
					allWidth += last.width;
	
					if(allWidth <= faWidth){
						last.width = allWidth;
						last.target.push(li);
						if(height > last.height){
							last.height = Math.max(height,last.height);
						}
					}else{
						arrs[arrs.length] = {
							target: [li],
							height: height,
							width: width
						}
					}
				}else{
					arrs[0] = {
						target: [li],
						height: height,
						width: width
					}
				}
				
			});
	
			$.each(arrs,function(){
				var height = this.height;
				$.each(this.target,function(){
					this.find('.th,.td').outerHeight(height);
				})
			});
		}
	});
	
	$(function(){$.autoLayout();});
	
})(jQuery);