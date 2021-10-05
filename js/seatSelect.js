const info = location.search.substr(6).split("&");
const roomName = decodeURI(info[0]);
var dateUsed = info[2].split("=")[1];
const capicity = Number(info[1].split("=")[1]);
var target = '';
var setName = '';
const totalSeat = [];
$("#room-info-container").html(
    template("room-info-tpl", {
        dateUsed,
        roomName,
    })
);
for (var i = 1; i <= capicity; i++)
    totalSeat.push(i)
$("#seats").html(template("seat-tpl", { seats: totalSeat }));
$('#seats button').on("click", function (event) {
    $('.input-warnning').hide();
    target = event.target;
    for (var j = 0; j < capicity; j++) {
        $('#seats button')[j].classList.remove("choosen")
    }
    target.classList.add("choosen")
    setName = target.dataset.value;
    $.ajax({
        type: 'get',
        url: 'https://seat.api.hduapp.com/set/choose/lookuproomdetail',
        data: {
            dateUsed,
            roomName,
            setName,
        },
        xhrFields: {
            withCredentials: true,
        },
        contentType: "application/x-www-form-urlencoded",
        success: function (response) {
            const status = JSON.parse(response).status;
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
        },
        error: function (xhr) {
            $(".weui-dialog").hide();
            $('.weui-mask').show();
            $(".weui-dialog__bd").eq(1).html('<p id = "2"><i class="weui-icon-warn weui-icon_msg"></i> 发生错误，请稍候刷新再试，或联系管理员</p>');
            $(".weui-dialog").show(300);
        }
    })
});
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
        $(".weui-dialog__bd").eq(0).html('<p style="font-size: 18px;">教室: ' + roomName + ' 座位: ' + setName + '号</p><p style="font-size: 18px;">请仔细核对,并点击确定提交预约</p>');
        $('.weui-mask').show();
        $(".weui-dialog").eq(0).show(300);
    }
};
function submit() {
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
        url: "https://seat.api.hduapp.com/set/choose/chooseset",
        xhrFields: {
            withCredentials: true,
        },
        data: {
            roomName,
            dateUsed,
            sLength: selectMultip.getVal("time-option"),
            setName: setName,
        },
        contentType: "application/x-www-form-urlencoded",
        success: function (response) {
            const status = JSON.parse(response).status;
            $('.weui-mask').show();
            if (status === 'ok') {
                $(".weui-dialog__bd").eq(1).html('<p id = "0"><i class="weui-icon-success weui-icon_msg"></i> 预约成功,请按时签到使用</p>');
                $(".weui-dialog").eq(1).show(300);
            }
        },
        error: function (XMLHttpRequest, textStatus, err) {
            console.log(XMLHttpRequest.status);
            $('.weui-mask').show();
            if (XMLHttpRequest.status == 0) {
                $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 请求发生错误或者你已经有已提交的预约,请勿重复申请</p>');
                $(".weui-dialog").eq(1).show(300);
                return
            }
            const status = JSON.parse(XMLHttpRequest.responseText).status;
            if (status === 'you have already applied') {
                $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 你已经有已提交的预约,请勿重复申请</p>');
                $(".weui-dialog").eq(1).show(300);
            } else if (status === 'bad sign time' || status === 'bad leave time') {
                $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 你的信誉太低,暂无法预约</p>');
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
function cancel() {
    $('.weui-mask').hide();
    $(".weui-dialog").hide();
}
function redirect() {
    switch ($(".weui-dialog__bd").eq(1).children("p").eq(0).attr('id')) {
        case '0':
            window.location.href = 'index.html#/myAp';
            break;
        default:
            location.reload();
    }
}
