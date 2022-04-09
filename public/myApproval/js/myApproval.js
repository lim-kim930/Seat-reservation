window.onload = function () {
    $.ajax({
        // 请求方式
        type: 'get',
        // 请求地址
        url: 'http://api.ml.limkim.xyz:3000/getMyApproval',
        // 请求成功以后函数被调用
        success: function (response) {
            var apTimes = {
                total: response.length,
                undo: 0
            }
            // response为服务器端返回的数据
            if (response.length == 0)
                return false
            for (var i = 0; i < response.length; i++) {
                response[i].startDate = formatDate(response[i].startDate);
                response[i].endDate = formatDate(response[i].endDate);
                switch (response[i].status) {
                    case 0:
                        response[i].status = '待审批！！'
                        apTimes.undo++
                        break
                    case 1:
                        response[i].status = '已同意'
                        break
                    case 2:
                        response[i].status = '已拒绝'
                        break
                    case 3:
                        response[i].status = '已过期'
                        break
                }
            }
            console.log(response);
            Gender(response, apTimes)
        }
    })
}
function Gender(ap, apTimes) {
    $('#ap-content').html(template('myAp-tpl', { ap: ap }));
    $('#statistic').html(template('statistic-tpl', apTimes));
    $('.ap-info').on('click', function () {
        localStorage.removeItem('approval')
        localStorage.setItem('approval', JSON.stringify(ap[this.id]))
        window.location.href = "../approvalInfo/";
    })
}
function formatDate(date) {
    var newDate = date.substring(0, 4) + '年' + date.substring(4, 6) + '月' + date.substring(6, 8) + '日';
    return newDate;
}
