const info = JSON.parse(sessionStorage.getItem("qrInfo"))
// const status = info.status;
const roomName = info.roomName;
const setName = info.setName;
const seatID = info.seatID;
var dateUsed = info.dateUsed;
$("#room-info-container").html(
    template("room-info-tpl", {
        dateUsed,
        roomName,
    })
);
$("#seat-info-container").html(template("seat-info-tpl", { setName: setName }));
// 判断status状态

window.onload = function () {
    // if (status.length == 0)
    //     $("#dura").html(" 无");
    // else
    //     $("#dura").html(template("disable-tpl", status));
    $.ajax({
        type: 'get',
        url: 'https://api.limkim.xyz/getSysTime',
        success: function (response) {
            var tOption = [];
            var startTime = "";
            if (+dateUsed.split("-")[2] === +response.Systime3.Date) {
                if (Number(response.Systime3.time.split(":")[0]) < 7)
                    startTime = 8;
                else
                    startTime = Number(response.Systime3.time.split(":")[0]) + 1;
            }
            else
                startTime = 8;
            for (startTime; startTime <= 20; startTime++)
                tOption.push(startTime);
            var data = [];
            for (var i = 0; i < tOption.length; i++)
                data.push({ value: tOption[i], text: tOption[i] + ":00" })
            $('#time-option').html(template('time-tpl', { tOption: data }));
            //要是有选项再渲染时长的
            if (data.length !== 0)
                timeOpChange();
        }
    })
}
//开始时间选项更改
$("#time-option").on("change", timeOpChange);
function timeOpChange() {
    //渲染显示
    var tOptions = "";
    const tOption = $("#time-option").find('option:selected').val();
    tOptions = tOption + ":00";
    $("#using-time").text(tOptions);
    //自动渲染一次时长
    duraOpChange();
}
// 使用时长选项改变渲染
function duraOpChange() {
    var dOption = [];
    for (var i = 1; i <= 21 - $('#time-option').find('option:selected').val(); i++)
        dOption.push({ value: i, text: i + "小时" });
    $('#duration-option').html(template('time-tpl', { tOption: dOption }));
    $('#using-duration').text($('#duration-option').find('option:selected').text());
}
function seatStart() {
    if (setName === '' || setName === undefined)
        $('.input-warnning').eq(0).show();
    else if ($("#time-option").find('option:selected').val() === undefined)
        $("#using-time").text("请选择开始时间")
    else if ($("#duration-option").find('option:selected').val() === undefined)
        $("#using-duration").text("请选择使用时长")
    else {
        //弹框二次提示
        const text = '教室: ' + roomName + ' 座位: ' + seatID.split("seat")[1] + '号</p><p style="font-size: 18px;">请仔细核对,并点击确定提交预约'
        weiAlert(0, null, text, null)
    }
};
function submit() {
    $('.weui-mask').hide();
    $(".weui-dialog").eq(0).hide();
    //设置开始与结束时间
    var sTime = +$('#time-option').find('option:selected').val();
    var eTime = sTime + +$("#duration-option").find('option:selected').val();
    //一位的要在前面补0
    sTime = sTime < 10 ? ("0" + sTime) : sTime;
    eTime = eTime < 10 ? ("0" + eTime) : eTime;
    $('.weui-mask').show();
    $(".loadingToast").show();
    $.ajax({
        type: "post",
        url: "https://seat.api.hduapp.com/seat/apply/apply",
        xhrFields: {
            withCredentials: true,
        },
        // headers: { staffID: 19270838 },
        data: JSON.stringify({
            "startAt": dateUsed + "T" + sTime + ":00:00.000+08:00",
            "endAt": dateUsed + "T" + eTime + ":00:00.000+08:00",
            "seatID": seatID
        }),
        contentType: "application/json",
        success: function (response) {
            if (response.msg === 'success')
                weiAlert(1, "success", "预约成功!", "redirect", sessionStorage.getItem('sr_Turned') !== null ? "index.html?turned=true#/myAp" : "index.html#/myAp");
        },
        error: (err) => {
            errHandle(1, err, null, "reload")
        }
    });
}