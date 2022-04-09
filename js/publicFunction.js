// 获取时间
function getSysTime() {
    var response = "";
    $.ajax({
        async: false,//将ajax改成同步
        type: 'get',
        url: 'https://api.limkim.xyz/getSysTime',
        success: (res) => {
            response = res;
        },
        error: () => {
            weiAlert(0, "warn", "获取时间信息出错,请稍后重试或联系管理员", "reload")
        }
    })
    return response;//返回JSON格式的时间信息
}
//触发弹出框
function weiAlert(eq, icon, text, callbackID, url) {
    //先清除当前所有弹框
    $(".loadingToast").hide();
    $(".weui-dialog").hide();
    $('.weui-mask').show();//背景遮罩层
    if (icon !== null)
        $(".weui-dialog__bd").eq(eq).html("<p><i class='weui-icon-" + icon + " weui-icon_msg'></i> " + text + "</p>");//提示信息
    else
        $(".weui-dialog__bd").eq(eq).html("<p>" + text + "</p>");//提示信息
    if (callbackID !== null)
        if (url === null)
            $(".weui-dialog__bd").eq(eq).next().children("a").attr("href", "javascript:alertCallback('" + callbackID + "')");//回调函数参数
        else
            $(".weui-dialog__bd").eq(eq).next().children("a").attr("href", "javascript:alertCallback('" + callbackID + "','" + url + "')");//是redirect时多设置一个url
    $(".weui-dialog").eq(eq).show(200);//显示弹框,200ms延迟
}
// 弹出框回调函数
function alertCallback(id, url) {
    switch (id) {
        case "cancel"://仅关闭弹框
            $('.weui-mask').hide();
            $(".weui-dialog").hide();
            break;
        case "redirect"://重定向到指定url
            window.location.href = url;
            break;
        case "reload"://重新加载页面
            location.reload();
            break;
        case "resign"://去登录
            reSign();
            break;
    }
}
//请求登录函数
function reSign() {
    $.ajax({
        type: 'get',
        url: 'https://seat.api.hduapp.com/oauth/hduhelp/request',
        xhrFields: {
            withCredentials: true,
        },
        success: (response) => {
            window.location.href = response;
        },
        error: () => {
            weiAlert(0, "warn", "请求登录出错啦！请稍后重试，或联系管理员", "reload");
        }
    })
}
//错误处理
function errHandle(id, err, text, callbackID, other) {
    if (err.status === 401)//401 unauthorized重新登录
        reSign();
    else if (err.status === 0)//0可能为拿不到错误,请求发送失败
        weiAlert(id, "warn", "获取信息出错了,可能是网络原因,请稍后重试", callbackID !== undefined ? callbackID : "reload");
    else {
        if (text !== null)
            weiAlert(id, "warn", "获取" + text + "信息出错,请稍后重新登录再试,或联系管理员,错误信息: " + err.responseJSON.msg, callbackID !== undefined ? callbackID : "resign");
        else
            weiAlert(id, "warn", err.responseJSON.msg, callbackID !== undefined ? callbackID : "resign");
    }
}