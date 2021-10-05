function windowHeight() {
    var de = document.documentElement;
    return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
}
window.onpageshow = window.onresize = function () {
    var wh = windowHeight();
    if (wh < 270)
        $('.content').height(226);
    else
        $('.content').height(wh - 44);

}