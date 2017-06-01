// tag.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputUserId: null
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
    this.setData({
      userId: this.data.inputUserId
    })
    try {
      wx.setStorageSync('clashroyale.userId', this.data.userId)
    } catch (e) {
    }
    wx.navigateBack({
      delta: 1
    })
  }
})
