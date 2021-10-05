function windowHeight() {
    const de = document.documentElement;
    return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
}

window.onpageshow = window.onresize = function () {
    const wh = windowHeight();
    $('.content').height(wh - 44);
}