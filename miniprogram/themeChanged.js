module.exports = {
  data: {
      theme: '',
  },
  themeChanged(theme) {
      this.setData({
          theme,
      });
  },
  onLoad() {
      const app = getApp();
      console.log('onLoad themeChanged')
      this.themeChanged(app.globalData.theme);
      app.watchThemeChange(this.themeChanged);
  },
  onUnload() {
      getApp().unWatchThemeChange(this.themeChanged);
  },
};