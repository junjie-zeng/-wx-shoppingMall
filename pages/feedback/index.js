// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tabs
    tabs:[
      {
        id:0,
        value:'体验问题',
        isActive:true
      },
      {
        id: 0,
        value: '商品、商家投诉',
        isActive: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 改变table项目
  tabsItemChanges:function(e){
    // 获取index
    const { index } = e.detail
    const { tabs } = this.data
    // 更改
    tabs.forEach((item, i)=>index ===i?item.isActive = true:item.isActive = false)
    // 设置
    this.setData({
      tabs
    })
  }
  
})