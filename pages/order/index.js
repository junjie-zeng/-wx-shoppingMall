import { request } from '../../request/index.js'
import regeneratorRuntime from '../../utils/runtime.js'
/*
  1.页面被打开的时候 onShow(页面频繁的被使用)
    0.onShow 不同于onLoad 无法在形参上接收 options 参数
    0.5.判断缓存中有没有token 如果没有跳转到授权页面，有直接往下进行
    1.获取参数url参数type
    2.根据type来决定页面标题的数组元素哪个被激活选中
    2.根据type 去发送请求获取订单数据
    3.页面渲染

  2.点击不同的标题，重新发送请求来获取和渲染数据
    切换tab组件，重新发送请求

*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs:[
      {
        id:0,
        value:'全部',
        isActive:true
      },
      {
        id: 0,
        value: '代付款',
        isActive: false
      },
      {
        id: 0,
        value: '代发货',
        isActive: false
      },
      {
        id: 0,
        value: '退款退货',
        isActive: false
      }
    ],
  },
  onShow(optinos){
    const token = wx.getStorageSync("token")
    // 判断是否有token
    if(!token){
      wx.navigateTo({
        url:'/pages/auth/index'
      })
      return 
    }
    
    // 1.获取当前的小程序的页面栈-数组 长度最大是10
    let pages = getCurrentPages()
    // 2.数组中 索引最大的是当前页面
    let currentPage = pages[pages.length-1]
    // 3.获取url上的type参数
    const type = currentPage.options.type
    // 4.激活选中页面标题 type = 1,index =0
    this.changeTitleByIndex(type - 1)
    console.log(currentPage.options.type)
    // 4.获取
    this.getOrders(type)
   
  },

  // 获取订单列表的方法
  async getOrders(type){
    const res = await request({url:'/my/orders/all',data:{type}})
    let orders = res.data.message.orders
    orders = orders.map(v=>({...v,create_time_cn:new Date(v.create_time * 1000).toLocaleString()}))
    console.log(orders)
    this.setData({
      orders
    })
    
  },
  //根据标题的索引来激活选中 标题数组
  changeTitleByIndex(index){
    const { tabs } = this.data
    // 更改
    tabs.forEach((item, i)=>index ===i?item.isActive = true:item.isActive = false)
    // 设置
    this.setData({
      tabs
    })
  },
  // 改变table项目
  tabsItemChanges:function(e){
    // 1.获取index
    const { index } = e.detail
    this.changeTitleByIndex(index)
    // 2.重新发送请求
    this.getOrders(index+1)
  }
  
})