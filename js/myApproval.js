var ap = [];
const pointer = $("#pointer");
const undo_content = $("#undo-content");
const agree_content = $("#agree-content");
const disagree_content = $("#disagree-content");
const undoBtn = $("#undo-btn");
const agreeBtn = $("#agree-btn");
const disagreeBtn = $("#disagree-btn");
// var room = room = decodeURI(location.search.substr(6).split('=').toString()) || null;
var flag = 0;
var apTimes = {
  total: 0,
  left: 0,
};
function lookup() {
  $('.warnning').hide();
  ap = [];
  apTimes.total = 0;
  var url = ''
  switch (flag) {
    case 0:
      $('.weui-loadmore').eq(0).show();
      //新接口测试
      url = "https://seat.api.hduapp.com/room/apply/admin/applywaiting"
      // url = "https://api.limkim.xyz/getSysTime";
      break
    case 1:
      $('.weui-loadmore').eq(1).show();
      url = "https://seat.api.hduapp.com/room/apply/admin/applypass"
      // url = "https://api.limkim.xyz/getSysTime";
      break
    case 2:
      $('.weui-loadmore').eq(2).show();
      url = "https://seat.api.hduapp.com/room/apply/admin/applyrefuse"
      // url = "https://api.limkim.xyz/getSysTime";
      break
  }
  $.ajax({
    type: "get",
    url,
    xhrFields: {
      withCredentials: true,
    },
    contentType: "application/x-www-form-urlencoded",
    success: function (response) {
      // response = {"12教221":{"12教221":[{"utel":"13003211893","dateUsed":"2021-08-27","reason":"a","applyId":43,"num":1,"ifCommunity":true,"isTeacher":false,"userName":"汤文垚","rlength":"16,17"},{"utel":"13011112222","dateUsed":"2021-08-27","reason":"a","applyId":44,"num":1,"ifCommunity":true,"isTeacher":false,"userName":"汤文垚","rlength":"16,17"},{"utel":"18134620241","dateUsed":"2021-08-27","reason":"111","applyId":55,"num":1,"ifCommunity":true,"isTeacher":false,"userName":"朱勋南","rlength":"17,18"},{"utel":"18134620241","dateUsed":"2021-08-27","reason":"111","applyId":56,"num":11,"ifCommunity":true,"isTeacher":false,"userName":"曹雨豪","rlength":"17,18"},{"utel":"18134620241","dateUsed":"2021-08-27","reason":"11","applyId":58,"num":19,"ifCommunity":true,"isTeacher":false,"userName":"朱勋南","rlength":"17,18"},{"utel":"18134620241","dateUsed":"2021-08-27","reason":"2222","applyId":59,"num":12,"ifCommunity":true,"isTeacher":false,"userName":"曹雨豪","rlength":"18,19"}]},
      //             "12教106":{"12教106":[{"utel":"18067979707","dateUsed":"2021-08-18","reason":"是的","applyId":21,"num":20,"ifCommunity":true,"isTeacher":true,"userName":"吕秋云","rlength":"12,13"},{"utel":"18134620241","dateUsed":"2021-08-27","reason":"11","applyId":45,"num":11,"ifCommunity":true,"isTeacher":false,"userName":"曹雨豪","rlength":"16,17"},{"utel":"18134620241","dateUsed":"2021-08-27","reason":"11","applyId":46,"num":11,"ifCommunity":true,"isTeacher":false,"userName":"朱勋南","rlength":"16,17"},{"utel":"18134620241","dateUsed":"2021-08-27","reason":"1111","applyId":47,"num":1,"ifCommunity":true,"isTeacher":false,"userName":"朱勋南","rlength":"16,17"},{"utel":"18067979707","dateUsed":"8-29-2021","reason":"测试","applyId":49,"num":35,"ifCommunity":true,"isTeacher":true,"userName":"吕秋云","rlength":"14,15"},{"utel":"18067979707","dateUsed":"8-30-2021","reason":"测试","applyId":51,"num":30,"ifCommunity":true,"isTeacher":true,"userName":"吕秋云","rlength":"13,14"}]}}
      // console.log(response);
      // console.log(url);
      // if (room != null)
      //   var keys = room;
      // else
      $('.weui-loadmore').hide();
      if(response === ""){
        $("#statistic").html(template("statistic-undo-tpl", apTimes));
        return
      }
      var keys = Object.keys(response);
      for (var i = 0; i < keys.length; i++) {
        newResponse = response[keys[i]]
        if (newResponse[keys[i]].length != 0) {
          for (var j = 0; j < newResponse[keys[i]].length; j++) {
            apTimes.total++
            switch (flag) {
              case 0:
                newResponse[keys[i]][j].state = "待审批！！";
                apTimes.undo++;
                break;
              case 1:
                newResponse[keys[i]][j].state = "已同意";
                break;
              case 2:
                newResponse[keys[i]][j].state = "已拒绝";
                break;
            }
            newResponse[keys[i]][j].rname = keys[i];
            var quantum = newResponse[keys[i]][j].rlength.split(",");
            var newquantum = [];
            var utime = "";
            for (var k = 0; k < quantum.length; k++) {
              var numquantum = Number(quantum[k]);
              newquantum.push({ s: numquantum, e: numquantum + 1 });
              if (k < quantum.length - 1)
                utime = utime + newquantum[k].s + ":00~" + newquantum[k].e + ":00 ";
            }
            newResponse[keys[i]][j].utime = utime;
            ap.push({
              date: newResponse[keys[i]][j].dateUsed,
              room: keys[i],
              startTime: newResponse[keys[i]][j].utime,
              status: newResponse[keys[i]][j].state,
              applicant: newResponse[keys[i]][j].userName,
              number: newResponse[keys[i]][j].num,
              reason: newResponse[keys[i]][j].reason,
              utel: newResponse[keys[i]][j].utel,
              ifCommunity: newResponse[keys[i]][j].ifCommunity,
              applyId: newResponse[keys[i]][j].applyId
            });
            Gender(flag, ap, apTimes);
          }
        }
      }
      console.log(ap);
      if (ap.length === 0) {
        $('.warnning').eq(flag).show();
        if (flag === 0)
          $("#statistic").html(template("statistic-undo-tpl", apTimes));
        else if (flag === 1)
          $("#statistic").html(template("statistic-agree-tpl", apTimes));
        else if (flag === 2)
          $("#statistic").html(template("statistic-disagree-tpl", apTimes));
        return false;
      }
    },
    error: function () {
      $('.weui-mask').show();
      $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 发生错误，请稍候刷新再试，或联系管理员</p>');
      $(".weui-dialog").eq(1).show(300);
    }
  });
}
function Gender(flag, ap, apTimes) {
  if (flag === 0) {
    $("#undo-content").html(template("myAp-tpl", { ap: ap }));
    $("#statistic").html(template("statistic-undo-tpl", apTimes));
  }
  else if (flag === 1) {
    $("#agree-content").html(template("myAp-tpl", { ap: ap }));
    $("#statistic").html(template("statistic-agree-tpl", apTimes));
  }
  else if (flag === 2) {
    $("#disagree-content").html(template("myAp-tpl", { ap: ap }));
    $("#statistic").html(template("statistic-disagree-tpl", apTimes));
  }
  $(".ap-info").on("click", function () {
    sessionStorage.removeItem("approval");
    sessionStorage.setItem("approval", JSON.stringify(ap[this.id]));
    window.location.href = "approvalInfo.html";
  });
}
function undoSelect() {
  if (flag != 0) {
    flag = 0;
    pointer.css("left", 0 + "%");
    undoBtn.css("color", "#3c27ff").css("fontWeight", "700");
    agreeBtn.css("color", "#a3a3a3").css("fontWeight", "400");
    disagreeBtn.css("color", "#a3a3a3").css("fontWeight", "400");
    agree_content.css("left", 100 + "%");
    disagree_content.css("left", 200 + "%");
    undo_content.css("left", 0);
    lookup(0);
  }
}
function agreeSelect() {
  if (flag != 1) {
    flag = 1;
    pointer.css("left", 33.33 + "%");
    agreeBtn.css("color", "#3c27ff").css("fontWeight", "700");
    undoBtn.css("color", "#a3a3a3").css("fontWeight", "400");
    disagreeBtn.css("color", "#a3a3a3").css("fontWeight", "400");
    undo_content.css("left", -100 + "%");
    disagree_content.css("left", 100 + "%");
    agree_content.css("left", 0);
    lookup(1);
  }
}
function disagreeSelect() {
  if (flag != 2) {
    flag = 2;
    pointer.css("left", 66.66 + "%");
    disagreeBtn.css("color", "#3c27ff").css("fontWeight", "700");
    undoBtn.css("color", "#a3a3a3").css("fontWeight", "400");
    agreeBtn.css("color", "#a3a3a3").css("fontWeight", "400");
    undo_content.css("left", -200 + "%");
    agree_content.css("left", -100 + "%");
    disagree_content.css("left", 0);
    lookup(2);
  }
}
function cancel() {
  $('.weui-mask').hide();
  $(".weui-dialog").hide();
}
function redirect() {
  switch ($(".weui-dialog__bd").eq(1).children("p").eq(0).attr('id')) {
    case '0':
      window.location.href = 'managerIndex.html#/myAp';
      break;
    default:
      location.reload();
  }
}