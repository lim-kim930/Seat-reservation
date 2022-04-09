var flag = 0;
var ap = JSON.parse(localStorage.getItem('approval'));
window.onload = function () {
    if (ap.status == "待审批！！") {
        flag = 0;
    }
    else if (ap.status == "已同意") {
        flag = 1
    }
    else if (ap.status == "已拒绝") {
        flag = 2
    }
    if (ap.status == "已过期") {
        flag = 3
    }
    console.log(ap);
    Gender(ap)
}
function Gender(ap) {
    $('#ap-room').text(ap.room)
    $('#ap-number').text(ap.number)
    $('#ap-start-date').text(ap.startDate)
    $('#ap-start-time').text(ap.startTime + ':00')
    $('#ap-end-date').text(ap.endDate)
    $('#ap-end-time').text(ap.endTime + ':00')
    $('#ap-uname').text(ap.applicant)
    $('#ap-uno').text(ap.applicantno)
    $('#ap-reason').text(ap.reason)
    switch (flag) {
        case 0:
            $('.btn').attr("disabled", false)
            break
        case 1:
            $('#agree-btn').text('已同意该申请')
            break
        case 2:
            $('#disagree-btn').text('已拒绝该申请')
            break
        case 3:
            $('.btn').text('该申请已过期')
            break
    }

}
$('#agree-btn').on('click', function () {
    if (confirm("确定同意该申请吗?")) {
        $.ajax({
            // 请求方式
            type: 'post',
            // 请求地址
            url: 'http://api.ml.limkim.xyz:3000/admin/agree',
            data: JSON.stringify({
                roomname: ap.room,
                uno: ap.applicantno,
            }),
            contentType: 'application/json',
            // 请求成功以后函数被调用
            success: function (response) {
                // response为服务器端返回的数据
                // 方法内部会自动将json字符串转换为json对象
                console.log(response);
                // window.location.href = "../myApproval/";
            }
        })

    }
})
$('#disagree-btn').on('click', function () {
    if (confirm("确定拒绝该申请吗?")){
        $.ajax({
            // 请求方式
            type: 'post',
            // 请求地址
            url: 'http://api.ml.limkim.xyz:3000/admin/refuse',
            data: JSON.stringify({
                roomname: ap.room,
                uno: ap.applicantno,
            }),
            contentType: 'application/json',
            // 请求成功以后函数被调用
            success: function (response) {
                // response为服务器端返回的数据
                // 方法内部会自动将json字符串转换为json对象
                console.log(response);
                // window.location.href = "../myApproval/";
            }
        })
    }
})