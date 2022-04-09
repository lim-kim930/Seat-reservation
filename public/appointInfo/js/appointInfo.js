var flag = 0;
window.onload = function () {
    var ap = JSON.parse(localStorage.getItem('ap'));
    if (ap.status.signin == "已签到") {
        if (ap.status.signout == "已签退") {
            ap.status = '预约已完成'
            flag = 1
        }
        else if (ap.status.signout == "未到签退时间") {
            ap.status = '我要暂离'
            flag = 0
        }
        else {
            ap.status = '签退'
            flag = 2
        }
    }
    else if (ap.status.signin == "未到签到时间") {
        ap.status = '未到签到时间'
        flag = 1
    }
    else if (ap.status.signin == "可以签到") {
        ap.status = '请前往教室签到'
        flag = 1
    }
    if (ap.status.signin == "违约") {
        ap.status = '此次预约违约'
        flag = 1
    }
    console.log(ap);
    Gender(ap)
}
function Gender(ap) {
    $('.content').html(template('apInfo-tpl', ap));
    if (flag == 1)
        $('.leave').hide()
    else if (flag == 0) {
        $('h3').text('未到签退时间')
        $('.btn').on('click', function () {
            if (confirm('确定要设定暂离吗,系统将为你保留半小时的使用权')) {
                $.ajax({
                    // 请求方式
                    type: 'get',
                    // 请求地址
                    url: 'http://api.ml.limkim.xyz:3000/set/leave',
                    success: function (response) {
                        console.log(response);
                        alert('暂离成功!')
                        window.location.href = '../'
                    },
                })
            }
        })
    }
    else if (flag == 2) {
        $('h3').text('预约已经可以签退')
        $('.btn').on('click', function () {
            if (confirm('确定要签退吗')) {
                $.ajax({
                    // 请求方式
                    type: 'get',
                    // 请求地址
                    url: 'http://api.ml.limkim.xyz:3000/set/quit',
                    success: function (response) {
                        console.log(response);
                        alert('签退成功!')
                        window.location.href = '../'
                    },
                })
            }
        })
    }
}