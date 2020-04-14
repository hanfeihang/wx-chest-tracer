var util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    chests: [],
    upcomingShopOffers: [],
    buttonName: 'Loading',
    userId: "",
    timeLastUpdate: "",
    username: "",
    secondsToUpdate: 0,
    clanName: "",
    level: "",
    statsHtml: null
  },

  clearData: function () {
    this.setData({
      username: "",
      userId: "",
      timeLastUpdate: "",
      level: "",
      clanName: ""
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
      that.setData({
        userId: value
      })
    } catch (e) {
      // Do something when catch error
    }

    this.loadProfile()
    console.log('here3')
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
        buttonName: ""
      })
      return;
    }

    this.setData({
      buttonName: 'Loading'
    })

    var that = this;
    wx.request({
      url: 'https://statsroyale.com/profile/' + this.data.userId,
      data: {
      },
      header: {
        //'content-type': 'application/json'
      },
      success: function (res) {
        var html = res.data
        var x = html.indexOf("Profile is currently missing")
        if (x > 0) {
          that.setData({
            buttonName: '档案缺失，请点击绿色感叹号刷新'
          })
          return;
        }
        x = html.indexOf("Invalid Hashtag Provided")
        if (x > 0) {
          that.setData({
            buttonName: 'TAG含有非法字符'
          })
        } else {
          that.setData({
            statsHtml: html,
            buttonName: 'Ready'
          })
          that.showUpcomingChests();
          that.showUpcomingShopOffers();
          that.showTimeLastUpdate();
          that.showUsername();
          that.showLevel();
          that.showClan();
          that.saveToHistoryTags(that.data.userId);
        }
      },
      fail: function (res) {
        that.setData({
          buttonName: 'Connection Error'
        })
      },
      complete: function (res) {
        // success -> complete
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

  showUpcomingChests: function () {
    var html = this.data.statsHtml;
    var reg = /<span class="chests__counter">(.*?)<\/span>\n.*?chests__tooltip">\n(.*?)\n/gm;
    var r;
    var chestdata = [];

    while (r = reg.exec(html)) {
      var chestNum = r[1].trim();
      if (r[2].trim().split(':').length == 2) {
        var chestType = r[2].split(':')[1].trim();
      } else {
        var chestType = r[2].trim();
      }
      chestdata.push({ chestNum: chestNum, chestType: chestType.replace(new RegExp(/ /g), '') })
    }
    this.setData({ chests: chestdata })
  },

  showUpcomingShopOffers: function () {
    var html = this.data.statsHtml

    var reg = /<div class="offers__name">(.*?)<\/div>\n.*?<div>(.*?)<\/div>/gm;
    var r;
    var shopOffers = []
    while (r = reg.exec(html)) {
      shopOffers.push({
        offerName: r[1].trim(),
        offerPngName: r[1].trim().toLowerCase().replace(' ', '-') + '-offer',
        offerTime: r[2].trim()
      })
    }
    this.setData({ upcomingShopOffers: shopOffers })
  },

  showTimeLastUpdate: function () {
    var html = this.data.statsHtml
    var reg = /<div class="refresh__time">\n(.*?)<\/div>\n/gm;
    var r = reg.exec(html)
    var timeLastUpdate = r[1].trim()
    this.setData({
      timeLastUpdate: timeLastUpdate
    })
  },

  showUsername: function () {
    try {
      var html = this.data.statsHtml
      var reg = /<span class="profileHeader__nameCaption">\n(.*?)<\/span/gm;
      var r = reg.exec(html)
      var username = r[1].trim()
      this.setData({
        username: username
      })
    } catch (err) {

    }
    try {
      wx.setStorageSync('clashroyale.userName', this.data.username)
    } catch (e) {
    }
  },

  showLevel: function () {
    var html = this.data.statsHtml
    var reg = /<span class="profileHeader__userLevel">(.*?)<\/span>\n/gm;
    var r = reg.exec(html)
    var lvl = r[1].trim()
    this.setData({ level: lvl })
  },

  showClan: function () {
    try {
      var html = this.data.statsHtml
      var reg = /clan\/(.*?)" class="ui__link ui__mediumText ui__whiteText profileHeader__userClan"/gm;
      var r = reg.exec(html)
      var clanId = r[1].trim()
      var reg2 = /class="profileHeader__clanBadge" \/>\n(.*?)\n/gm;
      var r2 = reg2.exec(html)
      var clanName = r2[1].trim()
      this.setData({
        clanName: clanName
      })
    } catch (e) {
      console.log('no clan information' + e)
    }
    try {
      wx.setStorageSync('clashroyale.clanId', clanId)
    } catch (e) {
    }
    // 当解析到clanId时，异步去刷新clan信息
    util.refreshWar(clanId)
  },

  refreshProfile: function () {
    // 防止二次点击
    if (this.data.secondsToUpdate != 0) {
      return
    }
    this.setData({
      secondsToUpdate: -9 // 防止二次刷新
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
        console.log("refreshProfile success")
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
          console.log("倒计时后，刷新信息完成")
        })
      },
      fail: function (res) {
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
      }
    })
  },

  /**
   * 页面图片点击预览操作
   */
  previewImage: function (e) {
    wx.previewImage({
      current: "",
      urls: ["cloud://prod-xu410.7072-prod-xu410-1301673313/thanks_code.jpg"],
      fail: function () {
        //console.log("not found")
      },
      complete: function () {
        //console.info("点击图片了!")
      }
    })
  },
})
