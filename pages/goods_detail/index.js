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
  
  -- 商品收藏
    1.页面onShow的时候 加载缓存中商品收藏的数据
    2.判断当前商品是不是被收藏
      1.是改变页面的图标
      2.不是...
    3.点击收藏按钮
      1.判断该商品是否存在于缓存的数组中
      2.已经存在 把该商品删除掉
      3.没有存在 把商品添加到收藏数组中 存入到缓存中

*/
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../utils/runtime.js'

// pages/goos_list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    // 商品是否被收藏过
    isCollect:false
  },
  // 商品对象
  GoodsInfo:{},
  
  onShow: function () {
    // 获取页面栈
    let pages = getCurrentPages()
    let currentPage = pages[pages.length-1]
    let options = currentPage.options
    const { goods_id } = options
    this.getGoodsDetail(goods_id)

    
  },
  // 获取商品详情
  async getGoodsDetail(goods_id){
    const res = await request({url:'/goods/detail',data:{goods_id}})
    const goodsObj = res.data.message
    this.GoodsInfo = res.data.message
    console.log(goodsObj)

    // 1.获取缓存中商品收藏的数组
    let collect = wx.getStorageSync("collect") || []
    // 2.判断当前商品是否被收藏了
    let isCollect = collect.some(v=>v.goods_id===this.GoodsInfo.goods_id)

    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        // iphone部分手机 不识别webp图片格式
        // 找到后台进行修改/ 临时修改(1.webp=>1.jpg) replace替换
        // goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        goods_introduce:goodsObj.goods_introduce,
        pics:goodsObj.pics
      },
      isCollect
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
      this.GoodsInfo.checked = true
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
  },
  // 点击商品收藏图标
  handleCollect(){
    let isCollect = false
    // 1.获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || []
    // 2.判断该商品是否被收藏过
    let index = collect.findIndex(v=>v.goods_id === this.GoodsInfo.goods_id)
    // 3.当index!=-1表示 已经收藏过
    if(index !== -1){
      // 能找到 已经收藏过了 在数组中删除商品
      collect.splice(index,1)
      isCollect = false
      wx.showToast({title:'取消成功',icon:'success',mask:true})
    }else{
      // 没有收藏过 直接添加
      collect.push(this.GoodsInfo)
      isCollect = true
      wx.showToast({title:'收藏成功',icon:'success',mask:true})
    }

    // 4. 把数组存入缓存中
    wx.setStorageSync("collect",collect)
    // 5.修改data中的属性 isCollect
    this.setData({
      isCollect
    })




  }

  
})