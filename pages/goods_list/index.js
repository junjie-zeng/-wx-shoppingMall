import { request } from '../../request/index.js'
import regeneratorRuntime from '../../utils/runtime.js'

/*
  -- 用户上滑页面，滚动条触底 开始加载下一页数据
    - 找到滚动条触底事件
    - 判断还有没有下一页数据
      1.获取总页数 （只有总条数）
        总页数 = Math.ceil(总条数/页容量)
        总页数 = Math.ceil(23/10)

      2.判断当前页码 pagenum
      3.判断当前页码是否大于等于总页数

    - 假如没有下一页数据弹框提示
    - 假如有下一页数据 来加载下一页数据
      1.当前页码 ++
      2.重新发送请求
      3.数据请求回来对data中数组进行拼接

    - 下拉刷新页面
      1.触发下拉刷新新事件 需要在页面的json文件中开启一个配置项
      2.重置 数据 数组
      3.重置页码 设置为1
      4.重新发送请求


*/

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tabs
    tabs:[
      {
        id:0,
        value:'综合',
        isActive:true
      },
      {
        id: 0,
        value: '销量',
        isActive: false
      },
      {
        id: 0,
        value: '价格',
        isActive: false
      }
    ],
    // 商品列表数据
    goodList:[]
  },
  totalPages:0,
  // 接口需要的参数
  QueryParams:{
    query:'',
    cid:'',
    pagenum:1,
    pagesize:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 将canid保存在全局的参数中
    this.QueryParams.cid = options.catId
    //console.log(options)
    // 调用
    this._getGoodList()
  },
  // 获取商品列表
  async _getGoodList(){
    // async 获取
    var res = await request({ url:'/goods/search',data:this.QueryParams})
    const total = res.data.message.total
    // 计算总页数 (总条数/页容量)
    this.totalPages = Math.ceil(total/this.QueryParams.pagesize)
    this.setData({
      goodList:[...this.data.goodList,...res.data.message.goods]
    })
    wx.stopPullDownRefresh()
    //console.log(res)
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
  },
   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("下拉动作")
    this.setData({
      goodList:[]
    })
    this.QueryParams.pagenum = 1
    this._getGoodList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("上拉触底")
    // 当前页数是否等于总页数
    if(this.QueryParams.pagenum >= this.totalPages){
      console.log("没有下一页")
      wx.showToast({title:'没有下一页数据'})
    }else{
      console.log("加载下一页")
      this.QueryParams.pagenum ++
      this._getGoodList()
    }
  },
})