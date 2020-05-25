// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:{},
    collectNumber:0 // 商品收藏数量
  },
  onShow: function () {
    const userinfo = wx.getStorageSync("userinfo")
    const collect = wx.getStorageSync("collect")　|| []
    this.setData({
      userinfo,
      collectNumber:collect.length
    })
  },

})