var video = document.createElement("video");
var canvasElement = document.getElementById("canvas");
var canvas = canvasElement.getContext("2d");
var loadingMessage = document.getElementById("loadingMessage");
var outputContainer = document.getElementById("output");
var outputMessage = document.getElementById("outputMessage");
var outputData = document.getElementById("outputData");
var info = {}

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
                info.room = code.data.substring(6, 12)
                info.seat = code.data.substring(18, 20)
                $('.modal-body').html(template('info-tpl', {room: info.room, seat: info.seat}));
                $('#tipModal').modal('show')
            }, 500);
            return;
        } else {
            outputMessage.hidden = false;
            outputData.parentElement.hidden = true;
        }
    }
    requestAnimationFrame(tick);
}
console.log(location.search.substr(6).split('=').toString());
function apsubmit() {
    $.ajax({
        // 请求方式
        type: 'post',
        // 请求地址
        url: 'http://api.ml.limkim.xyz:3000/set/scan',
        data: JSON.stringify({
            roomname: info.room,
            set: info.seat,
            length: location.search.substr(1).split('='),
        }),
        contentType: 'application/json',
        // 请求成功以后函数被调用
        success: function (response) {
            // sessionStorage.setItem('room', room)
            // sessionStorage.setItem('dura', dura)
            // console.log(dura);
            // console.log(room);
            // response为服务器端返回的数据
            // 方法内部会自动将json字符串转换为json对象
            console.log(response);
            // window.location.href = "../seatSelect?emptyseat=" + response;
        }
    })

}