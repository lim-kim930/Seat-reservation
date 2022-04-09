const seatBtn = $("#seat-btn");//座位选择按钮
const roomBtn = $("#room-btn");//教室选择按钮
const pointer = $("#pointer");//选择按钮下的横条指示
const seat_content = $("#seat-content");//座位预约显示区域
const room_content = $("#room-content");//教室预约显示区域
let flag1 = 0;//指示条位置标识变量
//切换函数
function contentSwitch(id) {
  var params = []//用数组存放css样式数值,简化代码
  if (flag1 === 1 && id === "seat") {
    flag1 = 0;
    params = [0, "#3c27ff", "#a3a3a3", "700", "400", "100%", 0]
  }
  else if (flag1 === 0 && id === "room") {
    flag1 = 1;
    params = ["50%", "#a3a3a3", "#3c27ff", "400", "700", 0, "-100%"]
  }
  else //在已经切换的状态再点击直接return
    return;
  pointer.css("left", params[0]);
  seatBtn.css("color", params[1]).css("fontWeight", params[3]);
  roomBtn.css("color", params[2]).css("fontWeight", params[4]);
  seat_content.css("left", params[6]);
  room_content.css("left", params[5]);
  lookup();
}
//获取预约信息
function lookup() {
  $('.warnning').hide();//隐藏空结果提示
  $(".loadingToast").hide();//隐藏加载
  let url = "";
  $(".loadingToast").eq(flag1).show();
  if (flag1 === 0)
    url = "https://seat.api.hduapp.com/seat/apply/listByUser";
  else
    url = "https://seat.api.hduapp.com/room/apply/listByUser";
  $.ajax({
    type: "get",
    url,
    // data: {
    //   staffID: 19270808
    // },
    xhrFields: {
      withCredentials: true,
    },
    // headers: { staffID: 19270808 },
    success: function (response) {
      //下面对拿到的数据进行整理,放到totalAp里进行渲染
      var totalAp = [];
      const data = response.data;
      const len = data.length;
      var apTimes = {
        times: len,
        breach: 0,
      };
      $(".loadingToast").hide();
      //如果没预约,直接渲染statistic然后return
      if (len === 0) {
        $('.warnning').eq(flag1).show();
        $("#statistic").html(template("statistic-tpl", apTimes));
        return;
      }
      const sysTime = getSysTime().Systime2
      for (let i = 0; i < len; i++) {
        var status = {};
        const start = new Date(data[i].startAt);
        const end = new Date(data[i].endAt);
        if (flag1 === 0) {
          switch (data[i].state) {
            case "AVAILABLE":
              if (sysTime < data[i].startAt)
                status = {
                  signin: "未签到",
                  signout: "未到签到时间",
                  signinClass: "unsinged",
                  signoutClass: "unsinged"
                };
              else if (sysTime >= data[i].startAt && sysTime <= data[i].startAt + 300000)//开始后5分钟内可以签到
                status = {
                  signin: "未签到",
                  signout: "请及时前往签到",
                  signinClass: "unsinged",
                  signoutClass: "singed"
                };
              else if (sysTime <= data[i].endAt && sysTime >= data[i].endAt - 300000)//结束前5分钟内可以签退
                status = {
                  signin: "已签到",
                  signout: "可以进行签退",
                  signinClass: "singed",
                  signoutClass: "singed"
                };
              break;
            case "NORMAL_SIGN_IN":
              status = {
                signin: "已签到",
                signout: "正在使用中",
                signinClass: "singed",
                signoutClass: "singed"
              };
              break;
            case "NORMAL_SIGN_OUT":
              status = {
                signin: "",
                signout: "已签退",
                signinClass: "unsinged",
                signoutClass: "unsinged"
              };
              break;
            case "UNSIGNIN_EXPIRED":
              apTimes.breach++;
              status = {
                signin: "未签到",
                signout: "未及时到达座位",
                signinClass: "breached",
                signoutClass: "breached"
              };
              break;
            case "CANCELED":
              status = {
                signin: "",
                signout: "已取消",
                signinClass: "unsinged",
                signoutClass: "unsinged"
              };
              break;
          }
          //将信息都push到totalAp里
          totalAp.push({
            startDate: start.getFullYear() + "/" + (start.getMonth() + 1) + "/" + start.getDate() + " " + start.getHours(),
            endDate: end.getFullYear() + "/" + (end.getMonth() + 1) + "/" + end.getDate() + " " + end.getHours(),
            roomName: data[i].seat.belongToRoomID.split("-")[0] + "教" + data[i].seat.belongToRoomID.split("-")[1],
            seatName: data[i].seat.seatName.substr(4),
            state: data[i].seat.stateComment,
            applyID: data[i].applyID,
            seatID: data[i].seat.seatID,
            stateComment: data[i].stateComment,
            status
          })
        }
        else {
          var refuse = "";
          switch (data[i].state) {
            case "WAITING":
              status = {
                signin: "待审批",
                signinClass: "unsinged"
              };
              break;
            case "ACCEPTED":
              status = {
                signin: "通过",
                signinClass: "singed"
              };
              break;
            case "REFUSED":
              refuse = data[i].reviewComment;
              status = {
                signin: "拒绝",
                signinClass: "breached"
              };
              break;
            case "CANCELED":
              status = {
                signin: "已取消",
                signinClass: "unsigned"
              };
              break;
          }
          //将信息都push到totalAp里
          totalAp.push({
            startDate: start.getFullYear() + "/" + (start.getMonth() + 1) + "/" + start.getDate() + " " + start.getHours(),
            endDate: end.getFullYear() + "/" + (end.getMonth() + 1) + "/" + end.getDate() + " " + end.getHours(),
            roomName: data[i].room.roomID.split("-")[0] + "教" + data[i].room.roomID.split("-")[1],
            reason: data[i].reason,
            num: data[i].useManCount,
            phone: data[i].applierPhone,
            state: data[i].room.stateComment,
            applyID: data[i].applyID,
            refuse: refuse,
            status
          })
        }
      }
      //去渲染
      Gender(totalAp, apTimes);
    },
    error: (err) => {
      $(".loadingToast").hide();
      errHandle(0, err, "预约", "reload")
    }
  });
}
function Gender(ap, apTimes) {
  //根据flag来确定渲染到哪一个content上
  let container = "", tpl = "";
  container = flag1 === 0 ? "#seat-content" : "#room-content";
  tpl = flag1 === 0 ? "seat-tpl" : "room-tpl";
  $(container).html(template(tpl, { ap }));
  $("#statistic").html(template(flag1 === 0 ? "statistic-tpl" : "statistic-tpl-room", apTimes));
  //点击查看预约详情
  $(".seat-info").on("click", function () {
    sessionStorage.removeItem("ap");
    sessionStorage.setItem("ap", JSON.stringify(ap[this.id]));
    window.location.href = flag1 === 0 ? "seatAppointInfo.html" : "roomAppointInfo.html";
  });
}
