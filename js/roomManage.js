//所有教室
var rooms = []
var roomName = '';
var states = [];
var applies = [];
var roomIds = [];
var roomId = '';
var url = ""
window.onload = function () {
  $.ajax({
    type: "get",
    url: "https://seat.api.hduapp.com/room/list",
    xhrFields: {
      withCredentials: true,
    },
    // headers: { staffID: 19270808 },
    success: function (response) {
      for (var i = 0; i < response.length; i++)
        rooms.push(response[i].roomID)
      $('#room-option').html(template('ro-tpl', { rOption: rooms }));
      for (var i = 0; i < rooms.length; i++) {
        states[i] = response[i].state;
        roomIds[i] = response[i].roomID;
      }
      roomGender();
    }
  });
}
$('#room-option').on('change', roomGender)
$('.seat-start').on('click', function () {
  $(".input-warnning").hide()
  url = ""
  if (states[rooms.indexOf(roomName)] === "OPEN") {
    if ($("#reason").val().trim().length === 0) {
      $(".input-warnning").show()
      return
    }
    url = "close"
    $('.weui-mask').show();
    $(".weui-dialog__bd").eq(0).html('<p style="font-size: 18px;">确定要关闭 ' + roomName + ' 吗?</p>');
    $(".weui-dialog").eq(0).show(200);
  }
  else {
    url = "open"
    $('.weui-mask').show();
    $(".weui-dialog__bd").eq(0).html('<p style="font-size: 18px;">确定要开启 ' + roomName + ' 吗?</p>');
    $(".weui-dialog").eq(0).show(200);
  }
})

function roomGender() {
  roomName = $('#room-option').find('option:selected').text();
  roomId = roomIds[rooms.indexOf(roomName)];
  $('#manage-room').html(roomName.split("-")[0] + "教" + roomName.split("-")[1]);
  $('.manage-ap').on('click', function () {
    window.location.href = 'managerIndex.html#/myAp'
  })
  gender(roomName);
}

function gender(room) {
  if (states[rooms.indexOf(room)] === "OPEN") {
    $('#manage-state').html('开启中');
    $('#seat-start').html('点击关闭');
    $(".reason").show();
  }
  else {
    $('#manage-state').html('关闭中');
    $('#seat-start').html('点击开启');
    $(".reason").hide();
  }
  // if (applies[rooms.indexOf(room)].length === 0) {
  //   $('#pointer').hide();
  //   $('#manage-ap').html('教室当前暂无相关预约');
  // }
  // else {
  //   $('#pointer').show();
  //   $('#manage-ap').html('教室当前有' + applies[rooms.indexOf(room)].length + '个相关预约');
  // }
}
function submit() {
  $('.weui-mask').hide();
  $(".weui-dialog").eq(0).hide();
  $.ajax({
    type: "put",
    url: "https://seat.api.hduapp.com/room/" + url,
    data: JSON.stringify({
      "roomID": roomId,
      "comment": url === "close" ? $("#reason").val() : "开启"
    }),
    xhrFields: {
      withCredentials: true,
    },
    // headers: { staffID: 19270808 },
    contentType: "application/json",
    success: (response) => {
      weiAlert(1, "success", "操作成功!", "reload");
    },
    error: (xhr) => {
      errHandle(1, xhr, null, "reload")
    }
  });
}
function cancel() {
  $('.weui-mask').hide();
  $(".weui-dialog").hide();
}

function redirect() {
  switch ($(".weui-dialog__bd").eq(1).children("p").eq(0).attr('id')) {
    case '0':
      window.location.href = 'roomManage.html'
      break;
    default:
      location.reload();
  }
}