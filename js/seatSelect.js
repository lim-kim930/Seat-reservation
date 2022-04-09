const info = location.search.substr(6).split("&");//通过url获得刚刚选择的教室和时间信息
const roomName = decodeURI(info[0]);//教室
let dateUsed = info[2].split("=")[1];//时间
const dateUsedParts=dateUsed.split("-")
if(dateUsedParts[1].length===1){
    dateUsedParts[1]='0'+dateUsedParts[1]
    dateUsed=dateUsedParts.join("-")
}
console.log('date used:',dateUsed)
const capacity = Number(info[1].split("=")[1]);//容量
const systime = getSysTime().Systime3;
var target = "";//选中的目标
var seatID = "";//选中的seatID
const totalSeat = [];//全部的座位,以上三个为渲染或提交时使用
//渲染已选信息
$("#room-info-container").html(template("room-info-tpl", { dateUsed, roomName }));
//循环容量,生成座位id
$(function () {
    $.ajax({
        type: "get",
        url: "https://seat.api.hduapp.com/seat/listByRoomID",
        xhrFields: {
            withCredentials: true,
        },
        // headers: { staffID: 19270808 },
        data: {
            roomID: roomName.split("教")[0] + "-" + roomName.split("教")[1]
        },
        success: (response) => {
            if (roomName === "10教118" || roomName === "10教121") {
                for (var i = 0; i < response.data.length; i++)
                    totalSeat.push({
                        name: i + 1,
                        value: (roomName === "10教118" ? "10-118-seat" : "10-121-seat") + (i + 1)
                    });
            }
            else
                for (var i = 0; i < response.data.length; i++) {
                    totalSeat.push({
                        name: response.data[i].seatName.substr(4),
                        value: response.data[i].seatID
                    });
                }
            //渲染座位和其id
            $("#seats").html(template("seat-tpl", { totalSeat }));
            flex();
            //点击座位按钮
            $('#seats button').on("click", function (event) {
                $('.input-warnning').hide();//隐藏"请选择"提示 
                //先移除上一个选中按钮的选中样式
                if (target !== "")
                    target.classList.remove("choosen")
                target = event.target;//更新为现在选中的按钮
                target.classList.add("choosen")//然后添加选中样式seatID
                seatID = target.dataset.value;//更新为现在选中的按钮的ID,下面提交使用
                $("#seat-info-container").html(template("seat-info-tpl", { name: $(target).text() }));//渲染当前选择座位
                var tOption = [];//时间选择列表
                var startTime = "";//时间选择项的开始时间(小时)
                if (+dateUsed.split("-")[2] === +systime.Date) {//如果是当天
                    if (Number(systime.time.split(":")[0]) < 7)//如果是7点之前,直接从8点开始,否则就加1
                        startTime = 8;
                    else
                        startTime = Number(systime.time.split(":")[0]) + 1;
                }
                else//如果不是当天,直接从8点开始
                    startTime = 8;
                //从开始时间到20遍历
                for (startTime; startTime <= 20; startTime++)
                    // if (status.indexOf(String(startTime)) === -1)
                    tOption.push(startTime);
                var data = [];
                for (var i = 0; i < tOption.length; i++)
                    data.push({ value: tOption[i], text: tOption[i] + ":00" })
                $('#time-option').html(template('time-tpl', { tOption: data }));
                //要是有选项再渲染时长的
                if (data.length !== 0)
                    timeOpChange();
                // $.ajax({
                //     type: 'get',
                //     url: 'https://seat.api.hduapp.com/set/choose/lookuproomdetail',
                //     data: {
                //         dateUsed,
                //         roomName,
                //         setName,
                //     },
                //     xhrFields: {
                //         withCredentials: true,
                //     },
                //     contentType: "application/x-www-form-urlencoded",
                //     success: function (response) {
                //         const status = JSON.parse(response).status;
                //         $("#seat-info-container").html(template("seat-info-tpl", { setName: setName }));
                //         if (status.length == 0)
                //             $("#dura").html(" 无");
                //         else
                //             $("#dura").html(template("disable-tpl", status));
                //         
                //     },
                //     error: (err) => {
                //         errHandle(1, err, "座位", "reload")
                //     }
                // })
            });
        },
        error: (err) => {
            errHandle(1, err, null, "reload")
        }
    });
})
function flex() {
    if (roomName !== "10教118" && roomName !== "10教121") {
        $("#seats button").css("position", "static");
        return;
    }
    const width = Number($("#seat-container").css("width").split("px")[0]);
    if (roomName === "10教121") {
        const left1 = (width - 145) / 2;
        const left2 = (width - 95) / 2;
        $(".room_border").css({ "width": "165px", "height": "120px", "left": left1 - 10 + "px", "top": "15px" }).show()
        $($(".door")[0]).css({ "top": "102px", "left": 10 + "px" })
        $($(".door")[1]).css({ "top": "102px", "right": 10 + "px" })
        for (var i = 0; i < $("#seats button").length; i++) {
            if (i >= 0 && i <= 5)
                $($("#seats button")[i]).css("left", left1 + i * 25 + "px")
            else if (i >= 6 && i <= 9)
                $($("#seats button")[i]).css({ "left": left2 + (i - 6) * 25 + "px", "top": "60px" })
            else if (i >= 10 && i <= 13)
                $($("#seats button")[i]).css({ "left": left2 + (i - 10) * 25 + "px", "top": "85px" })
        }
    }
    else {
        const left1 = (width - 140) / 2;
        $("#seat-container").css("height", "300px");
        $(".room_border").css({ "width": "165px", "height": "280px", "left": left1 - 10 + "px", "top": "15px" }).show()
        $($(".door")[0]).css({ "top": "115px", "left": -15 + "px" })
        $($(".door")[1]).css({ "top": "245px", "left": -15 + "px" })
        for (var i = 0; i < $("#seats button").length; i++) {
            if (i <= 13) {
                if (i % 2 === 0)
                    $($("#seats button")[i]).css("left", left1 + "px")
                else
                    $($("#seats button")[i]).css("left", left1 + 25 + "px")
            }
            else if (i <= 29) {
                if (i % 2 === 0)
                    $($("#seats button")[i]).css("right", left1 + 25 + "px")
                else
                    $($("#seats button")[i]).css("right", left1 + "px")
            }
            switch (i) {
                case 12:
                case 13:
                case 14:
                case 15:
                    $($("#seats button")[i]).css("top", "20px")
                    break
                case 10:
                case 11:
                case 16:
                case 17:
                    $($("#seats button")[i]).css("top", "45px")
                    break
                case 8:
                case 9:
                case 18:
                case 19:
                    $($("#seats button")[i]).css("top", "85px")
                    break
                case 6:
                case 7:
                case 20:
                case 21:
                    $($("#seats button")[i]).css("top", "110px")
                    break
                case 4:
                case 5:
                case 22:
                case 23:
                    $($("#seats button")[i]).css("top", "150px")
                    break
                case 24:
                case 25:
                    $($("#seats button")[i]).css("top", "175px")
                    break
                case 2:
                case 3:
                case 26:
                case 27:
                    $($("#seats button")[i]).css("top", "215px")
                    break
                case 0:
                case 1:
                case 28:
                case 29:
                    $($("#seats button")[i]).css("top", "240px")
                    break
            }
        }
    }
}
//开始时间选项更改
$("#time-option").on("change", timeOpChange);
function timeOpChange() {
    //渲染显示
    var tOptions = "";
    const tOption = $("#time-option").find('option:selected').val();
    tOptions = tOption + ":00";
    $("#using-time").text(tOptions);
    //自动渲染一次时长
    duraOpChange();
}
// 使用时长选项改变渲染
function duraOpChange() {
    var dOption = [];
    for (var i = 1; i <= 21 - $('#time-option').find('option:selected').val(); i++)
        dOption.push({ value: i, text: i + "小时" });
    $('#duration-option').html(template('time-tpl', { tOption: dOption }));
    $('#using-duration').text($('#duration-option').find('option:selected').text());
}
//点击提交按钮
function seatStart() {
    //做输入判断
    if (seatID === '' || seatID === undefined)
        $('.input-warnning').eq(0).show();
    else if ($("#time-option").find('option:selected').val() === undefined)
        $("#using-time").text("请选择开始时间")
    else if ($("#duration-option").find('option:selected').val() === undefined)
        $("#using-duration").text("请选择使用时长")
    else {
        //弹框二次提示
        const text = '教室: ' + roomName + ' 座位: ' + seatID.split("seat")[1] + '号</p><p style="font-size: 18px;">请仔细核对,并点击确定提交预约'
        weiAlert(0, null, text, null)
    }
};
function submit() {
    //先隐藏掉弹框和背景
    $('.weui-mask').hide();
    $(".weui-dialog").hide();
    //设置开始与结束时间
    var sTime = +$('#time-option').find('option:selected').val();
    var eTime = sTime + +$("#duration-option").find('option:selected').val();
    //一位的要在前面补0
    sTime = sTime < 10 ? ("0" + sTime) : sTime;
    eTime = eTime < 10 ? ("0" + eTime) : eTime;
    $('.weui-mask').show();
    $(".loadingToast").show();
    $.ajax({
        type: "post",
        url: "https://seat.api.hduapp.com/seat/apply/apply",
        xhrFields: {
            withCredentials: true,
        },
        // headers: { staffID: 19270808 },

        data: JSON.stringify({
            "startAt": dateUsed + "T" + sTime + ":00:00.000+08:00",
            "endAt": dateUsed + "T" + eTime + ":00:00.000+08:00",
            "seatID": seatID
        }),
        contentType: "application/json",
        success: (response) => {
            if (response.msg === 'success')
                weiAlert(1, "success", "预约成功!", "redirect", sessionStorage.getItem('sr_Turned') !== null ? "index.html?turned=true#/myAp" : "index.html#/myAp");
        },
        error: (xhr) => {
            errHandle(1, xhr, null, "reload");
        }
    });
}
