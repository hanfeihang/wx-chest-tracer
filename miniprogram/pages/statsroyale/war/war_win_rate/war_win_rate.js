// pages/statsroyale/war/war_win_rate/war_win_rate.js
Page({
  mixins: [require('../../../../themeChanged')],
  /**
   * 页面的初始数据
   */
  data: {
    historyWars: [],
    userWinRateMap: {},
    userWinRateMap2List: [],
    userName: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    try {
      var clanId = wx.getStorageSync('clashroyale.clanId');
      that.setData({
        clanId: clanId
      })
    } catch (e) {
      // Do something when catch error
    }
    try {
      var value2 = wx.getStorageSync('clashroyale.userName')
      if (value2) {
        this.setData({
          userName: value2
        })
      }
    } catch (e) {
      // Do something when catch error
    }
    that.loadHtml()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  loadHtml: function() {
    var that = this;
    var clanId = this.data.clanId
    if (clanId.startsWith('#')) {
      clanId = clanId.substring(1)
    }
    wx.request({
      url: 'https://statsroyale.com/clan/' + clanId + '/war/history',
      data: {},
      header: {
        //'content-type': 'application/json'
      },
      success: function(res) {
        console.log("success" + res);
        var html = res.data
        that.setData({
          html: html
        })
        that.showWarHistory();
      },
      fail: function(res) {
        console.log("fail" + res);
      },
      complete: function(res) {
        console.log("complete" + res);
      }
    })
  },

  showWarHistory: function() {
    var html = this.data.html
    var reg = /<div class="clanWarHistory__season">.*[\s\S]*?<div class="ui__headerSmall clanWarHistory__leaderboard">(.*?)<\/div>\n.*?<div class="ui__mediumText clanWarHistory__createdTime">(.*?)<\/div>([\s\S]*?)(^\s*?<\/div>\n){5}/gm;
    var r;
    var historyWars = [];
    var i = 0;
    var historyOneWar = [];
    while (r = reg.exec(html)) {
      var tmpHtml = r[3];
      historyOneWar = {
        id: i,
        season: r[1].trim(),
        time: r[2].trim(),
        battleUsers: [],
        open: false
      }
      i++;

      var r2;
      var reg2 = /<div class="clanParticipants__rowContainer".*?data-wins="(.*?)".*?data-battles="(.*?)"[\s\S]*?<a class="ui__blueLink".*?">(.*?)<\/a>/gm;
      while (r2 = reg2.exec(tmpHtml)) {
        var winNum = r2[1].trim();
        var battleNum = r2[2].trim();
        var name = r2[3].trim();
        historyOneWar.battleUsers.push({
          name: name,
          battleNum: battleNum,
          winNum: winNum
        })
      }

      historyWars.push(historyOneWar)
    }
    this.setData({
      historyWars: historyWars
    });
    this.showWinRate();
  },

  showWinRate: function() {
    var historyWars = this.data.historyWars;
    if (historyWars == null) {
      return;
    }
    for (var i = 0; i < historyWars.length; i++) {
      var oneWar = historyWars[i];
      var battleUsers = oneWar.battleUsers;
      for (var j = 0; j < battleUsers.length; j++) {
        var battleUser = battleUsers[j];
        if (this.data.userWinRateMap[battleUser.name] == null) {
          this.data.userWinRateMap[battleUser.name] = {
            battleNum: Number(battleUser.battleNum),
            winNum: Number(battleUser.winNum)
          }
        } else {
          var winData = this.data.userWinRateMap[battleUser.name];
          try {
            winData['battleNum'] = Number(winData['battleNum']) + Number(battleUser.battleNum);
            winData['winNum'] = Number(winData['winNum']) + Number(battleUser.winNum);
            this.data.userWinRateMap[battleUser.name] = winData;
          } catch (e) {
            console.log("i" + i + "j" + j, e)
          }
        }
      }
    }
    this.sortByRate();
  },

  sortByRate: function() {
    var userWinRateMap = this.data.userWinRateMap;
    var tempList = [];
    for (var name in userWinRateMap) {
      var winData = userWinRateMap[name];
      tempList.push({
        name: name,
        battleNum: winData['battleNum'],
        winNum: winData['winNum'],
        rate: this.percentNum(winData['winNum'], winData['battleNum'])
      })
    }
    tempList = tempList.sort(
      function(a, b) {
        if (Number(a.rate) > Number(b.rate)) {
          return -1;
        } else if (Number(a.rate) < Number(b.rate)) {
          return 1;
        } else {
          if (a.battleNum > b.battleNum) {
            return -1;
          } else if (a.battleNum < b.battleNum) {
            return 1;
          } else {
            return 0;
          }
        }
      }
    );
    var userWinRateMap2List = [];
    var userName = this.data.userName;
    for (var i = 0; i < tempList.length; i++) {
      var temp = tempList[i]
      userWinRateMap2List.push({
        rank: i + 1,
        name: temp['name'],
        battleNum: temp['battleNum'],
        winNum: temp['winNum'],
        rate: temp['rate'],
        isMyself: temp['name'] === userName
      })
    }
    this.setData({
      userWinRateMap2List: userWinRateMap2List
    })
  },

  percentNum: function(num, num2) {
    if (num2 === 0) {
      return 0;
    }
    return (Math.round(num / num2 * 10000) / 100).toFixed(0);
  }
})