function windowHeight() {
    var de = document.documentElement;
    return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
}
window.onpageshow = window.onresize = function () {
    var wh = windowHeight();
    if ($('.content').height() < wh - 44)
        $('.content').height(wh - 44);
}
window.onload = function () {
    var user = JSON.parse(localStorage.getItem('user'));
    if (user.uid == 'student') {
        $('#user-approval').hide()
        user.uid = '学生'
    }
    else if (user.uid == 'manager') {
        $('#user-approval').addClass("only")
        user.uid = '管理员'
    }
    $('#user-name').text(user.uname)
    $('#user-number').text(user.uno)
    $('#user-type').text(user.uid)
}