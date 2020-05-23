
import { getSetting,chooseAddress, openSetting,showModal,showToast,login} from '../../request/asyncWx'
import regeneratorRuntime from '../../utils/runtime.js'
import {request} from '../../request/index.js'
// pages/auth/index.js
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
  async handleGetUserInfo(e){
    try{
      //console.log(e.detail)
      // 获取用户信息
      const  {encryptedData,rawData,iv,signature} = e.detail
      // 获取小程序登录成功后code的值
      const {code} = await login()
      const loginParams = {encryptedData,rawData,iv,signature,code}
      // 发送请求 获取用户的token
      //const res = await request({url:'/users/wxlogin',data:loginParams,method:'post'})
      //console.log(res)
      // 把token存入缓存中，同时跳转回上一个页面 
      // token 获取不到模拟已经获取到了token
      wx.setStorageSync("token","Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo")
      wx.navigateBack({
        delta:1
      })

    }catch(err){
      console.log(err)
    }
    
  }

  
})