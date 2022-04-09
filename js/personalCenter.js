function getUserInfo() {
    //根据用户数据判断类型选择展示内容
    const user = JSON.parse(localStorage.getItem('user'));
    if (user.staffTypeList.length === 1 && user.staffTypeList[0] === "STUDENT") {//仅学生
        $('#user-approval').hide()//所有审批
        user.uType = "学生"
    }
    else if (user.staffTypeList.length === 1 && user.staffTypeList[0] === "TEACHER") {//仅老师
        $('#user-approval').addClass("only")
        user.uType = "老师"
    }
    else if (user.staffTypeList.indexOf("ADMIN") !== -1) {//只要有管理员角色,就开放管理员功能
        $('#user-appoint').hide()//我的预约
        $('#user-approval').show()
        $('#room-manage').show()//教室管理
        $('#turn').show()//更改身份类型
        user.uType = "管理员"
    }
    $('#user-name').text(user.staffName)//姓名
    $('#user-number').text(user.staffID)//学号/职工号
    $('#user-type').text(user.uType)//用户类型
    $('#user-unit').text(user.unitName)//学院
}
//所有审批
$('#user-approval').on('click', function () {
    sessionStorage.removeItem('sr_Turned');//点击就清除身份更改,避免出错
    window.location.href = "managerIndex.html#/myAp";
})
//教室管理
$('#room-manage').on('click', function () {
    sessionStorage.removeItem('sr_Turned');
    window.location.href = "roomManage.html";
})
//更改身份
$('#turn').on('click', function () {
    if (sessionStorage.getItem('sr_Turned') === "true") {
        sessionStorage.removeItem('sr_Turned');
        window.location.href = "managerIndex.html";
    }
    else {
        sessionStorage.setItem('sr_Turned', "true");
        window.location.href = "index.html?turned=true";
    }
})
//登出
// $('#logout').on('click', function () {
//     localStorage.removeItem('user')
//     localStorage.removeItem('sr_Turned')
//     // document.cookie = "JSESSIONID=;domain=seat.api.hduapp.com;path=/;max-age=0";
//     $.ajax({
//         type: 'post',
//         url: "https://seat.api.hduapp.com/user/info/logout",
//         xhrFields: {
//             withCredentials: true,
//         },
//         success: function (response) {
//             window.location.href = "https://seat.api.hduapp.com/oauth/hduhelp/request";
//         },
//         error: function (xhr) {
//             alert("发生错误，请稍候刷新再试，或联系管理员")
//             location.reload();
//         }
//     })
// })
