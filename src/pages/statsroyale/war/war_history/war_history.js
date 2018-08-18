// pages/statsroyale/war/war_history/war_history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clanId: "",
    historyWars: [],
    html: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    try {
      var clanId = wx.getStorageSync('clashroyale.clanId');
      that.setData({
        clanId: clanId
      })
    } catch (e) {
      // Do something when catch error
    }
    that.loadHtml()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  loadHtml: function () {
    var that = this;
    var clanId = this.data.clanId
    if (clanId.startsWith('#')) {
      clanId = clanId.substring(1)
    }
    wx.request({
      url: 'https://statsroyale.com/clan/' + clanId + '/war/history',
      data: {
      },
      header: {
        //'content-type': 'application/json'
      },
      success: function (res) {
        console.log("success" + res);
        var html = res.data
        that.setData({
          html: html
        })
        that.showWarHistory();
      },
      fail: function (res) {
        console.log("fail" + res);
      },
      complete: function (res) {
        console.log("complete" + res);
      }
    })
  },

  showWarHistory: function () {
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
        notBattleUsers: [],
        open: false
      }
      i++;

      var r2;
      var reg2 = /<div class="clanParticipants__rowContainer".*?data-battles="(.*?)"[\s\S]*?<a class="ui__blueLink".*?">(.*?)<\/a>/gm;
      while (r2 = reg2.exec(tmpHtml)) {
        var battleNum = r2[1].trim();
        var name = r2[2].trim();
        if (battleNum === "0") {
          historyOneWar.notBattleUsers.push({
            name: name,
            battleNum: battleNum
          })
        }
      }
      if (historyOneWar.notBattleUsers.length === 0) {
        historyOneWar.notBattleUsers.push({
          name: "[本次战斗日全员参与]",
          battleNum: 0
        })
      }

      historyWars.push(historyOneWar)
    }
    this.setData({ historyWars: historyWars });
  },

  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.historyWars;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      historyWars: list
    });
  }
})