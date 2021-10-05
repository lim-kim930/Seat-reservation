var video = document.createElement("video");
var canvasElement = document.getElementById("canvas");
var canvas = canvasElement.getContext("2d");
var loadingMessage = document.getElementById("loadingMessage");
var outputContainer = document.getElementById("output");
var outputMessage = document.getElementById("outputMessage");
var outputData = document.getElementById("outputData");
var info = {}
const dateUsed = location.search.substr(6);

function drawLine(begin, end, color) {
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = 4;//识别出边框宽度
    canvas.strokeStyle = color;
    canvas.stroke();
}

// Use facingMode: environment to attemt to get the front camera on phones
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function (stream) {
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    video.play();
    requestAnimationFrame(tick);
});

function tick() {
    loadingMessage.innerText = "⌛ 加载画面中..."
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        loadingMessage.hidden = true;
        canvasElement.hidden = false;
        outputContainer.hidden = false;
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
        // 识别到以后
        if (code) {
            // 边框颜色
            drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
            drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
            drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
            drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
            outputMessage.hidden = true;
            outputData.parentElement.hidden = false;
            document.getElementById("success").play();
            setTimeout(() => {
                // alert(code.data);
                info.room = decodeURI(code.data.substring(31, 45))
                info.seat = code.data.substring(51, 53)
                console.log(info.room);
                if(info.room === ""||info.seat === ""){
                    $("#dialog-title").text("提示");
                    $(".weui-dialog__bd").eq(0).text('二维码错误,请检查后重试');
                    $('.weui-mask').show();
                    $(".weui-dialog").eq(0).show(300);
                }
                else {
                    $("#dialog-title").text("为你找到以下座位信息:");
                    $(".weui-dialog__bd").eq(0).html('<p style="font-size: 18px;">教室: ' + info.room + ' 座位: ' + info.seat + '号</p><p style="font-size: 18px;">请仔细核对,并点击确定提交预约</p>');
                    $('.weui-mask').show();
                    $(".weui-dialog").eq(0).show(300);
                }
            }, 500);
            return;
        } else {
            outputMessage.hidden = false;
            outputData.parentElement.hidden = true;
        }
    }
    requestAnimationFrame(tick);
}
function apsubmit() {
    $('.weui-mask').hide();
    $(".weui-dialog").eq(0).hide();
    $.ajax({
        type: 'get',
        url: 'https://seat.api.hduapp.com/set/act/scan',
        data: {
            roomName: info.room,
            dateUsed,
            setName: info.seat,
        },
        xhrFields: {
            withCredentials: true,
        },
        contentType: "application/x-www-form-urlencoded",
        // 请求成功以后函数被调用
        success: function (response) {
            sessionStorage.setItem("qrInfo", JSON.stringify({
                dateUsed,
                roomName: info.room,
                setName: info.seat,
                status: JSON.parse(response).status
            }))
            window.location.href = "qrSelect.html"
            // case 'successfully':
            //     $(".weui-dialog__bd").eq(1).html('<p id = "0"><i class="weui-icon-success weui-icon_msg"></i> 预约成功,请按时签到使用</p>');
            //     $(".weui-dialog").eq(1).show(300);
            //     break
            // case 'the person this position comes back':
            //     $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-success weui-icon_msg"></i> 欢迎回来,暂离结束</p>');
            //     $(".weui-dialog").eq(1).show(300);
            //     break
            // case 'you already applied':
            //     $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 你已经有已提交的预约,请勿重复申请</p>');
            // $(".weui-dialog").eq(1).show(300);
            //     break
            // case 'this position has person,please wait 15 min':
            //     $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 此座位已经有人，等待15分钟吧!</p>');
            //     $(".weui-dialog").eq(1).show(300);
            //     break
            // default:
            //     $(".weui-dialog__bd").eq(1).html('<p id = "1"><i class="weui-icon-warn weui-icon_msg"></i> 缺少参数,请核对后申请</p>');
            //     $(".weui-dialog").eq(1).show(300);
            //     break
        },
        error: function (xhr) {
            $('.weui-mask').show();
            $(".weui-dialog__bd").html('<p><i class="weui-icon-warn weui-icon_msg"></i> 发生错误，请稍候刷新再试，或联系管理员</p>');
            $(".weui-dialog").eq(1).show(300);
        }
    })
}
function cancel() {
    $('.weui-mask').hide();
    $(".weui-dialog").hide();
    location.reload();
}
function redirect() {
    location.reload();
}