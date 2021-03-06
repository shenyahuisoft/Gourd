﻿//请求地址(列表)
var RequestListUrl = "/Manager/GetManagerList";
//请求地址(单条记录)
var RequestUrl = "/Manager/GetManager";
//请求地址(删除记录)
var RequestDelUrl = "/Manager/DelManager";
//请求地址(修改)
var RequestEditUrl = "/Manager/EditManager";
//请求控制器(添加)
var RequestAddUrl = "/Manager/AddManager"

$(function () {

    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();

    //2.初始化Button的点击事件
    var oButtonInit = new ButtonInit();
    oButtonInit.Init();

});
var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#tb_departments').bootstrapTable({
            url: RequestListUrl,                 //请求后台的URL（*）
            method: 'post',                      //请求方式（*）
            toolbar: '#toolbar',                //工具按钮用哪个容器
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: false,                     //是否启用排序
            sortOrder: "asc",                   //排序方式

            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）

            pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
            search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            silent: true,  //刷新事件必须设置
            formatLoadingMessage: function () {
                return "<div class='sk-spinner sk-spinner-wave'>" +
                    "<div class='sk-rect1'></div>" +
                    "<div class='sk-rect2'></div>" +
                    "<div class='sk-rect3'></div>" +
                    "<div class='sk-rect4'></div>" +
                    "<div class='sk-rect5'></div>" +
                    "</div>";
            },
            strictSearch: true,
            showColumns: false,                  //是否显示所有的列
            showRefresh: true,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: true,                //是否启用点击选中行
            height: 600,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
            showToggle: false,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                   //是否显示父子表
            columns: [{
                checkbox: true
            }, {
                field: 'user_name',
                title: '用户名'
            }, {
                field: 'org_id',
                title: '公司',
                formatter: orgFormatter
            },{
                field: 'manager_role.role_name',
                title: '角色'
            }, {
                field: 'real_name',
                title: '真实姓名'
            }, {
                field: 'mobile',
                title: '手机号'
            }, {
                field: 'email',
                title: '邮箱'
            }, {
                field: 'salt',
                title: '资源上限'
            }, {
                field: 'is_lock',
                title: '状态'
            }, {
                field: 'add_time',
                title: '创建时间'
            }]

        });
    };
    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit: params.limit,   //页面大小
            offset: params.offset,  //页码
            user_name: $("#user_name").val(),
            mobile: $("#mobile").val(),
            role: $("#role").val(),
            real_name:$("#real_name").val(),
            status:$("#status").val()
        };
        return temp;
    };


    function orgFormatter(value, row, index) {
        var res;
        $.ajax({
            type: "POST",
            async: false,
            url: "/Organization/GetOrganizationName",
            data: { id: row.org_id },
            success: function (msg) {
                res = msg.name;
            }
        });
        return res;
    }

    return oTableInit;
};


var ButtonInit = function () {
    var oInit = new Object();
    var postdata = {};

    oInit.Init = function () {
        $("#btn_add").click(function () {
            $("#myModalLabel").text("新增");
            $("#myModal").find(".form-control").val("");
            $("#form0").attr("action", RequestAddUrl);
            $('#myModal').modal()
        });

        $("#btn_edit").click(function () {
            var arrselections = $("#tb_departments").bootstrapTable('getSelections');
            if (arrselections.length > 1) {
                var d = dialog({
                    fixed: true,
                    content: "只能选择一行进行编辑",
                    padding: 30

                });
                d.show();
                //关闭提示模态框
                setTimeout(function () {
                    d.close().remove();
                }, 2000);
                return;
            }
            if (arrselections.length <= 0) {
                var d = dialog({
                    fixed: true,
                    content: "请选择有效数据",
                    padding: 30

                });
                d.show();
                //关闭提示模态框
                setTimeout(function () {
                    d.close().remove();
                }, 2000);
                return;
            }
            $("#myModalLabel").text("编辑");
            $.post(RequestUrl, { id: arrselections[0].id }, function (data) {

                $("#id").val(data.id);
                $('#txt_role_id').selectpicker('val', data.manager_role.id);
                $('#txt_org_id').selectpicker('val', data.org_id);
                $("#txt_user_name").val(data.user_name);
                $("#txt_mobile").val(data.mobile);
                $("#txt_nick_name").val(data.nick_name);
                $("#txt_real_name").val(data.real_name);
                $("#txt_email").val(data.email);
                $("#txt_salt").val(data.salt);
                $("#txt_password").val(data.password);
                $("#txt_passwords").val(data.password);
                $("#form0").attr("action", RequestEditUrl);

                if (data.is_lock == "√") {
                    $(".rdobox:first").removeClass("unchecked");
                    $(".rdobox:first").addClass("checked");
                    $(".rdobox:first").children(".check-image").css("background", "url(../img/input-checked.png)");


                    $(".rdobox:last").removeClass("checked");
                    $(".rdobox:last").addClass("unchecked");
                    $(".rdobox:last").children(".check-image").css("background", "url(../img/input-unchecked.png)");


                } else {
                    $(".rdobox:last").removeClass("unchecked");
                    $(".rdobox:last").addClass("checked");
                    $(".rdobox:last").children(".check-image").css("background", "url(../img/input-checked.png)");

                    $(".rdobox:first").removeClass("checked");
                    $(".rdobox:first").addClass("unchecked");
                    $(".rdobox:first").children(".check-image").css("background", "url(../img/input-unchecked.png)");
                }
            },"json");
            $('#myModal').modal();
        });

        $("#btn_delete").click(function () {
            var arrselections = $("#tb_departments").bootstrapTable('getSelections');
            if (arrselections.length <= 0) {
                var d = dialog({
                    fixed: true,
                    content: "请选择有效数据",
                    padding: 30

                });
                d.show();
                //关闭提示模态框
                setTimeout(function () {
                    d.close().remove();
                }, 2000);
                return;
            }


            var d = dialog({
                title: '系统提示',
                padding: 30,
                content: '确定要删除这些数据?',
                okValue: '确定',
                ok: function () {
                    this.title('提交中…');
                    var ids = "";
                    $(arrselections).each(function () {
                        ids += this.id + ",";
                    })
                    if (ids.length > 1)//去掉最后一个,
                    {
                        ids = ids.substring(0, ids.length - 1);
                    }

                    $.post(RequestDelUrl, { ids: ids }, function (data) {
                        var e = dialog({
                            padding: 30,
                            content: data.msg
                        });
                        //显示模态框
                        e.show();
                        //先关闭主窗体
                        $('#myModal').modal('hide')
                        //刷新数据
                        $('#tb_departments').bootstrapTable('refresh', { url: RequestListUrl });
                        //关闭提示模态框
                        setTimeout(function () {
                            e.close().remove();
                        }, 2000);
                    });
                },
                cancelValue: '取消',
                cancel: function () { }
            });
            d.show();



        });


        $("#btn_query").click(function () {
            $("#tb_departments").bootstrapTable('refresh');
        });
    };

    return oInit;
};