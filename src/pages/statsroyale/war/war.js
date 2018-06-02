// pages/statsroyale/war/war.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    clanId: "",
    warType: "",
    warMembers: [],
    warClans: [],
    timeLeft: "",
    html: ""
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
    this.loadHtml()
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
    console.log("onPullDownRefresh");
    this.loadHtml();
    wx.stopPullDownRefresh();
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

  showWarClans: function () {
    var html = this.data.html
    var reg = /<div class="clanWar__row">#(.*?)<\/div>\n.*?\n.*?\n.*?ui__blueLink">(.*?)<\/a>\n.*?\n.*?\n.*?\n.*?clanWar__battle">(.*?)<\/div>\n.*?\n.*?\n.*?\n.*?clanWar__wins">(.*?)<\/div>\n.*?\n.*?\n.*?\n.*?clanWar__crowns">(.*?)<\/div>\n.*?\n.*?\n.*?\n.*?clanWar__trophies">(.*?)<\/div>/gm;
    var r;
    var warClans = [];
    while (r = reg.exec(html)) {
      warClans.push({
        rank: r[1].trim(),
        name: this.htmlDecodeByRegExp(r[2].trim()),
        battles: r[3].trim(),
        wins: r[4].trim(),
        crowns: r[5].trim(),
        trophies: r[6].trim()
      })
    }
    this.setData({ warClans: warClans })
  },

  showWarMembers: function () {
    var html = this.data.html
    var reg = /<div class="clanParticipants__row">#(.*?)<\/div>\n.*?\n.*?ui__blueLink".*?>(.*?)<\/a>\n.*?\n.*?<\/div>(.*?)<\/div>\n.*?<\/div>(.*?)<\/div>\n.*?<\/div>(.*?)<\/div>/gm;
    var r;
    var warMembers = [];
    while (r = reg.exec(html)) {
      warMembers.push({
        rank: r[1].trim(),
        name: this.htmlDecodeByRegExp(r[2].trim()),
        battle: r[3].trim(),
        wins: r[4].trim(),
        cards: r[5].trim()
      })
    }
    this.setData({ warMembers: warMembers })
  },

  showTimeLeft: function () {
    var html = this.data.html
    var reg = /<div class="ui__mediumText clan__warRemainingTime">\n.*?\n(.*?)\n/gm;
    var r = reg.exec(html)
    try {
      var timeLeft = r[1].replace(new RegExp(/•/g), '').trim()
      this.setData({ timeLeft: timeLeft })
    } catch (e) {
      console.log('部落战剩余时间解析错误')
    }
  },

  showWarType: function () {
    var html = this.data.html
    var reg = /<div class="ui__headerSmall clan__warState">(.*?)<\/div>/gm;
    var r = reg.exec(html)
    var warType
    try {
      warType = r[1].trim()
      switch (warType) {
        case 'Collection Day':
          warType = '集卡日'
          break;
        case 'War Day':
          warType = '战斗日'
          break;
        default:
          warType = '未开启'
      }
    } catch (e) {
      console.log('无部落战')
      warType = '未开启'
    }
    this.setData({ warType: warType })
  },

  loadHtml: function () {
    var that = this;
    var clanId = this.data.clanId
    if (clanId.startsWith('#')) {
      clanId = clanId.substring(1)
    }
    wx.request({
      url: 'https://statsroyale.com/clan/' + clanId + '/war',
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
        that.showWarType();
        that.showWarMembers();
        that.showTimeLeft();
        that.showWarClans();
      },
      fail: function (res) {
        console.log("fail" + res);
      },
      complete: function (res) {
        console.log("complete" + res);
      }
    })
  },

  /*2.用正则表达式实现html解码*/
  htmlDecodeByRegExp: function (str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#039;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    return s;

  }
})