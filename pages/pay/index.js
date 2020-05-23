
import { getSetting,chooseAddress, openSetting,showModal,showToast} from '../../request/asyncWx'
import regeneratorRuntime from '../../utils/runtime.js'
/*

  - 支付页面

  -- 从缓存中获取购物车数据，渲染到页面中
    - 这些数据 checked = true

  -- 微信支付
    - 哪些人 哪些账号 可以实现微信支付
      - 企业账号
      - 企业账号的小程序后台中 必须 给开发者添加上白名单
        1. 一个appid可以同时绑定多个开发者
        2. 这些开发者就可以共用这个appid同时拥有开发权限


*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow:function(){
    // 获取缓存中收获地址信息
    const address = wx.getStorageSync("address")
    // 获取缓存中购物车数据
    let cart = wx.getStorageSync("cart") || []
    // 过滤后的购物车数据
    cart = cart.filter(v=>v.checked)
    // 计算全选
    //let allChecked = cart.length ? cart.every(v=>v.checked):false
    let totalPrice = 0
    let totalNum = 0
    // 循环遍历
    cart.forEach((item)=>{
      // 只计算被选中的
       // 商品总价格
       totalPrice += item.goods_price * item.num
       // 商品数量
       totalNum += item.num
    })
    // 赋值
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })
  }
  
})