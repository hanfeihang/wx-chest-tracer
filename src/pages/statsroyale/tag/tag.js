// tag.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputUserId: null,
    historyTags: [],
    tagIndex: 0,
    showTagGuide: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    try {
      var value = wx.getStorageSync('clashroyale.userId')
      if (value) {
        console.log(value)
        this.setData({
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
        this.setData({
          historyTags: value
        })
        for (var i = 0; i < value.length; i++) {
          if (value[i] == this.data.inputUserId) {
            this.setData({
              tagIndex: i
            })
          }
        }
        for (tag in value) {
          if (tag == this.data.inputUserId) {
            this.setData({
              tagIndex: value
            })
          }
        }

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
    var userId = this.data.inputUserId;
    if (userId === null || userId.trim() == "") {
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
    //delete # in the start
    var firstChar = userId.substr(0, 1);
    if (firstChar == "#"){
      userId = userId.substr(1);
    }
    this.setData({
      userId: userId.toUpperCase()
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

  clearHistoryTagsConfirm: function () {
    var that = this;
    wx.showModal({
      title: '确认清空？',
      confirmText: '清空',
      // content: '这是一个模态弹窗',
      success: function (res) {
        if (res.confirm) {
          that.clearHistoryTags()
        } else if (res.cancel) {
        }
      }
    })
  },

  clearHistoryTags: function () {
    var empty = new Array()
    try {
      wx.setStorageSync('clashroyale.historyTags', empty)
    } catch (e) {
    }
    try {
      wx.setStorageSync('clashroyale.userId', "")
    } catch (e) {
    }
    this.setData({
      historyTags: [],
      inputUserId: ""
    })
  },

  showTagGuide: function () {
    var bol = this.data.showTagGuide;
    this.setData({
      showTagGuide: !bol
    })
  }
})
