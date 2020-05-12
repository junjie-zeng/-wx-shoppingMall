import {request} from '../../request/index.js'
// pages/category/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList:[],
    // 右侧商品数据
    rightContent:[],
    // 被点击的左侧的菜单
    currentIndex:0,
    // 滚动条位置
    scrollTop:10
  },
  // 接口的返回数据
  Cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    /*
        缓存数据
          - 商品分类的数据过大，每次请求的话会消耗性能，通过缓存技术提高用户体验
          - 思路：
              - 首先判断是否有数据，没有则发送请求并将数据保存在缓存当中
              - 判断数据是否过期了，没有过期则取缓存中的数据，如果过期了则重新发送请求

          - web端缓存与小程序中缓存的区别
            - 语法不一样
              web：localStorage.setItem("key","value") localStorage.getItem("key")
              小程序：wx.setStorageSync("key",value) wx.getStorageSync("key")
            
            - 缓存数据
              web端：需将数据转换成字符串在进行存储
              小程序：对数据存储没有要求，存的时候什么样取出来就是什么样

    */
    
    if(!this.Cates.length){
      console.log("没有数据，获取")
      this.getCates()
    }else{
      var data = wx.getStorageSync("cates")
      // 如果当前时间-存储的时间大于10毫秒则重新发送请求
      if (Date.now - data.time > 1000*10){
        console.log("数据过期，获取")
        this.getCates()
      }else{
        console.log("使用缓存中的数据")
         // 保存数据进行处理
        this.Cates = data.cates
        // 左侧菜单数据
        let leftMenuList = this.Cates.map((v => v.cat_name))
        // 右侧的商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }

    
    
  },
  // 获取分类数据
  getCates(){
    request({
      url:'https://api-hmugo-web.itheima.net/api/public/v1/categories',
     
    }).then((res)=>{
      //console.log(res)
      // 保存数据进行处理
      this.Cates = res.data.message
      // 将数据保存在缓存中
      wx.setStorageSync("cates",{time:Date.now(),data:this.Cates})
      // 左侧菜单数据
      let leftMenuList = this.Cates.map((v=>v.cat_name))
      // 右侧的商品数据
      let rightContent = this.Cates[0].children;
      //console.log(rightContent)
      this.setData({
        leftMenuList,
        rightContent
      })
    })
  },
  // 选择分类，过滤
  selectCaegory(e){
    // 选择分类并过滤出对应的内容
    // 得到下标
    const {index } = e.target.dataset
    // 根据下标得到右侧的商品数据
    let rightContent = this.Cates[index].children; 
    // 更新
    this.setData({
      currentIndex:index,
      rightContent,
      scrollTop:0
    })
  }

})