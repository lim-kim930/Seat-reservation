function windowHeight() {
    var de = document.documentElement;
    return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
}
window.onpageshow = window.onresize = function () {
    var wh = windowHeight();
    if ($('.content').height() < wh)
        $('.content').height(wh);
    $('.scroll_helper').eq(0).height(wh - 204)
}