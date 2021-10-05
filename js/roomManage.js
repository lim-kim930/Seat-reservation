//所有教室
var rooms = []
var roomName = '';
var states = [];
var applies = [];
var roomIds = [];
var roomId = '';
var p_state = '';
window.onload = function () {
  $.ajax({
    type: "get",
    url: "https://seat.api.hduapp.com/room/manage/admin/lookupallrooms",
    xhrFields: {
      withCredentials: true,
    },
    contentType: "application/x-www-form-urlencoded",
    success: function (response) {
      rooms = Object.keys(response);
      $('#room-option').html(template('ro-tpl', { rOption: rooms }));
      for (var i = 0; i < rooms.length; i++) {
        states[i] = response[rooms[i]].ifOpen;
        applies[i] = response[rooms[i]].applies;
        roomIds[i] = response[rooms[i]].roomId;
      }
      console.log(applies);
      roomGender();
    }
  });
}
$('#room-option').on('change', roomGender)
$('.seat-start').on('click', function () {
  p_state = '';
  if (states[rooms.indexOf(roomName)] === true) {
    p_state = 0
    $('.weui-mask').show();
    $(".weui-dialog__bd").eq(0).html('<p style="font-size: 18px;">确定要关闭 ' + roomName + ' 吗?</p>');
    $(".weui-dialog").eq(0).show(300);
  }
  else {
    p_state = 1
    $('.weui-mask').show();
    $(".weui-dialog__bd").eq(0).html('<p style="font-size: 18px;">确定要开启 ' + roomName + ' 吗?</p>');
    $(".weui-dialog").eq(0).show(300);
  }
})

function roomGender() {
  roomName = $('#room-option').find('option:selected').text();
  roomId = roomIds[rooms.indexOf(roomName)];
  $('#manage-room').html(roomName);
  $('.manage-ap').on('click', function () {
    window.location.href = 'managerIndex.html#/myAp'
  })
  gender(roomName);
}

function gender(room) {
  if (states[rooms.indexOf(room)] === true) {
    $('#manage-state').html('开启中');
    $('#seat-start').html('点击关闭');
  }
  else {
    $('#manage-state').html('关闭中');
    $('#seat-start').html('点击开启');
  }
  if (applies[rooms.indexOf(room)].length === 0){
    $('#pointer').hide();
    $('#manage-ap').html('教室当前暂无相关预约');
  }
  else{
    $('#pointer').show();
    $('#manage-ap').html('教室当前有' + applies[rooms.indexOf(room)].length + '个相关预约');
  }
}
function submit() {
  $('.weui-mask').hide();
  $(".weui-dialog").eq(0).hide();
  $.ajax({
    type: "get",
    url: "https://seat.api.hduapp.com/room/manage/admin/manageroomstate",
    data: {
      roomId,
      rState: p_state,
    },
    xhrFields: {
      withCredentials: true,
    },
    contentType: "application/x-www-form-urlencoded",
    success: function (response) {
      $('.weui-mask').show();
      if(response === ""){
        $(".weui-dialog__bd").eq(1).html('<p id = "0"><i class="weui-icon-success weui-icon_msg"></i> 操作成功!</p>');
        $(".weui-dialog").eq(1).show(300);
        return
      }
      if (JSON.parse(response).status === 'ok') {
        $(".weui-dialog__bd").eq(1).html('<p id = "0"><i class="weui-icon-success weui-icon_msg"></i> 操作成功!</p>');
        $(".weui-dialog").eq(1).show(300);
      }
      else {
        $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 缺少参数,请检查</p>');
        $(".weui-dialog").eq(1).show(300);
      }
    },
    error: function () {
      $('.weui-mask').show();
      $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 发生错误，请稍候刷新再试，或联系管理员</p>');
      $(".weui-dialog").eq(1).show(300);
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