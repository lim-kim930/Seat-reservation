$('.notice').on('click', function () {
    if (this.id == 2) {
        localStorage.removeItem('ap')
        localStorage.setItem('ap', JSON.stringify({
            "room": "10教121",
            "seat": "6",
            "startDate": "2021年03月05日",
            "startTime": "18",
            "endDate": "2021年03月05日",
            "endTime": "21",
            "status": { signin: '已签到', signout: '可以签退'}
        }))
    }
    else if (this.id == 1) {
        localStorage.removeItem('ap')
        localStorage.setItem('ap', JSON.stringify({
            "room": "10教121",
            "seat": "19",
            "startDate": "2021年03月10日",
            "startTime": "14",
            "endDate": "2021年03月10日",
            "endTime": "20",
            "status": { signin: '可以签到', signout: '未到签退时间'}
        }))
    }

    window.location.href = "../appointInfo/";
})