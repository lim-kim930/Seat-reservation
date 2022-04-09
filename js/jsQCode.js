var video = document.createElement("video");
var canvasElement = document.getElementById("canvas");
var canvas = canvasElement.getContext("2d");
var loadingMessage = document.getElementById("loadingMessage");
var outputContainer = document.getElementById("output");
var outputMessage = document.getElementById("outputMessage");
var outputData = document.getElementById("outputData");
var info = {}
var seatID = ""
const dateUsed = location.search.substr(6);

function drawLine(begin, end, color) {
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = 4;//识别出边框宽度
    canvas.strokeStyle = color;
    canvas.stroke();
}

if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }
        return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
        });
    }
}
// Use facingMode: environment to attemt to get the front camera on phones
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function (stream) {
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    video.play();
    requestAnimationFrame(tick);
}).catch(function (err) {
    alert(err)
    $("#dialog-title").text("提示");
    $(".weui-dialog__bd").eq(1).text('当前浏览器不支持getUserMedia,请更换浏览器重试');
    $('.weui-mask').show();
    $(".weui-dialog").eq(1).show(200);
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
                info.room = JSON.parse(code.data).room
                info.seat = JSON.parse(code.data).seat
                seatID = info.room.split("教")[0] + "-" + info.room.split("教")[1] + "-seat" + info.seat;
                if (info.room && info.seat) {
                    $("#dialog-title").text("为你找到以下座位信息:");
                    $(".weui-dialog__bd").eq(0).html('<p style="font-size: 18px;">教室: ' + info.room + ' 座位: ' + info.seat + '号</p><p style="font-size: 18px;">请仔细核对,并点击确定提交预约</p>');
                    $('.weui-mask').show();
                    $(".weui-dialog").eq(0).show(200);
                }
                else {
                    $("#dialog-title").text("提示");
                    $(".weui-dialog__bd").eq(1).text('二维码错误,请检查后重试');
                    $('.weui-mask').show();
                    $(".weui-dialog").eq(1).show(200);
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

    sessionStorage.setItem("qrInfo", JSON.stringify({
        dateUsed,
        roomName: info.room,
        setName: info.seat,
        seatID: seatID
    }))
    window.location.href = "qrSelect.html"
}