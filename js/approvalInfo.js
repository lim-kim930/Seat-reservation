let flag = 0;
let ap = JSON.parse(sessionStorage.getItem("approval"));
window.onload = function () {
    if (ap.status === "待审批！！") {
        flag = 0;
    } else if (ap.status === "已同意") {
        flag = 1;
    } else if (ap.status === "已拒绝") {
        flag = 2;
    }
    else if (ap.status === "已过期") {
        flag = 3;
    }
    console.log(ap);
    Gender(ap);
};

function Gender(ap) {
    $("#ap-room").text(ap.room);
    $("#ap-number").text(ap.number);
    $("#ap-start-time").text(ap.startTime);
    $("#ap-date").text(ap.date);
    $("#ap-uname").text("姓名: " + ap.applicant);
    $("#ap-reason").text(ap.reason);
    $("#ap-tel").text("联系电话: " + ap.utel);
    switch (flag) {
        case 0:
            $(".btn").attr("disabled", false);
            break;
        case 1:
            $("#agree-btn").text("已同意该申请");
            break;
        case 2:
            $("#disagree-btn").text("已拒绝该申请");
            break;
        case 3:
            $(".btn").text("该申请已过期");
            break;
    }
}
function agree() {
    $('.weui-mask').show();
    $(".weui-dialog__bd").eq(0).attr('id', 'agreeSub')
    $(".weui-dialog__bd").eq(0).html("确定同意该申请吗?")
    $(".weui-dialog").eq(0).show(300);
};
function disAgree() {
    $('.weui-mask').show();
    $(".weui-dialog__bd").eq(0).attr('id', 'disAgreeSub')
    $(".weui-dialog__bd").eq(0).html("确定拒绝该申请吗?")
    $(".weui-dialog").eq(0).show(300);
};
function submit() {
    $('.weui-mask').hide();
    $(".weui-dialog").eq(0).hide();
    if ($(".weui-dialog__bd").eq(0).attr('id') === 'agreeSub') {
        $.ajax({
            type: "get",
            //新接口测试
            url: "https://seat.api.hduapp.com/room/apply/admin/passapply",
            xhrFields: {
                withCredentials: true,
            },
            data: {
                roomName: ap.room,
                ApplyId: Number(ap.applyId),
            },
            success: function (response) {
                $('.weui-mask').show();
                if (JSON.parse(response).status === 'successfully') {
                    $(".weui-dialog__bd").eq(1).html('<p id = "0"><i class="weui-icon-success weui-icon_msg"></i> 操作成功!</p>');
                    $(".weui-dialog").eq(1).show(300);
                } else if (JSON.parse(response).status === 'some time has already in use,you must refuse') {
                    $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 时间冲突,您必须拒绝该申请</p>');
                    $(".weui-dialog").eq(1).show(300);
                }
                else {
                    $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 发生错误!请重试</p>');
                    $(".weui-dialog").eq(1).show(300);
                }
            },
            error: function () {
                $('.weui-mask').show();
                $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 发生错误，请稍候刷新再试，或联系管理员</p>');
                $(".weui-dialog").eq(1).show(300);
            }
        });
    }
    else if ($(".weui-dialog__bd").eq(0).attr('id') === 'disAgreeSub') {
        $.ajax({
            type: "get",
            //新接口测试
            url: "https://seat.api.hduapp.com/room/apply/admin/refuseapply",
            xhrFields: {
                withCredentials: true,
            },
            data: {
                ApplyId: Number(ap.applyId),
            },
            success: function (response) {
                $('.weui-mask').show();
                console.log(response);
                $(".weui-dialog__bd").eq(1).html('<p id = "0"><i class="weui-icon-success weui-icon_msg"></i> 操作成功!</p>');
                $(".weui-dialog").eq(1).show(300);
            },
            error: function () {
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
            window.location.href = 'managerIndex.html#/myAp';
            break;
        default:
            location.reload();
    }
}