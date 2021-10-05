const info = JSON.parse(sessionStorage.getItem("qrInfo"))
const status = info.status;
const roomName = info.roomName;
const setName = info.setName;
var dateUsed = info.dateUsed;
$("#room-info-container").html(
    template("room-info-tpl", {
        dateUsed,
        roomName,
    })
);
// 判断status状态



window.onload = function () {
    console.log(sessionStorage.getItem("qrInfo"));
    $("#seat-info-container").html(template("seat-info-tpl", { setName: setName }));
    if (status.length == 0)
        $("#dura").html(" 无");
    else
        $("#dura").html(template("disable-tpl", status));
    $.ajax({
        type: 'get',
        url: 'https://api.limkim.xyz/getSysTime',
        success: function (response) {
            var tOption = [];
            var startTime = "";
            if (dateUsed.split("-")[2] === response.Systime3.Date) {
                if (Number(response.Systime3.time.split(":")[0]) < 7)
                    startTime = 8;
                else
                    startTime = Number(response.Systime3.time.split(":")[0]) + 1;
            }
            else
                startTime = 8;
            for (startTime; startTime <= 20; startTime++)
                if (status.indexOf(String(startTime)) === -1)
                    tOption.push(startTime);
            var data = [];
            for (var i = 0; i < tOption.length; i++)
                data.push({ value: tOption[i], text: tOption[i] + ":00~" + (tOption[i] + 1) + ":00" })
            selectMultip.register();
            //动态渲染
            selectMultip.reload("time-option", data);
            selectMultip.setVal("time-option", "1")
        }
    })
}
$("#time-option").on("change", function () {
    var tOptions = [];
    const tOption = selectMultip.getVal("time-option").split(",");
    for (var i = 0; i < tOption.length; i++) {
        if (i < 5)
            tOptions.push(tOption[i] + ":00")
        else {
            tOptions.push("...");
            break;
        }
    }
    $("#using-time").text(tOptions.toString());
})
function seatStart() {
    if (setName === '' || setName === undefined)
        $('.input-warnning').eq(0).show();
    else if (selectMultip.getVal("time-option") === "" || selectMultip.getVal("time-option") === undefined)
        $("#using-time").text("请选择使用时间")
    else {
        $('.weui-mask').hide();
        $(".weui-dialog").eq(0).hide();
        var temp = dateUsed.split("-");
        if (Number(temp[1]) < 10)
            temp[1] = "0" + temp[1];
        if (Number(temp[2]) < 10)
            temp[2] = "0" + temp[2];
        dateUsed = temp[0] + "-" + temp[1] + "-" + temp[2];
        $.ajax({
            type: "get",
            url: "https://seat.api.hduapp.com/set/act/choosetime",
            xhrFields: {
                withCredentials: true,
            },
            data: {
                roomName,
                dateUsed,
                sLength: selectMultip.getVal("time-option"),
                setName: setName,
                ifConflict: 0
            },
            contentType: "application/x-www-form-urlencoded",
            success: function (response) {
                $('.weui-mask').show();
                $(".weui-dialog__bd").eq(1).html('<p id = "0"><i class="weui-icon-success weui-icon_msg"></i> 预约成功,请按时签到使用</p>');
                $(".weui-dialog").eq(1).show(300);
                // const status = JSON.parse(response).status;
                // $('.weui-mask').show();
                // if (status === 'sign') {
                //     $(".weui-dialog__bd").eq(1).html('<p id = "0"><i class="weui-icon-success weui-icon_msg"></i> 预约成功,请按时签到使用</p>');
                //     $(".weui-dialog").eq(1).show(300);
                // }
            },
            error: function (err) {
                const status = JSON.parse(err.responseText).status;
                $('.weui-mask').show();
                if (status === 'someone set here,waiting for 15 min"') {
                    $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 座位处于使用状态,若实际并无人使用,请等待15分钟</p>');
                    $(".weui-dialog").eq(1).show(300);
                } else if (status === 'bad time for changeSet') {
                    $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 座位正在被使用,暂无法预约</p>');
                    $(".weui-dialog").eq(1).show(300);
                } else if (status === 'bad time') {
                    $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 时间信息出错,请检查后重试</p>');
                    $(".weui-dialog").eq(1).show(300);
                } else if (status === 'parameter are null') {
                    $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 参数缺少,请检查后重试</p>');
                    $(".weui-dialog").eq(1).show(300);
                } else if (status === 'request is null') {
                    $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 请求发生错误，请稍候刷新再试</p>');
                    $(".weui-dialog").eq(1).show(300);
                } else {
                    $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 发生错误，请稍候刷新再试，或联系管理员</p>');
                    $(".weui-dialog").eq(1).show(300);
                }
            }
        });
    }
};
function redirect() {
    switch ($(".weui-dialog__bd").eq(1).children("p").eq(0).attr('id')) {
        case '0':
            window.location.href = 'index.html#/myAp';
            break;
        default:
            location.reload();
    }
}