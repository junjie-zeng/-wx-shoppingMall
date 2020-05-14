import { request } from '../../request/index.js'
import regeneratorRuntime from '../../utils/runtime.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tabs
    tabs:[
      {
        id:0,
        value:'A',
        isActive:true
      },
      {
        id: 0,
        value: 'B',
        isActive: false
      },
      {
        id: 0,
        value: 'C',
        isActive: false
      }
    ],
    // 商品列表数据
    goodList:[]
  },
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
    this.setData({
      goodList:res.data.message.goods
    })
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
  }
})