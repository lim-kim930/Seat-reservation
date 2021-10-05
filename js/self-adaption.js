function windowHeight() {
    var de = document.documentElement;
    return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
}
window.onpageshow = window.onresize = function () {
    var wh = windowHeight();

    if ($('.content').height() < 788)
        if(wh < 788)
            $('.content').height(788);
        else
            $('.content').height(wh - 60);
    if ($('.pc_content').height() < (wh - 60))
        $('.pc_content').height(wh - 84)
    if ($('.pc_content').height() < 720)
        $('.pc_content').height(720)
    $('.redirect').height(wh);
    $('.myAp_content').height(wh - 60);
    $('#seat-content').height(wh - 189);
    $('#room-content').height(wh - 189);
    $('#undo-content').height(wh - 189);
    $('#agree-content').height(wh - 189);
    $('#disagree-content').height(wh - 189);
}