const ap = JSON.parse(sessionStorage.getItem("ap"));//从sessionStorage读出这个预约的信息
$("#cancel").on("click", function () {
    weiAlert(0, null, "确定要取消该预约吗", null);
    $("#submit").attr("href", "javascript:submit('cancel');");
});
$("#sign").on("click", function () {
    weiAlert(0, null, "请确认签到,开始使用座位", null);
    $("#submit").attr("href", "javascript:submit('sign');");
});
$("#quit").on("click", function () {
    weiAlert(0, null, "确定要签退吗", null);
    $("#submit").attr("href", "javascript:submit('quit');");
});
$("#leave").on("click", function () {
    weiAlert(0, null, "确定要设定暂离吗,系统将为你保留半小时的使用权", null);
    $("#submit").attr("href", "javascript:submit('leave');");
});
$("#delLeave").on("click", function () {
    weiAlert(0, null, "请确认取消暂离,继续使用座位", null);
    $("#submit").attr("href", "javascript:submit('delLeave');");
});
$("#delete").on("click", function () {
    if ($("#reason").val().trim().length === 0) {
        weiAlert(1, "warn", "请填写取消原因", "cancel");
        return;
    }
    weiAlert(0, null, "请确认取消暂离,继续使用座位", null);
});
$(function () {
    if (document.title === "座位预约详情") {
        switch (ap.status.signout) {
            case "未到签到时间":
                ap.title = "还未到达可签到时间";
                $(".cancel").show();
                break;
            case "请及时前往签到":
                ap.title = "请按时前往教室签到";
                $(".cancel").show();
                $(".sign").show();
                break;
            case "正在使用中":
                $.ajax({
                    async: false,
                    type: "get",
                    url: "https://seat.api.hduapp.com/seat/tempLeave/add",
                    xhrFields: {
                        withCredentials: true,
                    },
                    // headers: { staffID: 19270808 }, 
                    data: {
                        seatID: ap.seatID
                    },
                    success: (response) => {
                        if (response.data.usedRecord.recordID) {
                            ap.title = "暂时离开中";
                            $(".delLeave").show();
                        }
                    },
                    error: (err) => {
                        if (err.responseJSON.error === 40402) {
                            ap.title = "正在使用中";
                            $(".leave").show();
                            return;
                        }
                        errHandle(1, err, null, "reload")
                    }
                });
                break;
            case "可以进行签退":
                ap.title = "预约即将结束,请记得签退";
                $(".quit").show();
                break;
            case "已签退":
                ap.title = "此次预约已完成";
                break;
            case "未及时到达座位":
                ap.title = "此次预约违约";
                break;
            case "已取消":
                ap.title = ap.stateComment;
                break;
        }
        $("#ap-seat h5").text(ap.seatName);
        $(".ap-date h5").text(ap.startDate.split(" ")[0]);
    }
    else if (document.title === "教室预约详情") {
        switch (ap.status.signin) {
            case "待审批":
                ap.title = "等待管理员审批";
                $(".delete").show();
                $("#reason_label").show();
                break;
            case "通过":
                ap.title = "管理员已通过";
                break;
            case "拒绝":
                $(".ap-refuse").show();
                ap.title = "已被管理员拒绝";
                break;
            case "已取消":
                ap.title = "预约已取消";
        }
        $("#ap-num h5").text(ap.num);
        $("#ap-phone h5").text(ap.phone);
        $("#ap-reason h5").text(ap.reason);
        $("#ap-refuse h5").text(ap.refuse);
    }
    $(".ap-status h4").text("• " + ap.title);
    $("#ap-room h5").text(ap.roomName);
    $("#ap-state h5").text(ap.state);
    $("#ap-start-time h5").text(ap.startDate.split(" ")[1] + ":00");
    $("#ap-end-time h5").text(ap.endDate.split(" ")[1] + ":00");
});
function submit(id) {
    $('.weui-mask').hide();
    $(".weui-dialog").eq(0).hide();
    var type = "put";
    var url = "";
    var text = "";
    var data = "";
    switch (id) {
        case "cancel":
            url = "/seat/apply/cancel";
            text = "预约取消成功!";
            data = JSON.stringify({
                "applyID": ap.applyID
            })
            break;
        case "sign":
            url = "/seat/used/signIn?seatID=" + ap.seatID;
            text = "签到成功!请开始使用您的座位";
            break;
        case "leave":
            url = "/seat/tempLeave/add?seatID=" + ap.seatID;
            text = "暂离设置成功,系统将为你保留半小时的使用权";
            type = "post";
            break;
        case "delLeave":
            url = "/seat/tempLeave/delete?seatID=" + ap.seatID;
            text = "暂离删除成功,请继续使用您的座位";
            type = "delete";
            break;
        case "quit":
            url = "/seat/used/signOut?seatID=" + ap.seatID;
            text = "签退成功!";
            break;
        case "delete":
            url = "/room/apply/delete";
            text = "预约取消成功!";
            type = "delete";
            data = JSON.stringify({
                "applyID": ap.applyID,
                "comment": $("#reason").val()
            })
            break;
    }
    $.ajax({
        type,
        url: "https://seat.api.hduapp.com" + url,
        xhrFields: {
            withCredentials: true,
        },
        data,
        // headers: { staffID: 19270808 },
        contentType: "application/json",
        success: (response) => {
            weiAlert(1, "success", text, "redirect", sessionStorage.getItem('sr_Turned') !== null ? "index.html?turned=true#/myAp" : "index.html#/myAp")
        },
        error: (xhr) => {
            errHandle(1, xhr, null, "reload")
        }
    })
}
