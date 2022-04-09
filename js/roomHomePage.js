var testFlag1 = 0;
var testFlag2 = 0;
var testFlag3 = 0;
$('#using-pn').on('change', numberCheck);
$('#using-reason').on('change', reasonCheck);
$('#using-tel').on('change', telCheck);
function numberCheck() {
    var limit = Number($("#capacity").text().split("人")[0].substr(4));
    var regu = [];
    for (var i = 1; i <= limit; i++)
        regu.push(i)
    if ($.inArray(Number($('#using-pn').val()), regu) != -1) {
        testFlag1 = 1;
        $('.input-warnning').eq(0).hide();
    }
    else {
        $('.input-warnning').eq(0).show();
        $('#using-pn').val('');
        testFlag1 = 0;
    }
}
function reasonCheck() {
    if ($('#using-reason').val().trim() != '') {
        testFlag2 = 1;
        $('.input-warnning').eq(2).hide();
    }
    else {
        $('.input-warnning').eq(2).show();
        $('#using-reason').val('');
        testFlag2 = 0;
    }
}
function telCheck() {
    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    if (myreg.test($('#using-tel').val())) {
        testFlag3 = 1;
        $('.input-warnning').eq(1).hide();
    } else {
        $('.input-warnning').eq(1).show();
        $('#using-tel').val('');
        testFlag3 = 0;
    }
}
// function lengthCheck() {
//     var qoption = $('#quantum-option span')
//     var count = 0
//     for (var i = 0; i < qoption.length; i++) {
//         if (qoption[i].dataset.flag == 1) {
//             count++
//         }
//     }
//     if (count == 0) {
//         $('.input-warnning').first().show();
//         testFlag3 = 0;
//     } else {
//         $('.input-warnning').first().hide();
//         testFlag3 = 1;
//     }
// }
$('.room-start').on('click', function () {
    numberCheck();
    reasonCheck();
    // lengthCheck();
    telCheck();
    if (testFlag1 === 1 && testFlag2 === 1 && testFlag3 === 1) {
        $(".weui-dialog__bd").eq(0).html('<p style="font-size: 18px;">教室: ' + roomName + '</p><p style="font-size: 18px;">请仔细核对,并点击确定提交预约</p>');
        $('.weui-mask').show();
        $(".weui-dialog").eq(0).show(200);
    }
});
function choosen(e) {
    if (e.dataset.flag == 0) {
        e.style.backgroundColor = '#ff8126'
        e.dataset.flag = 1
    }
    else {
        e.style.backgroundColor = '#bef1aa'
        e.dataset.flag = 0
    }
}
