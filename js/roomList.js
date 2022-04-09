var rooms = {};
window.onload = function () {
    $.ajax({
        type: 'get',
        url: 'https://seat.api.hduapp.com/room/list',
        xhrFields: {
            withCredentials: true,
        },
        // headers: { staffID: 19270808 },
        // contentType: "application/x-www-form-urlencoded",
        success: function (response) {
            var tb = [];
            for (var i = 0; i < response.length; i++) {i
                if (tb.indexOf(response[i].belongToBuilding) === -1) {
                    rooms[+response[i].belongToBuilding] = [{ name: response[i].roomID, capacity: response[i].capacity }];
                    tb = Object.keys(rooms);
                }
                else
                    rooms[+response[i].belongToBuilding].push({ name: response[i].roomID, capacity: response[i].capacity });
            }
            $('.tb_select').html(template('tb-tpl', { rOption: tb }));
            $('.rs_container').html(template('rs-tpl', { rOption: rooms[tb[0]] }));
            $(".tb_select span").eq(0).addClass("checked");
        },
        error: function (xhr) {
            $('.weui-mask').show();
            $(".weui-dialog__bd").eq(1).html('<p id = "2"><i class="weui-icon-warn weui-icon_msg"></i> 发生错误，请稍候刷新再试，或联系管理员</p>');
            $(".weui-dialog").eq(1).show(200);
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