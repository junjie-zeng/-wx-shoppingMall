
import { getSetting,chooseAddress, openSetting,showModal,showToast,requestPayment} from '../../request/asyncWx'
import regeneratorRuntime from '../../utils/runtime.js'
import {request} from '../../request/index.js'
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

  -- 点击支付按钮
    - 先判断缓存中有没有token
    - 没有跳转到授权页面，进行获取token
    - 有token .....
    - 创建订单 获取订单编号
    - 已经完成微信支付
    - 手动删除缓存中 已经被选中的商品（模拟已支付的的商品移除购物车）
    - 删除后的购物车数据 填充回缓存中
    - 跳转页面

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
  },
  // 点击支付 （读懂流程）
  async handleOrderPay(){
    try{
      // 判断缓存中有没有token
      const token = wx.getStorageSync("token")
      // 判断
      if(!token){
        wx.navigateTo({
          url:'/pages/auth/index'
        })
        return
      }

      console.log("已经存在token")
      // 创建订单
      // 准备 请求头参数
      const header = {Authorization:token} 
      // 准备请求体参数
      const order_price = this.data.totalPrice
      const consignee_addr = this.data.address.all
      const cart = this.data.cart
      const goods = [];
      cart.forEach(v=>goods.push({
        goods_id:v.goods_id,
        goods_number:v.num,
        goods_price:v.goods_price
      }))
      const orderParams = {
        order_price,
        consignee_addr,
        goods
      }
      // 4.发送请求 创建订单 获取订单编号
      const orderRes = await request({url:'/my/orders/create',method:'POST',data:orderParams,header:header})
      //console.log(res)
      // token是假的无法获取（模拟以获取到订单号）
      // const order_number = "HMDD20190809000000001059"   
      const order_number = orderRes.data.message.order_number
      console.log(order_number) 
      // 5.准备发起预支付接口
      const res = await request({url:'/my/orders/req_unifiedorder',method:'POST',data:{order_number},header})
      console.log(res)
      // 6.发起微信支付(需要扫码，扫码失败)
      const payment = await requestPayment(res.data.message.pay)
      console.log("支付情况",payment)
      // 7.查询后台 订单状态
      const orderStatus = await request({url:'/my/orders/chkOrder',method:'POST',data:{order_number},header})
      console.log(orderStatus)
      await showToast({title:'支付成功'})
      // 8.手动删除缓存中已支付的商品（模拟调用接口移除购物车已经购买了的商品）
      let newCart = wx.getStorageSync("cart")
      // 过滤 留下未被选中的
      newCart = newCart.forEach(v=>!v.checked)
      wx.setStorageSync("cart",newCart)

      // 8.支付成功了跳转到订单页面
      wx.navigateTo({
        url:'/pages/order/index'
      })
    }catch(err){
      console.log(err)
      await showToast({title:'支付失败'})
    }
  }
  
})