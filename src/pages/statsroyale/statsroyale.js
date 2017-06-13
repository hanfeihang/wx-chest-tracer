var util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    chests: [],
    buttonName: 'Loading',
    userId: "",
    timeLastUpdate: "",
    username: "",
    secondsToUpdate: 0,
    clan: "",
    level: "",
    statsHtml: null
  },

  clearData: function () {
    this.setData({
      username: "",
      userId: "",
      timeLastUpdate: "",
      level: "",
      clan: ""
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.clearData()
    var that = this
    try {
      var value = wx.getStorageSync('clashroyale.userId');
      console.log("onLoad:" + value)
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
      console.log("onShow:" + value)
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
    console.log("onPullDownRefresh");
    this.loadProfile();
    wx.stopPullDownRefresh();
  },

  loadProfile: function () {
    if (this.data.userId == null || this.data.userId.trim() == "") {
      this.setData({
        buttonName: "Invalid UserId"
      })
      return;
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
          that.showLevel()
          that.showClan()
          that.saveToHistoryTags(that.data.userId)
        }
      },
      fail: function (res) {
        console.log(res);
        that.setData({
          buttonName: 'Connection Error'
        })
      },
      complete: function (res) {
        // success -> complete
        console.log("complete");
        if (res.statusCode > 300) {
          that.setData({
            buttonName: 'Server Error'
          })
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
  showLevel: function () {
    var html = this.data.statsHtml
    var reg = /<span class="statistics__userLevel">(.*?)<\/span>\n/gm;
    var r = reg.exec(html)
    var lvl = r[1].trim()
    this.setData({ level: lvl })
  },

  showClan: function () {
    var html = this.data.statsHtml
    var reg = /<img src='\/images\/badges\/.*?png' class="statistics__smallClanBadge" \/>\n(.*?)\n/gm;
    var r = reg.exec(html)
    var clan = r[1].trim()
    this.setData({ clan: clan })
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
    this.setData({
      secondsToUpdate: -9
    })
    var that = this
    wx.request({
      url: 'https://statsroyale.com/profile/' + this.data.userId + '/refresh',
      data: {
      },
      header: {
        //'content-type': 'application/json'
      },
      success: function (res) {
        var delay;
        if (res.data.success == true) {
          wx.showToast({
            title: res.data.message,
            icon: res.data.success,
            duration: 1000
          })
          that.setData({
            buttonName: "Loading"
          })
          delay = res.data.secondsToUpdate
        } else if (res.data.success == false) {
          wx.showModal({
            content: res.data.message,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                //console.log('用户点击确定')
              }
              that.setData({
                secondsToUpdate: 0
              })
            }
          });
          return
        } else {
          return
        }
        var idx = delay;
        if (idx >= 5) {
          idx = 5;
        }
        util.schedule(idx, function () {
          idx--;
          that.setData({
            secondsToUpdate: idx
          })
        }, function () {
          that.loadProfile()
          console.log("after all")
        })
      },
      fail: function (res) {
        console.log(res);
        wx.showModal({
          content: "Connection Error",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              //console.log('用户点击确定')
            }
            that.setData({
              secondsToUpdate: 0
            })
          }
        });
        return
      },
      complete: function (res) {
        // success -> complete
        console.log('refreshProfile complete')
        if (res.statusCode > 300) {
          wx.showModal({
            content: "Server Error",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                //console.log('用户点击确定')
              }
              that.setData({
                secondsToUpdate: 0
              })
            }
          });
        }
        console.log('refreshProfile test')
      }
    })
  }
})
