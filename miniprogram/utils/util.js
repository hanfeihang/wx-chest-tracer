function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

//1s后执行funcInInterval，并循环seconds次，最终执行funcAfterAll
function schedule(seconds, funcInInterval, funcAfterAll) {
  var index = 0;
  var Intertimer = setInterval(function () {
    //这个函数是先延迟，后执行
    index++;
    console.log("倒计时:" + index)
    funcInInterval()
    //判断index是否达到集合最后一个
    if (index >= seconds) {
      //如果达到了，就清除定时器，停止循环
      clearInterval(Intertimer);
    }
  }, 1000);
  setTimeout(funcAfterAll, seconds * 1000)
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function refreshWar(clanId) {
  wx.request({
    url: 'https://statsroyale.com/clan/' + clanId + '/refresh',
    data: {
    },
    header: {
      //'content-type': 'application/json'
    },
    success: function (res) {
      console.log("refreshWar success");
    },
    fail: function (res) {
      console.log("refreshWar fail");
    },
    complete: function (res) {
      // success -> complete
      console.log("refreshWar complete");
    }
  })
}

module.exports = {
  formatTime: formatTime,
  schedule: schedule,
  refreshWar: refreshWar
}
