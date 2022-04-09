function windowHeight() {
    var de = document.documentElement;
    return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
}
window.onpageshow = window.onload = window.onresize = function () {
    var wh = windowHeight();
    $('.content').height(wh - 44);
    $('#seat-content').height(wh - 84);
    $('#room-content').height(wh - 84);
}