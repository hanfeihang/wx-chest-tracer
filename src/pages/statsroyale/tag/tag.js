// tag.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputUserId: null,
    historyTags: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    try {
      var value = wx.getStorageSync('clashroyale.userId')
      if (value) {
        console.log(value)
        that.setData({
          inputUserId: value
        })
      }
    } catch (e) {
      // Do something when catch error
    }

    try {
      var value = wx.getStorageSync('clashroyale.historyTags')
      if (value) {
        console.log(value)
        that.setData({
          historyTags: value
        })
      }
    } catch (e) {
      // Do something when catch error
    }

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

  editUserId: function (e) {
    this.setData({ inputUserId: e.detail.value })
  },

  confirmUserId: function () {
    if (this.data.inputUserId === null || this.data.inputUserId === "") {
      wx.showModal({
        content: "请输入合法TAG",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            //console.log('用户点击确定')
          }
        }
      });
      return
    }
    this.setData({
      userId: this.data.inputUserId.toUpperCase()
    })
    try {
      wx.setStorageSync('clashroyale.userId', this.data.userId)
    } catch (e) {
    }
    wx.navigateBack({
      delta: 1
    })
  },

  bindPickerChange: function (e) {
    if (this.data.historyTags.length == 0) {
      return
    }
    var index = e.detail.value
    this.setData({
      inputUserId: this.data.historyTags[index]
    })
  },

  clearHistoryTags: function () {
    var empty = new Array()
    try {
      wx.setStorageSync('clashroyale.historyTags', empty)
    } catch (e) {
    }
    this.setData({
      historyTags: []
    })
  }
})
