/*
  1. 点击加号按钮触发tap点击事件
    1. 调用小程序内置的选择图片的api
    2. 获取图片的路径 数组
    3. 把图片路径存到data的变量中
    4. 页面根据 图片数组 进行循环显示 
  
  2. 点击 自定义图片 组件
    1. 获取点击元素的索引
    2. 获取data 中图片数组
    3. 根据索引 数组中删除对应的元素
    4. 把数组重新设置回data中

  3. 点击 “提交”
    1. 获取文本域的内容
      1. 在data中定义变量 类似输入框的获取
      2. 文本域绑定输入事件 事件触发的时候 把输入框的值存入到变量中
    2. 对这些内容 合法性验证
    3. 验证通过 用户选择的图片 上传到服务器中 返回图片外网的链接
      1. 遍历图片数组
      2. 挨个上传
      3. 自己再来维护一个图片数组 存放图片上传后的外网的链接
    4. 文本域 和 外网的图片的路径一起提交到服务器中
    5. 清空当前页面
    6. 返回上一页
*/

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
    ],
    // 被选中的图片路径 数组
    chooseImage:[],
    // 文本域的内容
    textVal:''
  },
  // 外网图片路径数组
  UploadImags:[],
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
  },
  // 点击 "+" 选择图片
  handleTabsItemChange(){
    // 1.调用小程序内置api
    wx.chooseImage({
      // 同时选中的图片的数量
      count:9,
      // 图片的格式 原图 压缩
      sizeType:['original','compressed'],
      // 图片的来源 相册 照相机
      sourceType:['album','camera'],
      success:(res)=>{
        this.setData({
          // 图片数组进行拼接(防止每次上传重置)
          chooseImage:[...this.data.chooseImage,...res.tempFilePaths]
        })
      }
    })
  },
  // 点击自定义图片组件
  handleRemoveImg(e){
    // 1. 获取索引
    const { index } = e.currentTarget.dataset
    // 2. 获取data中图片数组
    let { chooseImage } = this.data;
    // 3. 删除元素
    chooseImage.splice(index,1)
    this.setData({
      chooseImage
    })
    //console.log(index)
  },
  // 文本域的输入事件
  handleTextInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },

  // 表单提交
  handleFormSubmit(){
    // 1. 获取文本域的内容/ 图片数组
    const { textVal ,chooseImage} = this.data 
    // 2. 验证
    if(!textVal.trim()){
      wx.showToast({
        title:'输入不合法',
        icon:'none',
        mask:true
      })
      return 
    }
    // 3. 模拟将图片上传到专门的服务器
    // 上传文件的api不支持多个文件同时上传，（解决方法：遍历数组挨个上传）
    // chooseImage.forEach((v,i)=>{
    //   //UploadImags
    //   wx.uploadFile({
    //       // 服务器地址
    //       url: 'https://images/ac.cn/Home/Index/UploadAction/',
    //       // 要上传的路径
    //       filePath: v,
    //       // 上传文件的名称，后台获取文件 file
    //       name: 'file',
    //       // 上传文件 顺带的文本信息
    //       formData: {},
    //       success: (result) => {
    //         console.log(result)
    //       }
    //     });
          
         console.log(textVal)
      
    // })
  }
})