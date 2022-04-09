var ap = [];
var rooms = [];
var roomIDs = [];
var roomID = sessionStorage.getItem("query_params") ? JSON.parse(sessionStorage.getItem("query_params")).room : "";
var wait = [];
var pass = [];
var refuse = [];
const pointer = $("#pointer");
const undo_content = $("#undo-content");
const agree_content = $("#agree-content");
const disagree_content = $("#disagree-content");
const undoBtn = $("#undo-btn");
const agreeBtn = $("#agree-btn");
const disagreeBtn = $("#disagree-btn");
// var room = room = decodeURI(location.search.substr(6).split('=').toString()) || null;
var flag = 0;
$('#room-option').on('change', function () {
    roomName = $('#room-option').find('option:selected').text();
    roomID = roomIDs[rooms.indexOf(roomName)];
    sessionStorage.setItem("query_params", JSON.stringify({ room: roomID, flag }));
    $('#manage-room').html(roomName.split("-")[0] + "教" + roomName.split("-")[1]);
    lookup();
})
$(function () {
    $(".loadingToast").hide();
    $(".loadingToast").eq(flag).show();
    if (sessionStorage.getItem("query_params"))
        switch (JSON.parse(sessionStorage.getItem("query_params")).flag) {
            case 1:
                agreeSelect();
                break;
            case 2:
                disagreeSelect();
                break;
        }
    $.ajax({
        type: "get",
        url: "https://seat.api.hduapp.com/room/list",
        xhrFields: {
            withCredentials: true,
        },
        // headers: { staffID: 19270808 },
        success: function (response) {
            $(".loadingToast").hide();
            for (var i = 0; i < response.length; i++)
                rooms.push(response[i].roomID);
            $('#room-option').html(template('ro-tpl', { rOption: rooms }));
            for (var i = 0; i < rooms.length; i++)
                roomIDs[i] = response[i].roomID;
            $('#room-option').val(sessionStorage.getItem("query_params") ? rooms.indexOf(JSON.parse(sessionStorage.getItem("query_params")).room) : 0)
            roomName = $('#room-option').find('option:selected').text();
            roomID = roomIDs[rooms.indexOf(roomName)];
            $('#manage-room').html(roomName.split("-")[0] + "教" + roomName.split("-")[1]);
            if (!sessionStorage.getItem("query_params"))
                lookup();
        },
        error: (xhr) => {
            $(".loadingToast").hide();
            errHandle(0, xhr, null, "reload");
        }
    });
})

function lookup() {
    $('.warnning').hide();
    $(".loadingToast").hide();
    $(".loadingToast").eq(flag).show();
    wait = [];
    pass = [];
    refuse = [];
    $.ajax({
        type: "get",
        url: "https://seat.api.hduapp.com/room/apply/listByRoomID",
        xhrFields: {
            withCredentials: true,
        },
        data: {
            roomID,
        },
        // headers: { staffID: 19270808 },
        // contentType: "application/x-www-form-urlencoded",
        success: function (response) {
            // response = {"12教221":{"12教221":[{"utel":"13003211893","dateUsed":"2021-08-27","reason":"a","applyId":43,"num":1,"ifCommunity":true,"isTeacher":false,"userName":"汤文垚","rlength":"16,17"},{"utel":"13011112222","dateUsed":"2021-08-27","reason":"a","applyId":44,"num":1,"ifCommunity":true,"isTeacher":false,"userName":"汤文垚","rlength":"16,17"},{"utel":"18134620241","dateUsed":"2021-08-27","reason":"111","applyId":55,"num":1,"ifCommunity":true,"isTeacher":false,"userName":"朱勋南","rlength":"17,18"},{"utel":"18134620241","dateUsed":"2021-08-27","reason":"111","applyId":56,"num":11,"ifCommunity":true,"isTeacher":false,"userName":"曹雨豪","rlength":"17,18"},{"utel":"18134620241","dateUsed":"2021-08-27","reason":"11","applyId":58,"num":19,"ifCommunity":true,"isTeacher":false,"userName":"朱勋南","rlength":"17,18"},{"utel":"18134620241","dateUsed":"2021-08-27","reason":"2222","applyId":59,"num":12,"ifCommunity":true,"isTeacher":false,"userName":"曹雨豪","rlength":"18,19"}]},
            //             "12教106":{"12教106":[{"utel":"18067979707","dateUsed":"2021-08-18","reason":"是的","applyId":21,"num":20,"ifCommunity":true,"isTeacher":true,"userName":"吕秋云","rlength":"12,13"},{"utel":"18134620241","dateUsed":"2021-08-27","reason":"11","applyId":45,"num":11,"ifCommunity":true,"isTeacher":false,"userName":"曹雨豪","rlength":"16,17"},{"utel":"18134620241","dateUsed":"2021-08-27","reason":"11","applyId":46,"num":11,"ifCommunity":true,"isTeacher":false,"userName":"朱勋南","rlength":"16,17"},{"utel":"18134620241","dateUsed":"2021-08-27","reason":"1111","applyId":47,"num":1,"ifCommunity":true,"isTeacher":false,"userName":"朱勋南","rlength":"16,17"},{"utel":"18067979707","dateUsed":"8-29-2021","reason":"测试","applyId":49,"num":35,"ifCommunity":true,"isTeacher":true,"userName":"吕秋云","rlength":"14,15"},{"utel":"18067979707","dateUsed":"8-30-2021","reason":"测试","applyId":51,"num":30,"ifCommunity":true,"isTeacher":true,"userName":"吕秋云","rlength":"13,14"}]}}
            // console.log(response);
            // console.log(url);
            // if (room != null)
            //   var keys = room;
            // else
            const data = response.data;
            const len = data.length
            if (len === 0) {
                Gender()
                return
            }
            for (var i = 0; i < len; i++) {
                const start = new Date(data[i].startAt);
                const end = new Date(data[i].endAt);
                switch (data[i].state) {
                    case "WAITING":
                        wait.push({
                            startDate: start.getFullYear() + "/" + (start.getMonth() + 1) + "/" + start.getDate() + " " + start.getHours(),
                            endDate: end.getFullYear() + "/" + (end.getMonth() + 1) + "/" + end.getDate() + " " + end.getHours(),
                            room: data[i].room.roomID.split("-")[0] + "教" + data[i].room.roomID.split("-")[1],
                            status: "待审批！！",
                            staffID: data[i].applier.staffID,
                            staffName: data[i].applier.staffName,
                            number: data[i].useManCount,
                            reason: data[i].reason,
                            utel: data[i].applierPhone,
                            ifCommunity: data[i].fromCommunity === true ? "是" : "否",
                            applyID: data[i].applyID
                        });
                        break;
                    case "ACCEPTED":
                        pass.push({
                            startDate: start.getFullYear() + "/" + (start.getMonth() + 1) + "/" + start.getDate() + " " + start.getHours(),
                            endDate: end.getFullYear() + "/" + (end.getMonth() + 1) + "/" + end.getDate() + " " + end.getHours(),
                            room: data[i].room.roomID.split("-")[0] + "教" + data[i].room.roomID.split("-")[1],
                            status: "已同意",
                            staffID: data[i].applier.staffID,
                            staffName: data[i].applier.staffName,
                            number: data[i].useManCount,
                            reason: data[i].reason,
                            utel: data[i].applierPhone,
                            ifCommunity: data[i].fromCommunity === true ? "是" : "否",
                            applyID: data[i].applyID
                        });
                        break;
                    case "REFUSED":
                        refuse.push({
                            startDate: start.getFullYear() + "/" + (start.getMonth() + 1) + "/" + start.getDate() + " " + start.getHours(),
                            endDate: end.getFullYear() + "/" + (end.getMonth() + 1) + "/" + end.getDate() + " " + end.getHours(),
                            room: data[i].room.roomID.split("-")[0] + "教" + data[i].room.roomID.split("-")[1],
                            status: "已拒绝",
                            staffID: data[i].applier.staffID,
                            staffName: data[i].applier.staffName,
                            number: data[i].useManCount,
                            reason: data[i].reason,
                            refuse: data[i].reviewComment,
                            utel: data[i].applierPhone,
                            ifCommunity: data[i].fromCommunity === true ? "是" : "否",
                            applyID: data[i].applyID
                        });
                        break;
                }
            }
            Gender();
            $(".loadingToast").hide();
            // var keys = Object.keys(response);
            // for (var i = 0; i < keys.length; i++) {
            //   newResponse = response[keys[i]]
            //   if (newResponse[keys[i]].length != 0) {
            //     for (var j = 0; j < newResponse[keys[i]].length; j++) {
            //       apTimes.total++
            //       switch (flag) {
            //         case 0:
            //           newResponse[keys[i]][j].state = "待审批！！";
            //           apTimes.undo++;
            //           break;
            //         case 1:
            //           newResponse[keys[i]][j].state = "已同意";
            //           break;
            //         case 2:
            //           newResponse[keys[i]][j].state = "已拒绝";
            //           break;
            //       }
            //       newResponse[keys[i]][j].rname = keys[i];
            //       var quantum = newResponse[keys[i]][j].rlength.split(",");
            //       var newquantum = [];
            //       var utime = "";
            //       for (var k = 0; k < quantum.length; k++) {
            //         var numquantum = Number(quantum[k]);
            //         newquantum.push({ s: numquantum, e: numquantum + 1 });
            //         if (k < quantum.length - 1)
            //           utime = utime + newquantum[k].s + ":00~" + newquantum[k].e + ":00 ";
            //       }
            //       newResponse[keys[i]][j].utime = utime;

            //     }
            //   }
            // }
        },
        error: (xhr) => {
            $(".loadingToast").hide();
            errHandle(0, xhr, null, "reload")
        }
    });
}

function Gender() {
    $("#undo-content").html(template("myAp-tpl", { ap: wait }));
    $("#agree-content").html(template("myAp-tpl", { ap: pass }));
    $("#disagree-content").html(template("myAp-tpl", { ap: refuse }));
    if (wait.length === 0)
        $('.warnning').eq(0).show()
    if (pass.length === 0)
        $('.warnning').eq(1).show()
    if (refuse.length === 0)
        $('.warnning').eq(2).show()
    $(".ap-info").on("click", function () {
        sessionStorage.removeItem("approval");
        switch (flag) {
            case 0:
                sessionStorage.setItem("approval", JSON.stringify(wait[this.id]));
                break;
            case 1:
                sessionStorage.setItem("approval", JSON.stringify(pass[this.id]));
                break;
            case 2:
                sessionStorage.setItem("approval", JSON.stringify(refuse[this.id]));
                break;
        }
        window.location.href = "approvalInfo.html";
    });
}

function undoSelect() {
    if (flag != 0) {
        flag = 0;
        sessionStorage.setItem("query_params", JSON.stringify({ room: roomID, flag }));
        pointer.css("left", 0 + "%");
        undoBtn.css("color", "#3c27ff").css("fontWeight", "700");
        agreeBtn.css("color", "#a3a3a3").css("fontWeight", "400");
        disagreeBtn.css("color", "#a3a3a3").css("fontWeight", "400");
        agree_content.css("left", 100 + "%");
        disagree_content.css("left", 200 + "%");
        undo_content.css("left", 0);
    }
}

function agreeSelect() {
    if (flag != 1) {
        flag = 1;
        sessionStorage.setItem("query_params", JSON.stringify({ room: roomID, flag }));
        pointer.css("left", 33.33 + "%");
        agreeBtn.css("color", "#3c27ff").css("fontWeight", "700");
        undoBtn.css("color", "#a3a3a3").css("fontWeight", "400");
        disagreeBtn.css("color", "#a3a3a3").css("fontWeight", "400");
        undo_content.css("left", -100 + "%");
        disagree_content.css("left", 100 + "%");
        agree_content.css("left", 0);
    }
}

function disagreeSelect() {
    if (flag != 2) {
        flag = 2;
        sessionStorage.setItem("query_params", JSON.stringify({ room: roomID, flag }));
        pointer.css("left", 66.66 + "%");
        disagreeBtn.css("color", "#3c27ff").css("fontWeight", "700");
        undoBtn.css("color", "#a3a3a3").css("fontWeight", "400");
        agreeBtn.css("color", "#a3a3a3").css("fontWeight", "400");
        undo_content.css("left", -200 + "%");
        agree_content.css("left", -100 + "%");
        disagree_content.css("left", 0);
    }
}