const pointer = $("#pointer");
const seat_content = $("#seat-content");
const room_content = $("#room-content");
const seatBtn = $("#seat-btn");
const roomBtn = $("#room-btn");
let flag1 = 0;

function seatSelect() {
  if (flag1 === 1) {
    flag1 = 0;
    pointer.css("left", 0 + "%");
    seatBtn.css("color", "#3c27ff").css("fontWeight", "700");
    roomBtn.css("color", "#a3a3a3").css("fontWeight", "400");
    room_content.css("left", 100 + "%");
    seat_content.css("left", 0);
    lookup();
  }
}
function roomSelect() {
  if (flag1 === 0) {
    flag1 = 1;
    pointer.css("left", 50 + "%");
    roomBtn.css("color", "#3c27ff").css("fontWeight", "700");
    seatBtn.css("color", "#a3a3a3").css("fontWeight", "400");
    seat_content.css("left", -100 + "%");
    room_content.css("left", 0);
    lookup();
  }
}
function Gender(ap, apTimes) {
  let container = "",
    tpl = "";
  if (flag1 === 0) {
    container = "#seat-content";
    tpl = "seat-tpl";
  } else {
    container = "#room-content";
    tpl = "room-tpl";
  }
  $(container).html(template(tpl, { ap: ap }));
  $("#statistic").html(template("statistic-tpl", apTimes));
  $(".seat-info").on("click", function () {
    sessionStorage.removeItem("ap");
    sessionStorage.setItem("ap", JSON.stringify(ap[this.id]));
    if (flag1 === 0) {
      window.location.href = "seatAppointInfo.html";
    } else {
      window.location.href = "roomAppointInfo.html";
    }
  });
}
function lookup() {
  $('.warnning').hide();
  let url = "";
  if (flag1 === 0) {
    $('.weui-loadmore').eq(0).show();
    //新接口测试
    url = "https://seat.api.hduapp.com/user/info/getsetinfo";
  } else {
    $('.weui-loadmore').eq(1).show();
    //新接口测试
    url = "https://seat.api.hduapp.com/user/info/getroominfo";
  }
  $.ajax({
    type: "get",
    url,
    xhrFields: {
      withCredentials: true,
    },
    contentType: "application/x-www-form-urlencoded",
    success: function (response) {
      // response = JSON.stringify({ "status": { "7": { "dateUsed": "2021-8-8", "sLength": "8", "setId": 3, "state": 1, "roomName": "12?221" },
      // "8": { "dateUsed": "2021-8-8", "sLength": "8,9", "setId": 6, "state": 2, "roomName": "12?221" } } })
      const seats = Object.keys(JSON.parse(response).status)
      response = Object.values(JSON.parse(response).status);
      const apTimes = {
        times: response.length,
        breach: 0,
      };
      $('.weui-loadmore').hide();
      if (response.length === 1 && (response[0].sLength === "" || (response[0].sLength === null))) {
        $('.warnning').eq(flag1).show();
        apTimes.times = 0;
        $("#statistic").html(template("statistic-tpl", apTimes));
        return false;
      }
      if (response.length === 0) {
        $('.warnning').eq(flag1).show();
        $("#statistic").html(template("statistic-tpl", apTimes));
        return false;
      }
      for (let i = 0; i < response.length; i++) {
        if(response[i].sLength === undefined)
          var dateList = response[i].rLength.split(",");
        else
          var dateList = response[i].sLength.split(",");
        const startDate = dateList[0];
        const endDate = Number(dateList[dateList.length - 1]) + 1;
        response[i].startDate = startDate;
        response[i].endDate = endDate;
        response[i].setName = seats[i];
        if(response[i].roomName.indexOf("?") != -1){
          response[i].roomName = response[i].roomName.split("?")[0]+"教"+response[i].roomName.split("?")[1]
        }
        if (flag1 === 0) {
          switch (+response[i].state) {
            case 0:
              response[i].status = {
                signin: "未到达",
                signout: "",
                signinClass: "unsinged",
                signoutClass: "unsinged",
              };
              break;
            case 1:
              response[i].status = {
                signin: "已签到",
                signout: "正在使用中",
                signinClass: "singed",
                signoutClass: "singed",
              };
              break;
            case 2:
              response[i].status = {
                signin: "已签到",
                signout: "暂时离开中",
                signinClass: "singed",
                signoutClass: "singed",
              };
              break;
            case 3:
              response[i].status = {
                signin: "占座失败",
                signout: "",
                signinClass: "breached",
                signoutClass: "breached",
              };
              apTimes.breach++;
              break;
            case 4:
              response[i].status = {
                signin: "已签到",
                signout: "已签退",
                signinClass: "singed",
                signoutClass: "singed",
              };
              break;
            case 5:
              response[i].status = {
                signin: "未及时到达座位",
                signout: "",
                signinClass: "breached",
                signoutClass: "breached",
              };
              apTimes.breach++;
              break;
          }
        } else {
          switch (+response[i].applyState) {
            case 0:
              response[i].status = {
                signin: "待审批",
                signinClass: "unsinged",
              };
              break;
            case 1:
              response[i].status = {
                signin: "通过",
                signinClass: "singed",
              };
              break;
            case 2:
              response[i].status = {
                signin: "拒绝",
                signinClass: "breached",
              };
              break;
            case 3:
                response[i].status = {
                  signin: "已取消",
                  signinClass: "breached",
                };
                break;
          }
        }
      }
      console.log(response);
      console.log(apTimes);
      Gender(response, apTimes);
    },
    error: function (err) {
      if (confirm("出错啦,请重新登录后重试或联系管理员"))
        window.location.href = "https://seat.api.hduapp.com/request";
    }
  });
}
function formatDate(date) {
  return date + "时";
}
