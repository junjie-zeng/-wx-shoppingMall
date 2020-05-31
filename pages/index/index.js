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
    // 导航 
    navList:[],
    // 楼层数据
    floorList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSwiperList()
    this.getNavList()
    this.getFloorList()
    //console.log(this.data)

    // test selectComponent
    let searchInput = this.selectComponent("#searchInput")
    // 执行组件中的方法
    console.log(searchInput.test())
  },
  // 轮播图数据请求
  getSwiperList(){
    request({
      url:'/home/swiperdata'
    }).then((res)=>{
      let swiperList = res.data.message
      // 跳转路径处理
      swiperList.forEach(v=>v.navigator_url =  `/pages/goods_detail/index?${v.navigator_url.substring(v.navigator_url.indexOf("?")+1)}`)
      this.setData({
        swiperList
      })
      
    })
  },
  // 分类导航数据请求
  getNavList(){
    request({
      url:'/home/catitems'
    }).then((res)=>{
      this.setData({
        navList:res.data.message
      })
    })
  }
  ,
  // 获取楼层数据
  getFloorList(){
    request({
      url:'/home/floordata'
    }).then((res)=>{
      let  floorList = res.data.message
      floorList.forEach(item=>{
        item.product_list.forEach(item2=>{
          // 跳转路径处理
          item2.navigator_url = `/pages/goods_list/index?${item2.navigator_url.substring(item2.navigator_url.indexOf("?")+1)}`
        })
      })
      this.setData({
        floorList
      })
    })
  }
  
})