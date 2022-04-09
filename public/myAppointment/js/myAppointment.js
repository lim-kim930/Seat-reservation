var pointer = $('#pointer');
var seat_content = $('#seat-content');
var room_content = $('#room-content');
var seatBtn = $('#seat-btn');
var roomBtn = $('#room-btn');
var flag1 = 1;
function seatSelect() {
    if (flag1 == 0) {
        flag1 = 1;
        pointer.css('left', 0 + '%');
        seatBtn.css('color', '#23C4B7').css('fontWeight', '700');
        roomBtn.css('color', '#a3a3a3').css('fontWeight', '400');
        room_content.css('left', 100 + '%');
        seat_content.css('left', 0);
    }
}
function roomSelect() {
    if (flag1 == 1) {
        flag1 = 0;
        pointer.css('left', 50 + '%');
        roomBtn.css('color', '#23C4B7').css('fontWeight', '700');
        seatBtn.css('color', '#a3a3a3').css('fontWeight', '400');
        seat_content.css('left', -100 + '%');
        room_content.css('left', 0);
    }
}

window.onload = function () {
    $.ajax({
        // 请求方式
        type: 'get',
        // 请求地址
        url: 'http://api.ml.limkim.xyz:3000/getMyAppoint',
        data: JSON.stringify({
            "id": 0
        }),
        // 指定参数的格式类型
        contentType: 'application/json',
        // 请求成功以后函数被调用
        success: function (response) {
            var apTimes = {
                times: response.length,
                breach: 0
            }
            // response为服务器端返回的数据
            if (response.length == 0)
                return false
            for (var i = 0; i < response.length; i++) {
                response[i].startDate = formatDate(response[i].startDate);
                response[i].endDate = formatDate(response[i].endDate);
                switch (response[i].status) {
                    case 0:
                        response[i].status = { signin: '未到签到时间', signout: '未到签退时间', signinClass: 'unsinged', signoutClass: 'unsinged' }
                        break
                    case 1:
                        response[i].status = { signin: '已签到', signout: '未到签退时间', signinClass: 'singed', signoutClass: 'unsinged' }
                        break
                    case 2:
                        response[i].status = { signin: '已签到', signout: '已签退', signinClass: 'singed', signoutClass: 'singed' }
                        break
                    case 3:
                        response[i].status = { signin: '违约', signout: '', signinClass: 'breached', signoutClass: '' }
                        apTimes.breach++
                        break
                    case 4:
                        response[i].status = { signin: '可以签到', signout: '未到签退时间', signinClass: 'singed', signoutClass: 'unsinged' }
                        break
                    case 5:
                        response[i].status = { signin: '已签到', signout: '可以签退', signinClass: 'singed', signoutClass: 'singed' }
                        break
                }
            }
            console.log(response);
            Gender(response, apTimes)
        }
    })
}
function Gender(ap, apTimes) {
    $('#seat-content').html(template('myAp-tpl', { ap: ap }));
    $('#statistic').html(template('statistic-tpl', apTimes));
    $('.seat-info').on('click', function () {
        window.location.href = "../appointInfo/";
        localStorage.removeItem('ap')
        localStorage.setItem('ap', JSON.stringify(ap[this.id]))
    })
}
function formatDate(date) {
    var newDate = date.substring(0, 4) + '年' + date.substring(4, 6) + '月' + date.substring(6, 8) + '日';
    return newDate;
}
