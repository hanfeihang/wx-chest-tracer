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
    clanName: null,
    level: "",
    statsHtml: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
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

    this.refreshProfileV2()
    this.loadProfileV2()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow')
    var value = wx.getStorageSync('clashroyale.userId')
    if (value != this.data.userId) {
      this.onLoad()
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
    this.loadProfileV2();
    wx.stopPullDownRefresh();
  },

  clearData: function () {
    this.setData({
      username: "",
      userId: "",
      timeLastUpdate: "",
      level: "",
      clanName: null,
      chests: [],
    })
  },

  loadProfileV2: function () {
    if (this.data.userId == null || this.data.userId.trim() == "") {
      this.setData({
        buttonName: ""
      })
      return;
    }
    this.setData({
      buttonName: 'Loading'
    })

    wx.cloud.callFunction({
      name: 'load_profile',
      data: {
        tag: this.data.userId
      },
    }).then(res => {
      console.log('load_profile done')
      this.setData(res.result.data)
      this.setData({
        buttonName: res.result.request_status
      })
      if (res.result.request_status == 'Ready') {
        this.saveToHistoryTags()
        try {
          wx.setStorageSync('clashroyale.clanId', res.result.data.clanId)
        } catch (e) {}
      }
    }).catch(err => {
      console.log('load_profile err:', err)
    })
  },

  refreshProfileV2: function () {
    if (this.data.userId == null || this.data.userId.trim() == "") {
      return
    }
    wx.cloud.callFunction({
      name: 'refresh_profile',
      data: {
        tag: this.data.userId
      },
    }).then(res => {
      console.log('refresh_profile done')
    }).catch(err => {
      console.log('load_profile err:', err)
    })
  },

  loadHistoryTags: function () {
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'get_tags_by_user'
    }).then(res => {
      console.log('loadHistoryTags done')
      if (res && res.result) {
        try {
          wx.setStorageSync('clashroyale.historyTags', res.result.tags)
        } catch (e) {}
      }
    }).catch(err => {
      console.log('get_tags_by_user err:', err)
    })
  },

  saveToHistoryTags: function () {
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'add_tag',
      data: {
        tag: this.data.userId
      }
    }).then(res => {
      console.log('add_tag res done')
      this.loadHistoryTags()
    }).catch(err => {
      console.log('get_tags_by_user err:', err)
    })
  },

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