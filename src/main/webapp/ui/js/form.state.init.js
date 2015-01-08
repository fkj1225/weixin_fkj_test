$(function() {
	
	try{
		//初始化文本框，配置样式text即可
		$('.text').textui();

		//初始化select
		$('.ui-select').combobox();
	}catch(e){};

	//初始化button，配置ui-btn即可，带图标的常用按钮看下面

	//不带图标的button
	$('.ui-btn').button();

	//带图标
	//搜索
	$('.ui-btn-search').button({
		icons: {
			primary: 'ui-icon-search'
		}
	});

	//提交
	$('.ui-btn-submit').button({
		icons: {
			primary: 'ui-icon-check'
		}
	});

	//刷新、重置
	$('.ui-btn-refresh').button({
		icons: {
			primary: 'ui-icon-refresh'
		}
	});

	//保存
	$('.ui-btn-save').button({
		icons: {
			primary: 'ui-icon-disk'
		}
	});

	//编辑
	$('.ui-btn-edit').button({
		icons: {
			primary: 'ui-icon-pencil'
		}
	});

	//新开窗口之类
	$('.ui-btn-newwin').button({
		icons: {
			primary: "ui-icon-newwin"
		}
	});
	//导入
	$('.ui-btn-import').button({
		icons: {
			primary: "ui-icon-arrowthickstop-1-n"
		}
	});
	//导出
	$('.ui-btn-export').button({
		icons: {
			primary: "ui-icon-arrowthickstop-1-s"
		}
	});
	//返回
	$('.ui-btn-back').button({
		icons: {
			primary: "ui-icon-arrowreturnthick-1-w"
		}
	});
	//设置
	$('.ui-btn-site').button({
		icons: {
			primary: "ui-icon-gear"
		}
	});
	//删除
	$('.ui-btn-del').button({
		icons: {
			primary: "ui-icon-trash"
		}
	});
	//关闭
	$('.ui-btn-close').button({
		icons: {
			primary: "ui-icon-closethick"
		}
	});
	//放大
	$('.ui-btn-zoomin').button({
		icons: {
			primary: "ui-icon-zoomin"
		}
	});
	//缩小
	$('.ui-btn-zoomout').button({
		icons: {
			primary: "ui-icon-zoomout"
		}
	});
});