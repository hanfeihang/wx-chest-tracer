//app.js
require('./libs/Mixins.js');
const themeListeners = [];
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env: '你的环境ID',
        traceUser: true,
      })
    }
    const res = wx.getSystemInfoSync()
    this.globalData.theme = res.theme
  },
  globalData: {
    theme: 'light', // dark
  },
  themeChanged(theme) {
      this.globalData.theme = theme;
      themeListeners.forEach((listener) => {
          listener(theme);
      });
  },
  watchThemeChange(listener) {
      if (themeListeners.indexOf(listener) < 0) {
          themeListeners.push(listener);
      }
  },
  unWatchThemeChange(listener) {
      const index = themeListeners.indexOf(listener);
      if (index > -1) {
          themeListeners.splice(index, 1);
      }
  },
  onThemeChange(object){
    this.themeChanged(object.theme)
  },
})