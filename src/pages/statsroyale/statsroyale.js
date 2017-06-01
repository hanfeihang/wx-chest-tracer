// statsroyale.js
//var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statsHtml: null,
    chests: [],
    buttonName: 'Loading',
    userId: null,
    inputUserId: null,
    timeLastUpdate: null,
    username: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    try {
      var value = wx.getStorageSync('clashroyale.userId')
      that.setData({
        userId: value
      })
    } catch (e) {
      // Do something when catch error
    }

    this.loadProfile()
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
    var that = this
    try {
      var value = wx.getStorageSync('clashroyale.userId')
      if (value != this.data.userId) {
        this.onLoad()
      }
    } catch (e) {
      // Do something when catch error
    }
    // 
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
    console.log('onPullDownRefresh')
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  loadProfile: function () {
    if (this.data.userId == null) {
      this.setData({
        buttonName: "please input userId"
      })
    }

    this.setData({
      buttonName: 'Loading'
    })

    var that = this;
    wx.request({
      url: 'https://statsroyale.com/profile/' + this.data.userId, //仅为示例，并非真实的接口地址
      data: {
      },
      header: {
        //'content-type': 'application/json'
      },
      success: function (res) {
        var html = res.data
        var x = html.indexOf("chests__queue")
        if (x == -1) {
          that.setData({
            buttonName: 'Invalid UserId'
          })
        } else {
          that.setData({
            statsHtml: html,
            buttonName: 'Ready'
          })
          that.showChestTracer()
          that.showTimeLastUpdate()
          that.showUsername()
          that.saveToHistoryTags(that.data.userId)
        }
      }
    })
  },

  saveToHistoryTags: function (tag) {
    if (tag) {
      var that = this
      var value = new Array()
      try {
        value = wx.getStorageSync('clashroyale.historyTags')
      } catch (e) {
        // Do something when catch error
      }
      if (value === "") {
        value = new Array()
        value.push(tag)
      } else {
        for (var i in value) {
          if (value[i] === tag) {
            return
          }
        }
        value.push(tag)
      }

      try {
        wx.setStorageSync('clashroyale.historyTags', value)
      } catch (e) {
        e.printStackTrace()
      }
    }
  },


  showChestTracer: function () {
    var html = this.data.statsHtml
    var x = html.indexOf("chests__queue")
    var y = html.indexOf("profile__replays")
    html = html.substring(x, y)

    var reg = /<span class="chests__counter">(.*?)<\/span>\n.*?chests__tooltip">\n(.*?)\n/gm;
    var r;
    var chestdata = []
    while (r = reg.exec(html)) {
      chestdata.push({ chestNum: r[1].trim(), chestType: r[2].trim().replace(' ', '') })
    }
    this.setData({ chests: chestdata })
  },

  showTimeLastUpdate: function () {
    var html = this.data.statsHtml
    var reg = /<div class="statistics__tip ui__smallText ui__greyText">\n(.*?)<\/div>\n/gm;
    var r = reg.exec(html)
    var timeLastUpdate = r[1].trim()
    this.setData({
      timeLastUpdate: timeLastUpdate
    })
  },

  showUsername: function () {
    var html = this.data.statsHtml
    var reg = /<div class="ui__headerMedium statistics__userName">\n(.*?)<span/gm;
    var r = reg.exec(html)
    var username = r[1].trim()
    this.setData({
      username: username
    })
  },

  refreshProfile: function () {
    var that = this
    wx.request({
      url: 'https://statsroyale.com/profile/' + this.data.userId + '/refresh',
      data: {
      },
      header: {
        //'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.success == true) {
          wx.showToast({
            title: res.data.message,
            icon: res.data.success,
            duration: 2000
          })
        } else {
          wx.showModal({
            content: res.data.message,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                //console.log('用户点击确定')
              }
            }
          });
        }
      }
    })
  }

})
