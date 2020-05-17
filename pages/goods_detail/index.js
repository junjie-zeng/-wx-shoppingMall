/*
  -- 发送请求获取数据
  -- 点击轮播图 预览大图
     给轮播图绑定点击事件
     调用小程序的apI previewImage
  -- 点击 加入购物车
    - 先绑定点击事件
    - 获取缓存中的购物车数据 数组格式
    - 先判断当前是否已经存在与购物车中
      - 如果已经存在购物车则执行购物车数量++，重新把数组填充到缓存中
    - 不存于与购物车的数组中，直接给购物车数组添加一个新元素，新元素带上购买数量属性 num，把数组填充到缓存中
    - 弹出提示
  


*/
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../utils/runtime.js'

// pages/goos_list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{}
  },
  // 商品对象
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { goods_id } = options
    console.log(goods_id)
    this.getGoodsDetail(goods_id)
  },
  // 获取商品详情
  async getGoodsDetail(goods_id){
    const res = await request({url:'/goods/detail',data:{goods_id}})
    const goodsObj = res.data.message
    this.GoodsInfo = res.data.message
    console.log(goodsObj)
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        // iphone部分手机 不识别webp图片格式
        // 找到后台进行修改/ 临时修改(1.webp=>1.jpg) replace替换
        // goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        goods_introduce:goodsObj.goods_introduce,
        pics:goodsObj.pics
      }
    })
  },
  // 点击轮播图 放大预览
  handlePrevewImage(e){
    console.log("放大预览")
    // 先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
    // 接收传递过来的url
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      current:current,
      urls:urls
    })
  },
  // 加入购物车
  handleCartAdd(){
    console.log("cart")
    // 获取缓存中的购物车 数组
    let cart = wx.getStorageSync('cart') || []
    // 判断商品是否存在于购物车数组中
    let index = cart.findIndex(v=>v.goods_id === this.GoodsInfo.goods_id)
    if(index === -1){
      // 不存在 第一次添加
      this.GoodsInfo.num = 1
      cart.push(this.GoodsInfo)
    }else{
      // 已经存在购物车 执行num++
      cart[index].num++
    }

    // 把购物车重新添加到缓存中
    wx.setStorageSync("cart",cart)
    // 弹窗提示
    wx.showToast({
      title:'加入成功',
      icon:'success',
      mask:true  // ture:防止用户收到疯狂点击按钮
    })
  }

  
})