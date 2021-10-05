function getUserInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user.uType === 1 && user.ifAdmin === false) {
        $('#user-approval').hide()
        user.uType = '学生'
    }
    else if (user.uType === 2 && user.ifAdmin === false) {
        $('#user-approval').addClass("only")
        user.uType = '老师'
    }
    else if (user.ifAdmin === true) {
        $('#user-appoint').hide()
        $('#user-approval').show()
        $('#room-manage').show()
        $('#turn').show()
        user.uType = '管理员'
        url = 'https://seat.api.hduapp.com/admin/quit';
    }
    $('#user-name').text(user.uName)
    $('#user-number').text(user.uno)
    $('#user-type').text(user.uType)
    $('#user-unit').text(user.unitName)
}
$('#user-approval').on('click', function () {
    window.location.href = "managerIndex.html#/myAp";
})
$('#room-manage').on('click', function () {
    window.location.href = "roomManage.html";
})
$('#turn').on('click', function () {
    if (localStorage.getItem('sr_Turned') === "true") {
        localStorage.removeItem('sr_Turned');
        window.location.href = "managerIndex.html";
    }
    else {
        localStorage.setItem('sr_Turned', "true");
        window.location.href = "index.html?turned=true";
    }
})
$('#logout').on('click', function () {
    localStorage.removeItem('user')
    localStorage.removeItem('sr_Turned')
    // document.cookie = "JSESSIONID=;domain=seat.api.hduapp.com;path=/;max-age=0";
    $.ajax({
        type: 'get',
        url: "https://seat.api.hduapp.com/user/info/logout",
        xhrFields: {
            withCredentials: true,
        },
        success: function (response) {
            window.location.href = "https://seat.api.hduapp.com/request";
        },
        error: function (xhr) {
            alert("发生错误，请稍候刷新再试，或联系管理员")
            location.reload();
        }
    })
    // var keys = document.cookie.match(/[^ =;]+(?==)/g)
    // if (keys) {
    //     for (var i = keys.length; i--;) {
    //         document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString() // 清除当前域名下的,例如：m.ratingdog.cn
    //         // document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString() // 清除当前域名下的，例如 .m.ratingdog.cn
    //     }
    // }
    // function delCookie() {
    //     var keys = document.cookie.match(/[^ =;]+(?==)/g)
    //     if (keys) {
    //         for (var i = keys.length; i--;) {
    //             document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString() // 清除当前域名下的,例如：m.ratingdog.cn
    //             // document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString() // 清除当前域名下的，例如 .m.ratingdog.cn
    //             // document.cookie = keys[i] + '=0;path=/;domain=ratingdog.cn;expires=' + new Date(0).toUTCString() // 清除一级域名下的或指定的，例如 .ratingdog.cn
    //         }
    //     }
    // }
    // delCookie()
    // window.location.href = "https://seat.api.hduapp.com/request";
})
