import {request} from '../../request/index.js'

//index.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数据
    swiperList:[],
    navList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSwiperList()
    this.getNavList()
    console.log(this.data)
  },
  // 轮播图数据请求
  getSwiperList(){
    request({
      url:'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata'
    }).then((res)=>{
      //console.log(res)
      this.setData({
        swiperList:res.data.message
      })
      
    })
  },
  // 分类导航数据请求
  getNavList(){
    request({
      url:'https://api-hmugo-web.itheima.net/api/public/v1/home/catitems'
    }).then((res)=>{
      this.setData({
        navList:res.data.message
      })
    })
  }
  
})