// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect:[],
    tabs:[
      {
        id:0,
        value:'商品收藏',
        isActive:true
      },
      {
        id: 0,
        value: '品牌收藏',
        isActive: false
      },
      {
        id: 0,
        value: '店铺收藏',
        isActive: false
      },
      {
        id: 0,
        value: '浏览足迹',
        isActive: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow(){
    const collect = wx.getStorageSync("collect") || []
    this.setData({
      collect
    })
  },
  // 改变table项目
  tabsItemChanges:function(e){
    // 1.获取index
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