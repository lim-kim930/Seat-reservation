$(function () {

    //先通过url参数和localStorage双重判断是否是管理员切换来的
    if (location.search.substr(8) === "true" && sessionStorage.getItem('sr_Turned') !== null) {
        $("#call").text("老师");
        route();//判断路由
        return;
    }
    else if (location.search.substr(8) !== "true" && sessionStorage.getItem('sr_Turned') !== null)
        sessionStorage.removeItem('sr_Turned')
    //再判断是否登录
    $.ajax({
        type: 'get',
        url: 'https://seat.api.hduapp.com/user/getSelf',
        xhrFields: {
            withCredentials: true,
        },
        // headers: { staffID: 19270808 },
        success: function (response) {
            const data = response.data;
            if (data === null || data === undefined) {//拿不到信息提示
                weiAlert(0, "warn", "获取用户信息出错,请稍后重新登录再试,或联系管理员,错误信息: " + response.msg, "resign");
                return
            }
            if (document.title === "座位预约系统") {
                if (data.staffTypeList.length === 1 && data.staffTypeList[0] === "STUDENT") {//只有一个学生身份时
                    $("#call").text("同学");
                    localStorage.setItem('user', JSON.stringify(response.data));
                } else if (data.staffTypeList.indexOf("ADMIN") !== -1) {//只要有管理员
                    $("#call").text("老师");
                    localStorage.setItem('user', JSON.stringify(response.data));
                    window.location.href = "managerIndex.html";
                } else if (data.staffTypeList.indexOf("TEACHER") !== -1) {//有老师或者管理员身份时都显示为老师
                    $("#call").text("老师");
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
            }
            else if (document.title === "座位预约管理系统") {//判断为managrIndex.html
                if (data.staffTypeList.indexOf("ADMIN") === -1)
                    window.location.href = "index.html";
                else if (data.staffTypeList.indexOf("TEACHER") !== -1 || data.staffTypeList.indexOf("ADMIN") !== -1)
                    localStorage.setItem('user', JSON.stringify(response.data));
            }
        },
        error: (err) => {
            errHandle(0, err, "用户", "reload")
        }
    })
    route();//判断路由
})
//底部按钮点击
$(".footer span").on("click", function () {
    $(".checked").children().attr("src", "images/" + $(".checked").parent().attr("id") + "_before.png");
    $(this).siblings().children().removeClass("checked");
    $(this).children().addClass("checked").children().attr("src", "images/" + $(this).attr("id") + "_after.png");
})
//监听路由改变
window.onhashchange = route;
//路由改变函数
function route() {
    let hash = location.hash.replace('#', '');
    switch (hash) {
        case '/home':
        case "":
            $("#myAppage").hide();
            $("#pcpage").hide();
            $("#homepage").css("display", "flex");
            $("#home").click();
            // 根据时间设置首页greeting
            const sysTime = getSysTime()
            var sDate = sysTime.Systime3.time.split(":")[0];//拿到当前时间小时的值
            switch (Number(sDate)) {
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
            break;
        case '/myAp':
            $("#homepage").hide();
            $("#pcpage").hide();
            $("#myAppage").show();
            $("#myAp").click();
            if ($("#title").text() === "我的预约" || ($("#title").text() === "审批管理" && roomID))
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
