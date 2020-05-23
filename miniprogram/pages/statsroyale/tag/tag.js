Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputTag: null,
    historyTags: [],
    tagIndex: 0,
    showTagGuide: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var value = wx.getStorageSync('clashroyale.userId')
    if (value) {
      console.log(value)
      this.setData({
        inputTag: value
      })
    }

    var historyTags = wx.getStorageSync('clashroyale.historyTags')
    if (historyTags) {
      console.log('historyTags from cache', historyTags)
      this.setData({
        historyTags: historyTags,
      })
      for (var i = 0; i < historyTags.length; i++) {
        if (historyTags[i] == this.data.inputTag) {
          this.setData({
            tagIndex: i
          })
        }
      }
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
    this.setData({
      inputTag: e.detail.value
    })
  },

  confirmUserId: function () {
    var userId = this.data.inputTag;
    if (userId === null || userId.trim() == "") {
      wx.showModal({
        content: "请输入合法TAG",
        showCancel: false,
        success: function (res) {}
      });
      return
    }
    //delete # in the start
    var firstChar = userId.substr(0, 1)
    if (firstChar == "#") {
      userId = userId.substr(1);
    }
    this.setData({
      userId: userId.toUpperCase()
    })
    try {
      wx.setStorageSync('clashroyale.userId', this.data.userId)
    } catch (e) {}
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
      inputTag: this.data.historyTags[index]
    })
  },

  deleteAllTags: function () {
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'delete_tag'
    }).then(res => {
      console.log('delete_tag res:', res)
    }).catch(err => {
      console.log('delete_tag err:', err)
    })
  },

  clearHistoryTagsConfirm: function () {
    var that = this;
    wx.showModal({
      title: '确认清空？',
      confirmText: '清空',
      // content: '这是一个模态弹窗',
      success: function (res) {
        if (res.confirm) {
          that.clearHistoryTags()
          that.deleteAllTags()
        } else if (res.cancel) {}
      }
    })
  },

  clearHistoryTags: function () {
    var empty = new Array()
    try {
      wx.setStorageSync('clashroyale.historyTags', empty)
    } catch (e) {}
    try {
      wx.setStorageSync('clashroyale.userId', "")
    } catch (e) {}
    try {
      wx.setStorageSync('clashroyale.clanId', "")
    } catch (e) {}
    this.setData({
      historyTags: [],
      inputTag: ""
    })
  },

  showTagGuide: function () {
    var bol = this.data.showTagGuide;
    this.setData({
      showTagGuide: !bol
    })
  }
})