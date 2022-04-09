var bjDate = {};
var tOption = [];
var rOption
var startTime;
$('select').on('change', function () {
    $(this).prev().children().html($(this).find('option:selected').text());
})
$('#time-option').on('change', function () {
    dOptionChange();
})
$('.seat-start').on('click', function () {
    dbCheck(1);
});

window.onload = function () {
    $.ajax({
        // 请求方式
        type: 'get',
        // 请求地址
        url: 'https://quan.suning.com/getSysTime.do',
        // 请求成功以后函数被调用
        success: function (response) {

            // response为服务器端返回的数据
            var sDate = {"sysTime2":"2021-03-23 07:09:43","sysTime1":"20210323070943"}.sysTime2;
            bjDate.Year = Number(sDate.substring(0, 4));
            bjDate.Month = Number(sDate.substring(5, 7));
            bjDate.Day = Number(sDate.substring(8, 10));
            bjDate.Hour = Number(sDate.substring(11, 13));
            bjDate.Min = Number(sDate.substring(14, 16))
            // GetDateStr(bjDate.Year, bjDate.Month, bjDate.Day);
            console.log(bjDate);
            if ($('#idConfig').text() != '教室预约')
                tOptionChange();
        }
    })
    if ($('#idConfig').text() == '座位预约') {
        $.ajax({
            // 请求方式
            type: 'get',
            // 请求地址
            url: 'http://api.ml.limkim.xyz:3000/set/lookupemptyroom',
            success: function (response) {
                console.log(response);
                $('#room-option').html(template('room-tpl', { rOption: response }));
                $('#using-room').html($('#room-option').find('option:selected').text());
            },
        })
    }
    if ($('#idConfig').text() == '教室预约') {
        $.ajax({
            // 请求方式
            type: 'get',
            // 请求地址
            url: 'http://api.ml.limkim.xyz:3000/room/lookupemptyroom',
            success: function (response) {
                console.log(response);
                $('#room-option').html(template('room-tpl', { rOption: response }));
                $('#using-room').html($('#room-option').find('option:selected').text());
                sessionStorage.setItem('emptyroom', JSON.stringify(response))
                qOptionChange(response)
            },
        })
    }
}
function tOptionChange() {
    tOption = [];
    startTime = bjDate.Hour + 1;
    for (startTime; startTime <= 20; startTime++) {
        tOption.push(startTime);
    }
    $('#time-option').html(template('time-tpl', { tOption: tOption }));
    $('#using-time').html($('#time-option').find('option:selected').text());
    dOptionChange();
}
function dOptionChange() {
    dOption = [];
    for (var i = 1; i <= 21 - $('#time-option').find('option:selected').val(); i++) {
        dOption.push(i);
    }
    $('#duration-option').html(template('duration-tpl', { dOption: dOption }));
    $('#using-duration').html($('#duration-option').find('option:selected').text());
}
// function GetDateStr(yy, mm, dd) {
//     var newDate = new Date(yy, mm - 1, dd);
//     newDate.setDate(newDate.getDate() + 1);//获取AddDayCount天后的日期
//     bjDate.nextYear = newDate.getFullYear();
//     bjDate.nextMonth = newDate.getMonth() + 1;//获取当前月份的日期
//     bjDate.nextDay = newDate.getDate();
// }
function qOptionChange(response) {
    var quantum = response[$('#room-option').find('option:selected').val()][1].split(',')
    var newquantum = []
    console.log(quantum);
    for (var i = 0; i < quantum.length; i++) {
        var numquantum = Number(quantum[i])
        // console.log(Number(quantum[i]));
        if (numquantum + 1 == Number(quantum[i + 1]))
            // console.log(numquantum+'~'+ Number(quantum[i+1]));
            newquantum.push({ s: numquantum, e: numquantum + 1 })
    }
    console.log(newquantum);
    $('#quantum-option').html(template('quantum-tpl', newquantum));
}
function dbCheck(id) {
    $.ajax({
        // 请求方式
        type: 'get',
        // 请求地址
        url: 'https://quan.suning.com/getSysTime.do',
        // 请求成功以后函数被调用
        success: function (response) {
            // response为服务器端返回的数据
            var sDate = {"sysTime2":"2021-03-23 07:09:43","sysTime1":"20210323070943"}.sysTime2;
            var hour = Number(sDate.substring(11, 13));
            if (bjDate.Hour == hour && hour < 20) {
                apSubmit(id);
            }
            else if (($('#time-option').find('option:selected').val() != sDate.substring(11, 13)) || ($('#time-option').find('option:selected').val()) == '') {
                alert('当前时间段不可预约,请重新选择');
                location.reload();
            }
        }
    })
}
function apSubmit(id) {
    var roption = $('#room-option').find('option:selected').text()
    var dura = []
    if (id == 1) {
        if ($('#time-option').find('option:selected').val() == '8') {
            dura = ['08']
            for (var i = 0; i < $('#duration-option').find('option:selected').val(); i++)
                dura.push((Number($('#time-option').find('option:selected').val()) + i + 1).toString())
        }
        else
            for (var i = 0; i <= $('#duration-option').find('option:selected').val(); i++)
                dura.push((Number($('#time-option').find('option:selected').val()) + i).toString())
        $.ajax({
            // 请求方式
            type: 'post',
            // 请求地址
            url: 'http://api.ml.limkim.xyz:3000/set/lookupemptyset',
            data: JSON.stringify({
                roomname: roption,
                length: dura.toString()
            }),
            contentType: 'application/json',
            // 请求成功以后函数被调用
            success: function (response) {
                sessionStorage.setItem('room', roption)
                sessionStorage.setItem('dura', dura)
                console.log(dura);
                console.log(roption);
                // response为服务器端返回的数据
                // 方法内部会自动将json字符串转换为json对象
                console.log(response);
                window.location.href = "../seatSelect?emptyseat=" + response;
            }
        })
    }
    else if (id == 2) {
        var wz = roption.indexOf(' ')
        var room = roption.substring(0, wz)
        var qoption = $('#quantum-option span')
        for (var i = 0; i < qoption.length; i++) {
            if (qoption[i].dataset.flag == 1) {
                if (qoption[i].id == '8')
                    qoption[i].id = '08'
                dura.push(qoption[i].id);
                dura.push((Number(qoption[i].id) + 1).toString());
            }
        }
        dura = Array.from(new Set(dura)).toString();
        console.log(dura);
        var applyInfo = {
            rlength: dura,
            reason: $('#using-reason').val(),
            snum: $('#using-pn').val(),
            uname: JSON.parse(localStorage.getItem('user')).uname,
        }
        $.ajax({
            // 请求方式
            type: 'post',
            // 请求地址
            url: 'http://api.ml.limkim.xyz:3000/room/orderroom',
            data: JSON.stringify({
                apply: applyInfo,
                roomname: room,
            }),
            contentType: 'application/json',
            // 请求成功以后函数被调用
            success: function (response) {
                // response为服务器端返回的数据
                // 方法内部会自动将json字符串转换为json对象
                console.log(response);
                alert('提交成功!请注意审批结果通知')
                window.location.href = "../"
            }
        })
        console.log(JSON.parse(localStorage.getItem('user')));
        console.log(applyInfo);
    }
    else if (id == 3) {
        if ($('#time-option').find('option:selected').val() == '8') {
            dura = ['08']
            for (var i = 0; i < $('#duration-option').find('option:selected').val(); i++)
                dura.push((Number($('#time-option').find('option:selected').val()) + i + 1).toString())
        }
        else
            for (var i = 0; i <= $('#duration-option').find('option:selected').val(); i++)
                dura.push((Number($('#time-option').find('option:selected').val()) + i).toString())
        console.log(dura.toString());
        window.location.href = "scanQR.html?dura=" + dura.toString();
    }
}