window.onload = function () {
    getSysTime();
    //判断是否是管理员
    if (location.search.substr(8) === "true")
        $("#call").text("老师");
    //判断是否登录
    else
        $.ajax({
            type: 'get',
            url: 'https://seat.api.hduapp.com/user/info/getuserinfo',
            xhrFields: {
                withCredentials: true,
            },
            contentType: "application/x-www-form-urlencoded",
            success: function (response) {
                if (document.title === "座位预约系统") {
                    if (response.uno === null) {
                        window.location.href = "https://seat.api.hduapp.com/request";
                    } else if (response.ifAdmin === false) {
                        $("#call").text("同学");
                        localStorage.setItem('user', JSON.stringify(response));
                    } else if (response.ifAdmin === true) {
                        $("#call").text("老师");
                        localStorage.setItem('user', JSON.stringify(response));
                        $('.redirect').show();
                        window.location.href = "managerIndex.html";
                    }
                }
                else {
                    if (response.uno === null)
                        window.location.href = "https://seat.api.hduapp.com/request";
                    else if (response.ifAdmin === false)
                        window.location.href = "index.html";
                    else if (response.ifAdmin === true)
                        localStorage.setItem('user', JSON.stringify(response));
                }
            },
            error: function () {
                alert("出错啦!请重新登录");
                window.location.href = "https://seat.api.hduapp.com/request";
            }
        })
    route();
}
//底部按钮点击
$(".footer span").on("click", function () {
    $(".checked").children().attr("src", "images/" + $(".checked").parent().attr("id") + "_before.png");
    $(this).siblings().children().removeClass("checked");
    $(this).children().addClass("checked").children().attr("src", "images/" + $(this).attr("id") + "_after.png");
})
window.onhashchange = route;
//路由改变
function route() {
    let hash = location.hash;
    hash = hash.replace('#', '');
    switch (hash) {
        case '/home':
            $("#myAppage").hide();
            $("#pcpage").hide();
            $("#homepage").css("display", "flex");
            $("#home").click();
            getSysTime();
            break;
        case '/myAp':
            $("#homepage").hide();
            $("#pcpage").hide();
            $("#myAppage").show();
            $("#myAp").click();
            lookup();
            break;
        case '/pc':
            $("#homepage").hide();
            $("#myAppage").hide();
            $("#pcpage").show();
            $("#pc").click();
            getUserInfo();
            break;
    }
}
//获取北京时间
function getSysTime() {
    $.ajax({
        type: 'get',
        url: 'https://quan.suning.com/getSysTime.do',
        success: function (response) {
            // response为服务器端返回的数据
            var sDate = JSON.parse(response).sysTime2;
            switch (Number(sDate.substring(11, 13))) {
                case 9: case 10: case 11:
                    $("#greeting").text("上午好");
                    break;
                case 12:
                    $("#greeting").text("中午好");
                    break;
                case 13: case 14: case 15: case 16: case 17: case 18:
                    $("#greeting").text("下午好");
                    break;
                case 19: case 20: case 21: case 22: case 23:
                    $("#greeting").text("晚上好");
                    break;
                default:
                    $("#greeting").text("早上好");
                    break;
            }
        },
        error: function () {
            alert("获取时间出错,请稍后重试或联系管理员");
        }
    })
}
