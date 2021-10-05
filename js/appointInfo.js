let flag = 0;
window.onload = function () {
    const ap = JSON.parse(sessionStorage.getItem("ap"));
    if (ap.status.signout === "正在使用中") {//签退,暂离
        ap.status = "正在使用中";
        flag = 0;
    } else if (ap.status.signout === "已签退") {//
        ap.status = "此次预约已完成";
        flag = 2;
    }
    else if (ap.status.signin === "未到达") {//签退
        ap.status = "请按时前往教室签到";
        flag = 3;
    }
    else if (ap.status.signin === "未及时到达座位") {//
        ap.status = "此次预约违约";
        flag = 2;
    }
    else if (ap.status.signin === "占座失败") {//
        ap.status = "占座失败";
        flag = 2;
    }
    else if (ap.status.signout === "暂时离开中") {//签退
        ap.status = "暂时离开中";
        flag = 1;
    }
    else if (ap.status.signin === "待审批") {
        ap.status = "待审批";
        flag = 2;
    }
    else if (ap.status.signin === "通过") {
        ap.status = "已通过";
        flag = 2;
    }
    else if (ap.status.signin === "拒绝") {
        ap.status = "已拒绝";
        flag = 2;
    }
    else if (ap.status.signin === "已取消") {
        ap.status = "预约已取消";
        flag = 3;
    }
    ap.seat = ap.set;
    Gender(ap);
};

function Gender(ap) {
    $(".content").html(template("apInfo-tpl", ap));
    if (flag === 1) {
        $(".leave").hide();
        $("#quit").on("click", function () {
            $('.weui-mask').show();
            $(".weui-dialog__bd").eq(0).attr('id', 'quitSub')
            $(".weui-dialog__bd").eq(0).html("确定要签退吗")
            $(".weui-dialog").eq(0).show(300);
        });
    }
    else if (flag === 2) {
        $(".leave").hide();
        $(".quit").hide();
        $("#cancel").on("click", function () {
            $('.weui-mask').show();
            $(".weui-dialog__bd").eq(0).attr('id', 'cancelRoom')
            $(".weui-dialog__bd").eq(0).html("确定要取消该预约吗")
            $(".weui-dialog").eq(0).show(300);
        });
    }
    else if (flag === 0) {
        $("#leave").html('<img src="images/leave.svg">我要暂离');
        $("#leave").on("click", function () {
            $('.weui-mask').show();
            $(".weui-dialog__bd").eq(0).attr('id', 'leaveSub')
            $(".weui-dialog__bd").eq(0).html("确定要设定暂离吗,系统将为你保留半小时的使用权")
            $(".weui-dialog").eq(0).show(300);
        });
        $("#quit").on("click", function () {
            $('.weui-mask').show();
            $(".weui-dialog__bd").eq(0).attr('id', 'quitSub')
            $(".weui-dialog__bd").eq(0).html("确定要签退吗")
            $(".weui-dialog").eq(0).show(300);
        });
    }
    else if (flag === 3) {
        // $("#quit").html('<img src="images/cancel.svg">取消预约');
        $("#quit").hide();
        $(".cancel").hide();
        $(".leave").hide();
        $(".sign").show();
        $("#sign").on("click", function () {
            $('.weui-mask').show();
            $(".weui-dialog__bd").eq(0).attr('id', 'signSub')
            $(".weui-dialog__bd").eq(0).html("请确认签到,开始使用座位")
            $(".weui-dialog").eq(0).show(300);
        });
        // $("#quit").on("click", function () {
        //     $('.weui-mask').show();
        //     $(".weui-dialog__bd").eq(0).attr('id', 'cancelSeat')
        //     $(".weui-dialog__bd").eq(0).html("确定要取消该预约吗")
        //     $(".weui-dialog").eq(0).show(300);
        // });
    }
}
function submit() {
    $('.weui-mask').hide();
    $(".weui-dialog").eq(0).hide();
    if ($(".weui-dialog__bd").eq(0).attr('id') === 'leaveSub') {
        $.ajax({
            type: "get",
            url: "https://seat.api.hduapp.com/set/act/action",
            data: {
                setId: JSON.parse(sessionStorage.getItem('ap')).setId,
                action: "leaveTransient"
            },
            xhrFields: {
                withCredentials: true,
            },
            contentType: "application/x-www-form-urlencoded",
            success: function (response) {
                $('.weui-mask').show();
                if(response === ""){
                    $(".weui-dialog__bd").eq(1).html('<p id = "0"><i class="weui-icon-success weui-icon_msg"></i> 签到成功</p>');
                    $(".weui-dialog").eq(1).show(300);
                    return
                }
                const res = JSON.parse(response)
                if (res.status === 'leave') {
                    $(".weui-dialog__bd").eq(1).html('<p id = "0"><i class="weui-icon-success weui-icon_msg"></i> 暂离成功!</p>');
                    $(".weui-dialog").eq(1).show(300);
                }
                else if (res.status === 'update leave failed') {
                    $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 暂离失败,请重试</p>');
                    $(".weui-dialog").eq(1).show(300);
                } else {
                    $(".weui-dialog__bd").eq(1).html('<p id = "0"><i class="weui-icon-success weui-icon_msg"></i> 暂离成功!</p>');
                    $(".weui-dialog").eq(1).show(300);
                }
            },
            error: function (xhr) {
                $('.weui-mask').show();
                $(".weui-dialog__bd").html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 发生错误，请稍候刷新再试，或联系管理员</p>');
                $(".weui-dialog").eq(1).show(300);
            }
        });
    }
    else if ($(".weui-dialog__bd").eq(0).attr('id') === 'quitSub') {
        $.ajax({
            type: "get",
            url: "https://seat.api.hduapp.com/set/act/action",
            data: {
                setId: JSON.parse(sessionStorage.getItem('ap')).setId,
                action: "leave"
            },
            xhrFields: {
                withCredentials: true,
            },
            contentType: "application/x-www-form-urlencoded",
            success: function (response) {
                $('.weui-mask').show();
                $(".weui-dialog__bd").eq(1).html('<p id = "0"><i class="weui-icon-success weui-icon_msg"></i> 签退成功</p>');
                $(".weui-dialog").eq(1).show(300);
            },
            error: function (xhr) {
                $('.weui-mask').show();
                $(".weui-dialog__bd").html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 发生错误，请稍候刷新再试，或联系管理员</p>');
                $(".weui-dialog").eq(1).show(300);
            }
        });
    }
    else if ($(".weui-dialog__bd").eq(0).attr('id') === 'signSub') {
        $.ajax({
            type: "get",
            url: "https://seat.api.hduapp.com/set/act/action",
            data: {
                setId: JSON.parse(sessionStorage.getItem('ap')).setId,
                action: "sign"
            },
            xhrFields: {
                withCredentials: true,
            },
            contentType: "application/x-www-form-urlencoded",
            success: function (response) {
                $('.weui-mask').show();
                if(response === ""){
                    $(".weui-dialog__bd").eq(1).html('<p id = "0"><i class="weui-icon-success weui-icon_msg"></i> 签到成功</p>');
                    $(".weui-dialog").eq(1).show(300);
                    return
                }
                const res = JSON.parse(response)
                if (res.status === 'sign has been cancel') {
                    $(".weui-dialog__bd").eq(1).html('<p id = "0"><i class="weui-icon-success weui-icon_msg"></i> 签到成功</p>');
                    $(".weui-dialog").eq(1).show(300);
                }
                else if (res.status === 'sign failed') {
                    $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 签到失败,请重试</p>');
                    $(".weui-dialog").eq(1).show(300);
                }
                else if (res.status === 'not time to sign') {
                    $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 未到签到时间,座位开始使用前5分钟开放签到</p>');
                    $(".weui-dialog").eq(1).show(300);
                } 
            },
            error: function (xhr) {
                $('.weui-mask').show();
                $(".weui-dialog__bd").html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 发生错误，请稍候刷新再试，或联系管理员</p>');
                $(".weui-dialog").eq(1).show(300);
            }
        });
    }
    else if ($(".weui-dialog__bd").eq(0).attr('id') === 'cancelSeat') {
        $.ajax({
            type: "get",
            url: "https://seat.api.hduapp.com/set/act/action",
            data: {
                setId: JSON.parse(sessionStorage.getItem('ap')).setId,
                action: "4"
            },
            xhrFields: {
                withCredentials: true,
            },
            contentType: "application/x-www-form-urlencoded",
            success: function (response) {
                $('.weui-mask').show();
                $(".weui-dialog__bd").eq(1).html('<p id = "0"><i class="weui-icon-success weui-icon_msg"></i> 取消成功</p>');
                $(".weui-dialog").eq(1).show(300);
            },
            error: function (xhr) {
                $('.weui-mask').show();
                $(".weui-dialog__bd").html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 发生错误，请稍候刷新再试，或联系管理员</p>');
                $(".weui-dialog").eq(1).show(300);
            }
        });
    }
    else if ($(".weui-dialog__bd").eq(0).attr('id') === 'cancelRoom') {
        $.ajax({
            type: "get",
            //新接口测试
            url: "https://seat.api.hduapp.com/room/apply/user/cancel",
            data: {
                applyId: JSON.parse(sessionStorage.getItem("ap")).applyId
            },
            xhrFields: {
                withCredentials: true,
            },
            contentType: "application/x-www-form-urlencoded",
            success: function (response) {
                $('.weui-mask').show();
                if(response === ""){
                    $(".weui-dialog__bd").eq(1).html('<p id = "0"><i class="weui-icon-success weui-icon_msg"></i> 取消成功</p>');
                    $(".weui-dialog").eq(1).show(300);
                    return
                }
                const res = JSON.parse(response)
                if (res.status === 'cancel successful') {
                    $(".weui-dialog__bd").eq(1).html('<p id = "0"><i class="weui-icon-success weui-icon_msg"></i> 取消成功!</p>');
                    $(".weui-dialog").eq(1).show(300);
                }
                else if (res.status === 'cancel failed') {
                    $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 取消失败,请重试</p>');
                    $(".weui-dialog").eq(1).show(300);
                }
                else if (res.status === 'parameters are null') {
                    $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 缺少参数,请重试</p>');
                    $(".weui-dialog").eq(1).show(300);
                } else {
                    $(".weui-dialog__bd").eq(1).html('<p id = "0"><i class="weui-icon-success weui-icon_msg"></i> 取消成功!</p>');
                    $(".weui-dialog").eq(1).show(300);
                }
            },
            error: function (xhr) {
                $('.weui-mask').show();
                $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 发生错误，请稍候刷新再试，或联系管理员</p>');
                $(".weui-dialog").eq(1).show(300);
            }
        });
    }
}
function cancel() {
    $('.weui-mask').hide();
    $(".weui-dialog").hide();
}
function redirect() {
    switch ($(".weui-dialog__bd").eq(1).children("p").eq(0).attr('id')) {
        case '0':
            window.location.href = 'index.html#/myAp'
            break;
        default:
            location.reload();
    }
}