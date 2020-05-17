/*
  -- 发送请求获取数据
  -- 点击轮播图 预览大图
     给轮播图绑定点击事件
     调用小程序的apI previewImage


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
  }

  
})