// pages/login/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }, 
  // 获取用户信息
  handleGetUserInfo(e){
    // 获取数据
    const {userInfo} = e.detail
    // 存储用户信息
    wx.setStorageSync('userinfo',userInfo)
    // 返回上一页
    wx.navigateBack({
      delta:1
    })
    
    console.log(e)
  }
  
})