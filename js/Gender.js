var bjDate = {};//存储时间
var tOption = [];//开始时间
var rOption;
var startTime;
var roomName = "";
$('select').on('change', function () {//选项更改,同步展示
    $(this).prev().children().text($(this).find('option:selected').text());
});
$('#date-option').on('change', function () {
    timeOpChange();
});
$('#time-option').on('change', function () {
    duraOpChange();
});
$(function () {
    //获取时间,并存到bjDate
    const sysTime = getSysTime();
    const sysTime3 = sysTime.Systime3
    bjDate.Date = sysTime3.Date;
    bjDate.Hour = Number(sysTime3.time.split(":")[0]);
    if (document.title === '座位预约' || document.title === '扫码预约')
        //这两个都只要用到日期选择渲染
        dateOpChange(sysTime);
    else if (document.title === '教室主页') {
        //教室主页还需要渲染一些其他的内容
        dateOpChange(sysTime);
        $("#using-type").text($('#type-option').find('option:selected').text());
        const room = location.search.substr(6).split('&')
        roomName = room[0];
        $("#roomName").text(roomName.split("-")[0] + "教" + roomName.split("-")[1]);
        $("#capacity").text("可容纳" + decodeURI(room[1].split("=")[1]));
        // roomDateOpChange();
        timeOpChange();

        // $('#date-option').on('change', roomDateOpChange);
    }
    if (document.title === '座位预约') {
        //获取可选择教室
        $.ajax({
            type: 'get',
            //新接口测试
            url: 'https://seat.api.hduapp.com/room/list',
            xhrFields: {
                withCredentials: true,
            },
            // headers: { staffID: 19270808 },
            success: (response) => {
                //循环教室列表,如果是开着的,就添加到选项里
                var rooms = [];
                for (var i = 0; i < response.length; i++)
                    if (response[i].state === "OPEN")
                        rooms.push({ name: response[i].belongToBuilding + "教" + response[i].roomName, capacity: response[i].capacity });
                $('#room-option').html(template('room-tpl', { rOption: rooms }));
                $('#using-room').text($('#room-option').find('option:selected').text());
            },
            error: (err) => {
                errHandle(0, err, "教室")
            }
        })
    }
})
//日期选择器改变,渲染选项
function dateOpChange(response) {
    //判断是否过了20:00,今日不可预约
    if (bjDate.Hour >= 20)
        var timeStamp = Number(response.Systime2) + 86400000;
    else
        var timeStamp = Number(response.Systime2);
    var date = [];
    //增加未来七天选择
    for (var i = 0; i < 7; i++) {
        var nextDate = new Date(timeStamp + i * 86400000)
        const data = nextDate.getDate()<10?("0"+nextDate.getDate()):nextDate.getDate()
        date.push(nextDate.getFullYear() + "-" + (nextDate.getMonth() + 1) + "-" + data)
    }
    //渲染
    $('#date-option').html(template('date-tpl', { rOption: date }));
    $("#using-date").text($('#date-option').find('option:selected').text());
}
function timeOpChange() {
    tOption = [];
    if (+$('#using-date').text().split("-")[2] === +bjDate.Date) {
        if (bjDate.Hour < 7)
            startTime = 8;
        else
            startTime = bjDate.Hour + 1;
        for (startTime; startTime <= 20; startTime++) {
            tOption.push(startTime);
        }
    }
    else {
        startTime = 8;
        for (startTime; startTime <= 20; startTime++) {
            tOption.push(startTime);
        }
    }
    $('#time-option').html(template('time-tpl', { tOption: tOption }));
    $('#using-time').text($('#time-option').find('option:selected').text());
    duraOpChange();
}

function duraOpChange() {
    dOption = [];
    for (var i = 1; i <= 21 - $('#time-option').find('option:selected').val(); i++) {
        dOption.push(i);
    }
    $('#duration-option').html(template('duration-tpl', { dOption: dOption }));
    $('#using-duration').text($('#duration-option').find('option:selected').text());
}
function roomDateOpChange() {
    $.ajax({
        type: 'get',
        url: 'https://seat.api.hduapp.com/room/apply/user/lookuproomusedtime',
        xhrFields: {
            withCredentials: true,
        },
        data: {
            roomName,
            dateUsed: $("#using-date").text()
        },
        contentType: "application/x-www-form-urlencoded",
        success: function (response) {
            $('#usable').text("该日不可预约时间段：" + response);
        },
        error: function (xhr) {
            $('.weui-mask').show();
            $(".weui-dialog__bd").eq(1).html('<p id = "2"><i class="weui-icon-warn weui-icon_msg"></i> 发生错误，请稍候刷新再试，或联系管理员</p>');
            $(".weui-dialog").eq(1).show(200);
        }
    })
}
//检查提交时间和页面加载时间是否跨一个小时,避免出错
function dbCheck(id) {
    const nowSysTime = getSysTime().Systime3;
    var Hour = Number(nowSysTime.time.split(":")[0]);
    const Date = $('#using-date').text().split("-")[2];
    //时间一致或者预约未来7天的则通过检查
    if ((Date === nowSysTime.Date && bjDate.Hour === Hour) || +Date <= +nowSysTime.Date + 6)
        apSubmit(id);
    //不通过则提示
    else
        weiAlert(0, "warn", "当前页面停留超时,请重新选择", "reload");
}
function apSubmit(id) {
    if (id === 1) {
        //座位预约开始选座,使用url传递时间和教室参数
        const info = $('#room-option').find('option:selected').text().split("-");
        window.location.href = "seatSelect.html?room=" + info[0] + "&cap=" + info[1].split("人")[0] + "&date=" + $('#date-option').find('option:selected').text();
        return;
    }
    else if (id === 3) {
        window.location.href = "scanQR.html?date=" + $('#date-option').find('option:selected').text();
        return;
    }
    else if (id === 2) {
        var date = $('#date-option').find('option:selected').text() + "T";
        let datePart=date.split('-')
        if(datePart[1].length===1){
            datePart[1]='0'+datePart[1]
        }
        date=datePart.join('-')
        var sTime = +$('#time-option').find('option:selected').val();
        var eTime = sTime + +$("#duration-option").find('option:selected').val();
        //一位的要在前面补0
        sTime = sTime < 10 ? ("0" + sTime) : sTime;
        eTime = eTime < 10 ? ("0" + eTime) : eTime;
        $.ajax({
            type: 'post',
            // 新接口测试
            url: 'https://seat.api.hduapp.com/room/apply/apply',
            data: JSON.stringify({
                "applierPhone": $('#using-tel').val(),
                "endAt": date + eTime + ":00:00.000+08:00",
                "fromCommunity": $('#type-option').find('option:selected').val() === "1" ? true : false,
                "reason": $('#using-reason').val(),
                "roomID": roomName,
                "startAt": date + sTime + ":00:00.000+08:00",
                "useManCount": +$('#using-pn').val(),
            }),
            xhrFields: {
                withCredentials: true,
            },
            // headers: { staffID: 19270808 },
            contentType: "application/json",
            success: (response) => {
                if (response.msg === 'success')
                    weiAlert(1, "success", "提交成功!请注意审批结果通知", "redirect", sessionStorage.getItem('sr_Turned') !== null ? "index.html?turned=true#/myAp" : "index.html#/myAp")
            },
            error: (xhr) => {
                errHandle(1, xhr, null, "reload")
            }
        })
    }

}
function redirect() {
    if ($(".weui-dialog__bd").eq(1).length === 0)
        var target = $(".weui-dialog__bd").eq(0);
    else
        var target = $(".weui-dialog__bd").eq(1);
    switch (target.children("p").eq(0).attr('id')) {
        case '0':
            if (sessionStorage.getItem('sr_Turned') !== null)
                window.location.href = 'index.html?turned=true#/myAp'
            else
                window.location.href = 'index.html#/myAp'
            break;
        case '2':
            window.location.href = "index.html"
            break
        default:
            location.reload();
    }
}
