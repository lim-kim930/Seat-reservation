var testFlag1 = 0;
var testFlag2 = 0;
$('#using-pn').on('change', numberCheck)
$('#using-reason').on('change', reasonCheck)
$('.room-start').on('click', function () {
    numberCheck();
    reasonCheck();
})
function numberCheck() {
    var regu = /^([0-9]{1,2}|100)$/;
    if (regu.test($('#using-pn').val()) && $('#using-pn').val() > 0) {
        testFlag1 = 1;
        $('.input-warnning').first().hide();
    }
    else {
        $('.input-warnning').first().show();
        $('#using-pn').val('')
        testFlag1 = 0;
    }
}
function reasonCheck() {
    if ($('#using-reason').val().trim() != '') {
        testFlag2 = 1;
        $('.input-warnning').eq(1).hide();
    }
    else {
        $('.input-warnning').eq(1).show();
        $('#using-reason').val('');
        testFlag2 = 0;
    }
}
$('#room-option').on('change', function () {
    qOptionChange(JSON.parse(sessionStorage.getItem('emptyroom')));
});
$('.room-start').on('click', function () {
    if (testFlag1 == 1 && testFlag2 == 1){
        dbCheck(2);
    }
});
// if()
function choosen(e) {
    if (e.dataset.flag == 0) {
        e.style.backgroundColor = 'rgb(120, 202, 132)'
        e.dataset.flag = 1
    }
    else {
        e.style.backgroundColor = '#dff0d8'
        e.dataset.flag = 0
    }
    console.log(e.id);
}