import { request } from '../../request/index.js'
import regeneratorRuntime from '../../utils/runtime.js'
/*

    1. 输入框绑定 值改变事件 input事件
      1.获取输入框的值
      2.合法性判断
      3.检验通过 把输入框的值 发送到后台
      3.返回数据打印到页面上

    2. 防抖（防止抖动） 定时器 节流
      0.防抖 一般用于输入框 防止重复输入重复发送请求
      1.节流 一般用于页面上拉下拉
      1.定义全局的定时器id
      2.


*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    // 取消的按钮是否显示
    isFocus:false,
    inputValue:''
  },
  TimeId:-1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 输入看的值改变就会触发的的事件
  handleInput(e){
    // 1.获取输入框的值
    const {value} = e.detail
    // 2.检查合法性
    if(!value.trim()){
      this.setData({
        isFocus:false,
        goods:[]
      })
      // 不合法
      return

    }

    // 3.准备发送请求获取数据
    clearTimeout(this.TimeId)
    this.setData({
      isFocus:true
    })
    this.TimeId = setTimeout(()=>{
      this.qsearch(value)
    },1000)
    


    console.log(e)
  },
  // 发送请求获取搜索数据
  async qsearch(query){
    const res = await request({url:'/goods/qsearch',data:{query}})
    console.log(res)
    this.setData({
      goods:res.data.message
    })
  },
  // 点击 取消
  handleCancel(){
    this.setData({
      isFocus:false,
      goods:[],
      inputValue:''
    })
  }

  
})