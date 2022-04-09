function windowHeight() {
    var de = document.documentElement;
    return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
}
window.onpageshow = window.onresize = function () {
    var wh = windowHeight();

    if ($('.content').height() < 788)
        if (wh < 788)
            $('.content').height(788);
        else
            $('.content').height(wh - 60);
    //系统首页高度自适应
    if (document.title === "座位预约系统" || document.title === "座位预约管理系统") {
        if ($('.pc_content').height() < (wh - 60));
            $('.pc_content').height(wh - 84);
        if ($('.pc_content').height() < 720);
            $('.pc_content').height(720);
        $('.redirect').height(wh);
        $('.myAp_content').height(wh - 60);
        $('#seat-content').height(wh - 189);
        $('#room-content').height(wh - 189);
        $('#undo-content').height(wh - 189);
        $('#agree-content').height(wh - 189);
        $('#disagree-content').height(wh - 189);
    }
    //座位预约页面
    else if (document.title === "座位预约" || document.title === "扫码预约") {
        if (wh < 270)
            $('.content').height(226);
        else
            $('.content').height(wh - 44);
    }
    //座位选择页面
    else if (document.title === "选择座位") {
        if ($('.wrapper').height() < wh - 44)
            $('.wrapper').height(wh - 44);
    }
    //预约详情页面
    else if (document.title === "座位预约详情" || document.title === "教室预约详情" || document.title === "申请详情") {
        if (wh < 560)
            $('.content').height(560)
        else
            $('.content').height(wh - 44);

    }
    //预约详情页面
    else if (document.title === "教室主页" || document.title === "教室预约") {
        if ($('.content').height() < wh)
            $('.content').height(wh);
        $('.scroll_helper').eq(0).height(wh - 204)
    }
    //预约详情页面
    else if (document.title === "教室列表") {
        if ($('.content').height() < wh)
            $('.content').height(wh - 44);
        $('.scroll_helper').height(wh - 69)
    }
}