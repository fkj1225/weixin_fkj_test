<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<jsp:include page="/app_include/header.jsp"></jsp:include>
<title>系统管理</title>
</head>
<body>
	<div class="panel panel-default">
		<div class="panel-body">
			<form class="form-inline" role="form" id="qryForm">
				<div class="form-group">
				    <label for="name">系統名称</label>
				    <input type="text" class="form-control" id="name" name="name" placeholder="输入查询系統名称">
				  </div>
				  <div class="form-group">
				    <label for="comment">系统描述</label>
				    <input type="text" class="form-control" id="comment" name="comment" placeholder="输入查询系统描述">
				  </div>
				  <button type="button" id="searchBtn" class="btn btn-primary">查询</button>
			</form>
		</div>
	</div>
	<div class="panel panel-default">
		<div class="panel-body">
			<div class="btn-group">
			  <!--  <a class="btn btn-primary btn-sm" data-toggle="modal"  data-target="#systemInfoModal" data-backdrop="static">新增系统</a>-->
			  <button type="button" id="newBtn" class="btn btn-primary">新增系统</button>
			</div>
			<div class="table-responsive">
				<table class="table table-striped table-condensed table-hover" id="systemList"></table>
			</div>
		</div>
	</div>
	<nav><ul id="paging" class="pager"></ul></nav>
	<!-- Modal -->
	<form role="form" class="form-horizontal" id="systemInfoForm">
		<div class="modal fade" id="systemInfoModal" tabindex="-1" role="dialog" aria-labelledby="systemInfoFormLabel" aria-hidden="true">
			<div class="modal-dialog">
			   <div class="modal-content">
			     <div class="modal-header">
			     	<a class="close" data-dismiss="modal">×</a>
			       <h3 class="modal-title" id="systemInfoFormLabel">系统信息</h3>
			     </div>
			     <input type="hidden" id="id" name="id"/>
			     <div class="modal-body ">
				     <div class="form-horizontal">
						<div class="form-group">
							<label class="col-sm-2 control-label">名称</label>
							<div class="col-sm-10">
								<input class="form-control" id="name" name="name" placeholder="系统名称"/>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-2 control-label">系统描述</label>
							<div class="col-sm-10">
								<input class="form-control" id="comment" name="comment" placeholder="系统描述"/>
							</div>
						</div>
					</div>
				 </div>
			     <div class="modal-footer">
			       <button type="button" class="btn btn-success" id="saveBtn">提交</button>
			       <button type="button" class="btn btn-primary" data-dismiss="modal">取消</button>
			     </div>
			   </div>
			 </div>
		</div>
	</form>
	
	<script src="${ctx}/asset/js/jquery.ly.page.js"></script>
	<script src="${ctx}/ui/js/min/jquery.ui.core.min.js"></script>
	<script src="${ctx}/ui/js/min/jquery.ui.widget.min.js"></script>
	<script src="${ctx}/asset/js/jquery.ly.table.js"></script>
	<script>
	$(function(){
		
		var defaultOption = {
				url : 'page',
				params: (function(){				
					var params = $('#qryForm').serializeObj();
					params['page'] = 0;//当前第几页
					params['size'] = 50;//当前页可显示的列表数
					return params;
				})(),
				head:[{text:'ID',name :'id'},
				      {text:'系统名称',name:'name'},
				      {text:'系统描述',name:'comment'},
				      {text: '编辑',name: 'edit'},
				      {text: '删除',name: 'del',}],
		      	page : $('#paging').page(),
		      	process: function(data){
					   var pageTotal=data.pageTotal;
					   if(pageTotal && pageTotal>0){
						   var list=data.list;
						   for(var i=0;i<list.length;i++){
							   var id=list[i].id;
							   list[i].edit="<a href='#' name=\"edit\">编辑</a>";
							   list[i].del="<a href='#' name=\"del\">删除</a>";
						   }
					   }
					   return data;	
				   }, 
			    click: function(event,data){
						var target = event.originalEvent.target,
							name = target.name;
						if(name === 'edit'){
							event.preventDefault();
							edit(data.id);
						}else if(name === 'del'){
							event.preventDefault();
							del(data.id,data.name);
						}
			       }
			};
		$('#systemList').table2(defaultOption);
		
		//点击 简单搜索 触发
		$('#searchBtn').on('click',function(){
			list();
		});
		
		//点击 新增触发
		$('#newBtn').on('click',function(){
			$("#id").val("");
			$('#systemInfoForm').find("#name").val("");
			$('#systemInfoForm').find("#comment").val("");
			$('#systemInfoModal').modal({
				  keyboard: false,
				  backdrop: 'static'
			});
			$('#systemInfoModal').modal('show');
		});
		
		$('#saveBtn').click(save);
		
		/*$('#systemInfoModal').on('show.bs.modal', function (e) {
			showModal();
       	})*/
		
	});
	
	//reload页面
	function list(){
		$('#systemList').table2("reload",$('#qryForm').serializeObj());
	}
	
	function save(){
		var isNewEntity=true;
		var id=$("#id").val();
		if(parseInt(id)>0){
			isNewEntity=false;
		}
		var ctx = "${ctx}";
		var reqMethod = (isNewEntity)?'POST':'PUT';
		var url = ctx + '/system/'+id;
		//将按钮设置不可用  todo
		$.ajax({
			url : url,
			type : reqMethod,
			dataType : 'json',
			data:$('#systemInfoForm').serializeObj(),
			success : function(data) {
				alert(data.msg);
				if(data.result=='0'){//成功
					$('#systemInfoModal').modal('hide');
					list();
				}
			}
		});
	}
	
	function showModal(){
		var id=$("#id").val();
		alert(id);
		if(parseInt(id)<=0){
			$('#systemInfoForm').find("#name").val("");
			$('#systemInfoForm').find("#comment").val("");
		}
	}
	
	function edit(id){
		var ctx = "${ctx}";
		var url = ctx + '/system/'+id;
		//将按钮设置不可用  todo
		$.ajax({
			url : url,
			type : 'GET',
			dataType : 'json',
			success : function(data) {
				$("#id").val(data.id);
				$('#systemInfoForm').find("#name").val(data.name);
				$('#systemInfoForm').find("#comment").val(data.comment);
				$('#systemInfoModal').modal('show');
			}
		});
	}
	
	function del(id){
		var ctx = "${ctx}";
		var url = ctx + '/system/del/'+id;
		//将按钮设置不可用  todo
		$.ajax({
			url : url,
			type : 'GET',
			dataType : 'json',
			success : function(data) {
				alert(data.msg);
				if(data.result=='0'){//成功
					$('#systemInfoModal').modal('hide');
					list();
				}
			}
		});
	}
	</script>
</body>