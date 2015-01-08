(function($){
	$.extend({
		dialogiframe: function(id,url,options){
			if($('#' + id).length){
				$('#' + id).dialog('open');
				return;
			}
			var div = $('<div>').attr('id',id),
				iframe = $('<iframe>').attr({
					src: url,
					width: '100%',
					height: '100%'
				});
			div.append(iframe).appendTo('body');
			div.dialog(options);
		}
	});
})(jQuery);