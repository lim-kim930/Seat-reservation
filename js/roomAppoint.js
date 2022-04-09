$(function () {
    $.ajax({
        type: 'get',
        url: 'https://seat.api.hduapp.com/room/list',
        xhrFields: {
            withCredentials: true,
        },
        // headers: { staffID: 19270808 },
        success: (response) => {
            const rooms = ["全部教室"]
            for (var i = 0; i < response.length; i++)
                if (rooms.indexOf(response[i].belongToBuilding + "教" ) === -1)
                rooms.push(response[i].belongToBuilding + "教")
            $('.hr_container').html(template('hr-tpl', { rOption: response }));
            $('#room-option').html(template('ro-tpl', { rOption: rooms }));
            // $('.act_container').html(template('act-tpl', { rOption: response }));
        },
        error: (xhr) => {
            errHandle(0, xhr, "教室", "reload")
        }
    })
})
function choosen(room) {
    window.location.href = 'roomHomepage.html?room=' + room.id + "&cap=" + $(room).find("span").text();
}
$("select").on("change", function () {
    $("#seletRoom").text($("select").find("option:selected").text());
})
$("#moreRoom").on("click", function () {
    window.location.href = 'roomList.html';
})