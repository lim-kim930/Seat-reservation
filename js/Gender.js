var bjDate = {};
var tOption = [];
var rOption;
var startTime;
var roomName = "";
$('select').on('change', function () {
    $(this).prev().children().html($(this).find('option:selected').text());
});
$('#time-option').on('change', function () {
    duraOpChange();
});
$('.seat-start').on('click', function () {
    dbCheck(1);
});
window.onload = function () {
    $.ajax({
        type: 'get',
        url: 'https://api.limkim.xyz/getSysTime',
        success: function (response) {
            bjDate.Year = response.Systime3.Year;
            bjDate.Month = response.Systime3.Month;
            bjDate.Day = response.Systime3.Date;
            bjDate.Hour = Number(response.Systime3.time.split(":")[0]);
            bjDate.Min = Number(response.Systime3.time.split(":")[1]);
            if ($('#idConfig').text() === '座位预约' || $('#idConfig').text() === '扫码预约') {
                dateOpChange(response);
            }
            else if ($('#idConfig').text() === '教室主页') {
                dateOpChange(response);
                $("#using-type").text($('#type-option').find('option:selected').text());
                const room = location.search.substr(6).split('&')
                roomName = decodeURI(room[0]);
                $("#roomName").text(roomName);
                $("#capicity").text("可容纳" + decodeURI(room[1].split("=")[1]));
                roomDateOpChange();
                $('#date-option').on('change', roomDateOpChange);
            }
        }
    })
    if ($('#idConfig').text() === '座位预约') {
        $.ajax({
            type: 'get',
            //新接口测试
            url: 'https://seat.api.hduapp.com/set/choose/lookupallroom',
            xhrFields: {
                withCredentials: true,
            },
            contentType: "application/x-www-form-urlencoded",
            success: function (response) {
                const name = Object.keys(response.status);
                var rooms = [];
                for (var i = 0; i < name.length; i++)
                    rooms.push({ name: name[i], capicity: response.status[name[i]].capicity });
                $('#room-option').html(template('room-tpl', { rOption: rooms }));
                $('#using-room').html($('#room-option').find('option:selected').text());
            },
            error: function (xhr) {
                $('.weui-mask').show();
                $(".weui-dialog__bd").eq(0).html('<p id = "2"><i class="weui-icon-warn weui-icon_msg"></i> 发生错误，请稍候刷新再试，或联系管理员</p>');
                $(".weui-dialog").eq(0).show(300);
            }
        })
    }
}
function dateOpChange(response) {
    if (bjDate.Hour >= 20)
        var timeStamp = Number(response.Systime2) + 86400000;
    else
        var timeStamp = Number(response.Systime2);
    var date = [];
    for (var i = 0; i < 7; i++) {
        var nextDate = new Date(timeStamp + i * 86400000)
        date.push(nextDate.getFullYear() + "-" + (nextDate.getMonth()+1) + "-" + nextDate.getDate())
    }

    $('#date-option').html(template('date-tpl', { rOption: date }));
    $("#using-date").text($('#date-option').find('option:selected').text());
}
function timeOpChange() {
    tOption = [];
    if ($('#using-date').text().split("-")[2] === bjDate.Day) {
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
    $('#using-time').html($('#time-option').find('option:selected').text());
    duraOpChange();
}

function duraOpChange() {
    dOption = [];
    for (var i = 1; i <= 21 - $('#time-option').find('option:selected').val(); i++) {
        dOption.push(i);
    }
    $('#duration-option').html(template('duration-tpl', { dOption: dOption }));
    $('#using-duration').html($('#duration-option').find('option:selected').text());
}
function roomDateOpChange() {
    $.ajax({
        type: 'get',
        url: 'https://seat.api.hduapp.com/room/apply/user/lookuproomvalidtime',
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
            timeOpChange();
        },
        error: function (xhr) {
            $('.weui-mask').show();
            $(".weui-dialog__bd").eq(1).html('<p id = "2"><i class="weui-icon-warn weui-icon_msg"></i> 发生错误，请稍候刷新再试，或联系管理员</p>');
            $(".weui-dialog").eq(1).show(300);
        }
    })
}
function dbCheck(id) {
    $.ajax({
        type: 'get',
        url: 'https://api.limkim.xyz/getSysTime',
        success: function (response) {
            var Hour = Number(response.Systime3.time.split(":")[0]);
            if ($('#using-date').text().split("-")[2] === response.Systime3.Day && bjDate.Hour === Hour) {
                apSubmit(id);
            }
            else if ($('#using-date').text().split("-")[2] != response.Systime3.Day) {
                apSubmit(id);
            }
            else {
                $(".weui-dialog").hide();
                $('.weui-mask').show();
                $(".weui-dialog__bd").html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 当前时间段不可预约或者超时,请重新选择</p>');
                $(".weui-dialog").show(300);
            }
        }
    })
}
function apSubmit(id) {
    var dura = []
    if ($('#time-option').find('option:selected').val() === '8') {
        dura = ['08']
        for (var i = 0; i < $('#duration-option').find('option:selected').val(); i++)
            dura.push((Number($('#time-option').find('option:selected').val()) + i + 1).toString())
    }
    else
        for (var i = 0; i <= $('#duration-option').find('option:selected').val(); i++)
            dura.push((Number($('#time-option').find('option:selected').val()) + i).toString())
    dura = dura.toString();
    var temp = $('#using-date').text().split("-");
    if (Number(temp[1]) < 10)
        temp[1] = "0" + temp[1];
    if (Number(temp[2]) < 10)
        temp[2] = "0" + temp[2];
    var dateUsed = temp[0] + "-" + temp[1] + "-" + temp[2];
    if (id === 1) {
        const info = $('#room-option').find('option:selected').text().split("-");
        window.location.href = "../seatSelect.html?room=" + info[0] + "&cap=" + info[1].split("人")[0] + "&date=" + $('#date-option').find('option:selected').text();
    }
    else if (id === 2) {
        cancel();
        $.ajax({
            type: 'get',
            // 新接口测试
            url: 'https://seat.api.hduapp.com/room/apply/user/chooseroom',
            data: {
                reason: $('#using-reason').val(),
                num: $('#using-pn').val(),
                dateUsed,
                ifCommunity: $('#type-option').find('option:selected').val(),
                rLength: dura,
                roomName,
                utel: $('#using-tel').val(),
            },
            xhrFields: {
                withCredentials: true,
            },
            contentType: "application/x-www-form-urlencoded",
            success: function (response) {
                $('.weui-mask').show();
                const res = JSON.parse(response);
                const status = res.status;
                if (status === 'apply success') {
                    $(".weui-dialog__bd").eq(1).html('<p id = "0"><i class="weui-icon-success weui-icon_msg"></i> 提交成功!请注意审批结果通知</p>');
                    $(".weui-dialog").eq(1).show(300);
                }
                else if (status === 'too much person') {
                    $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 人数超出限制，请检查后重试</p>');
                    $(".weui-dialog").eq(1).show(300);
                }
                else if (status === 'parameters are null') {
                    $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 参数缺少，请检查后重试</p>');
                    $(".weui-dialog").eq(1).show(300);
                }
                else if (status === 'time is error,choose again') {
                    $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 时间信息出错，请检查是否为可用时间段后重试</p>');
                    $(".weui-dialog").eq(1).show(300);
                }
                else if (status === 'request is null') {
                    $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 请求出错，请稍后重试</p>');
                    $(".weui-dialog").eq(1).show(300);
                }
                else if (status === 'credibility is to low') {
                    $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> credibility is to low，请稍后重试</p>');
                    $(".weui-dialog").eq(1).show(300);
                }
                else {
                    $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 你有已提交的预约,请勿重复申请</p>');
                    $(".weui-dialog").eq(1).show(300);
                }
            },
            error: function (xhr) {
                $('.weui-mask').show();
                $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 发生错误，或者有已提交的预约，请勿重复申请</p>');
                $(".weui-dialog").eq(1).show(300);
            }
        })
    }
    else if (id === 3) {
        const info = $('#room-option').find('option:selected').text().split("-");
        window.location.href = "scanQR.html?date=" + $('#date-option').find('option:selected').text();
    }
}
function cancel() {
    $('.weui-mask').hide();
    $(".weui-dialog").hide();
}
function redirect() {
    if ($(".weui-dialog__bd").eq(1).length === 0)
        var target = $(".weui-dialog__bd").eq(0);
    else
        var target = $(".weui-dialog__bd").eq(1);
    switch (target.children("p").eq(0).attr('id')) {
        case '0':
            window.location.href = 'index.html#/myAp'
            break;
        case '2':
            window.location.href = "index.html"
            break
        default:
            location.reload();
    }
}
