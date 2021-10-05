window.onload = function () {
    $.ajax({
        type: 'get',
        url: 'https://seat.api.hduapp.com/room/apply/user/lookupallroom',
        xhrFields: {
            withCredentials: true,
        },
        contentType: "application/x-www-form-urlencoded",
        success: function (response) {
            const rooms = ["全部教室"]
            for (var i = 0; i < Object.keys(response).length; i++)
                rooms.push(Object.keys(response)[i])
            $('.hr_container').html(template('hr-tpl', { rOption: response }));
            $('#room-option').html(template('ro-tpl', { rOption: rooms }));
            // $('.act_container').html(template('act-tpl', { rOption: response }));
        },
        error: function (xhr) {
            $('.weui-mask').show();
            $(".weui-dialog__bd").html('<p id = "2"><i class="weui-icon-warn weui-icon_msg"></i> 发生错误，请稍候刷新再试，或联系管理员</p>');
            $(".weui-dialog").show(300);
        }
    })
}
function choosen(room) {
    window.location.href = 'roomHomepage.html?room=' + room.id + "&cap=" + $(room).find("span").text();
}
$("select").on("change", function () {
    $("#seletRoom").text($("select").find("option:selected").text());
})
$("#moreRoom").on("click", function () {
    window.location.href = 'roomList.html';
})