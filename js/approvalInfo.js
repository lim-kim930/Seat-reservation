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
    Gender(ap);
};
function Gender(ap) {
    $("#ap-room").text(ap.room);
    $("#ap-number").text(ap.number);
    $("#ap-com").text(ap.ifCommunity);
    $("#ap-start-time").text("开始时间: " + ap.startDate + ":00");
    $("#ap-end-time").text("结束时间: " + ap.endDate + ":00");
    $("#ap-uname").text("姓名: " + ap.staffName + " 学号: " + ap.staffID);
    $("#ap-reason").text(ap.reason);
    $("#ap-refuse").text(ap.refuse);
    $("#ap-tel").text("联系电话: " + ap.utel);
    switch (flag) {
        case 0:
            $(".btn").attr("disabled", false);
            $("#reason_label").show();
            break;
        case 1:
            $("#agree-btn").text("已同意该申请");
            break;
        case 2:
            $("#disagree-btn").text("已拒绝该申请");
            $(".ap-refuse").show();
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
    $(".weui-dialog").eq(0).show(200);
};
function disAgree() {
    if ($("#reason").val().trim().length === 0) {
        alert("请填写原因")
        return
    }
    $('.weui-mask').show();
    $(".weui-dialog__bd").eq(0).attr('id', 'disAgreeSub')
    $(".weui-dialog__bd").eq(0).html("确定拒绝该申请吗?")
    $(".weui-dialog").eq(0).show(200);
};

function handleAgree() {
    $.ajax({
        type: "put",
        url: "https://seat.api.hduapp.com/room/apply/accept",
        xhrFields: {
            withCredentials: true,
        },
        data: JSON.stringify({
            "comment": "同意",
            "applyID": ap.applyID
        }),
        // headers: { staffID: 19270808 },
        contentType: "application/json",
        success: (response) => {
            if (response.status !== 200) {
                weiAlert(1, "success", "申请已同意", "redirect", "managerIndex.html#/myAp");
            }
        },
        error: (xhr) => {
            errHandle(1, xhr, null, "reload")
        }
    })
}

function handleDisagree() {
    $.ajax({
        type: "put",
        url: "https://seat.api.hduapp.com/room/apply/refuse",
        xhrFields: {
            withCredentials: true,
        },
        data: JSON.stringify({
            "comment": $("#reason").val(),
            "applyID": ap.applyID
        }),
        // headers: { staffID: 19270808 },
        contentType: "application/json",
        success: (response) => {
            if (response.status !== 200) {
                weiAlert(1, "success", "申请已拒绝", "redirect", "managerIndex.html#/myAp");
            }
        },
        error: (xhr) => {
            errHandle(1, xhr, null, "reload")
        }
    })
}
function submit() {
    $('.weui-mask').hide();
    $(".weui-dialog").eq(0).hide();
    if ($(".weui-dialog__bd").eq(0).attr('id') === 'agreeSub') {
        handleAgree()
    }
    else if ($(".weui-dialog__bd").eq(0).attr('id') === 'disAgreeSub') {
        handleDisagree()
    }
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