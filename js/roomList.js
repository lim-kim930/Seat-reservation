var rooms = {};
window.onload = function () {
    $.ajax({
        type: 'get',
        url: 'https://seat.api.hduapp.com/room/apply/user/lookupallroom',
        xhrFields: {
            withCredentials: true,
        },
        contentType: "application/x-www-form-urlencoded",
        success: function (response) {
            const roomList = Object.keys(response);
            var tb = [];
            for (var i = 0; i < roomList.length; i++) {
                if (tb.indexOf(roomList[i].split("教")[0]) === -1) {
                    rooms[roomList[i].split("教")[0]] = [{ name: roomList[i], capicity: response[roomList[i]].capicity }];
                    tb = Object.keys(rooms);
                }
                else
                    rooms[roomList[i].split("教")[0]].push({ name: roomList[i], capicity: response[roomList[i]].capicity });
            }
            $('.tb_select').html(template('tb-tpl', { rOption: tb }));
            $('.rs_container').html(template('rs-tpl', { rOption: rooms[tb[0]] }));
            $(".tb_select span").eq(0).addClass("checked");
        },
        error: function (xhr) {
            $('.weui-mask').show();
            $(".weui-dialog__bd").eq(1).html('<p id = "2"><i class="weui-icon-warn weui-icon_msg"></i> 发生错误，请稍候刷新再试，或联系管理员</p>');
            $(".weui-dialog").eq(1).show(300);
        }
    })
}
function tbChange(par) {
    $(par).siblings().removeClass("checked");
    $(par).addClass("checked");
    $('.rs_container').html(template('rs-tpl', { rOption: rooms[$(par).attr("id")] }));
}
function choosen(room) {
    window.location.href = 'roomHomepage.html?room=' + room.id + "&cap=" + $(room).find("span").text();
}