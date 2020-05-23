
import { getSetting,chooseAddress, openSetting,showModal,showToast} from '../../request/asyncWx'
import regeneratorRuntime from '../../utils/runtime.js'
/*
    -- 获取收获地址
      - 1.绑定点击事件
      - 2.调用小程序内置api 获取用户授权收获地址 wx.chooseAddress
      - 3.获取用户对小程序所授予获取地址的 权限状态 scope
        - 1. 假设用户点击收获地址弹出提示框，点击确定 authSetting scope.address 直接调用获取收获地址
        - 2. 假设用户从来没有调用过收获地址api scope undefiend 直接调用获取收获地址
        - 3. 假设用户点击收货地址提示框 取消 scope false
          - 诱导用户自己打开授权设置页面（wx.openSetting） 当用户重新给与获取地址权限的时候
          - 获取用户地址

    -- 页面加载完毕
      - onShow 
      - 获取本地存储的地址数据
      - 把数据设置给data中的变量
    
    -- onShow
      - 1.回到商品详情页面 第一次添加属性的时候，手动添加属性
        num =1
        checked = true
      - 2.获取缓存中购物车数组
      - 3.把购物车数据填充到data中

    -- 全选实现 数据展示
      - 获取缓存中购物车数组
      - 根据购物车中的商品数据，所有商品都被选中，checked=true （allChecked才被选中）

    -- 总价格与总数量
      - 1.商品被选中 才能拿来计算
      - 2.获取购物车数组
      - 3.遍历购物车数组
      - 4.判断商品是否被选中
      - 5.总价格 = 商品单价 * 商品数量
      -   总数量 = 商品的数量
      - 6.把计算后的价格重新设置到data与缓存中

    -- 商品的选中   
      - 绑定change事件
      - 获取到被选中的商品对象
      - 商品对象的选中状态取反
      - 重新计算 总价格/数量/全选
      - 重新填充到data与缓存中

    -- 全选与反选
      - 全选复选框绑定事件
      - 获取data中全选变量 allChecked
      - 直接取反 allChecked = !allChecked
      - 遍历购物车数组让里面商品选中状态跟随 allChecked
      - 把 购物车数组和allChecked 重新设置回data,把购物车重新设置回缓存
      
    -- 商品数量的编辑
      - 给加好，减号绑定同一个点击事件，区分的关键在于自定义属性上
        “+” +1
        “-” -1
      - 传递被点击的商品id goods_id
      - 获取到data中的购物车数组，根据商品id获取需要被修改的商品对象
      - 当购物车的数量=1同时用户点击了减号
        弹窗提示（showModal） 询问用户是否要删除
          1.确定 直接执行删除
          2.取消 什么都不做
      - 直接修改商品对象的数量 num
      - 把cart数组 重新设置回 缓存中和data中 this._setCart()

    -- 点击结算
      - 判断有没有收获地址信息
      - 判断用户有没有选购商品
      - 经过以上验证跳转到支付页面
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allChecked:false,
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
    const cart = wx.getStorageSync("cart") || []
    // 计算全选
    //let allChecked = cart.length ? cart.every(v=>v.checked):false
    this._setCart(cart)
    // 赋值
    this.setData({
      address
    })

  },
  // 使用async await 用法
  async handleChoosAddress(){
    try{
      // 点击获取权限状态
      const res = await getSetting()
      const scopeAddress = res.authSetting["scope.address"]
      console.log(res)
      // 判断权限状态
      if(scopeAddress == false){
        const res2 = await openSetting()
        console.log("诱导用户打开",res2)
      }
      // 调用获取地址api
      const address = await chooseAddress()
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
      // 本地存储收获地址
      wx.setStorageSync("address",address)
     
      console.log(address)
    }catch(err){
      console.log(err)
    }
  },
  handleItemChange(e){
    // 获取被修改的商品id
    const { goods_id } = e.currentTarget.dataset
    // 获取购物车数组
    const { cart } = this.data
    // 找到被修改的商品对象
    const index = cart.findIndex(v=>v.goods_id == goods_id) 
    // 选中转态取反
    cart[index].checked = !cart[index].checked
    // 重新设置cart到data与缓存中
    this._setCart(cart)
   
  },
  // 全选/反选
  handleCheckAll(){
    // - 获取data中全选变量 allChecked
    let { allChecked,cart } = this.data
    // - 直接取反 allChecked = !allChecked
    allChecked = !allChecked
    // - 遍历购物车数组让里面商品选中状态跟随 allChecked
    cart.forEach(v=>v.checked = allChecked)
    // - 把 购物车数组和allChecked （计算总价格与数理） 重新设置回data,把购物车重新设置回缓存
    this._setCart(cart)
  },
  // 商品数量的编辑功能
  async handleItemNum(e){
    // 获取传递过来的参数
    const { operation,id } = e.currentTarget.dataset
    // 获取购物车数组
    let { cart } = this.data
    // 找到需要修改商品的索引
    const index = cart.findIndex(v=>v.goods_id === id)
    // 判断是否要执行删除
    if(cart[index].num === 1 && operation === -1){
      // 弹窗提示
      // wx.showModal({
      //   title:'提示',
      //   content:'您是否要删除？',
      //   success:(res)=>{
      //     if(res.confirm){
      //       cart.splice(index,1)
      //       // 设置回缓存和data中
      //       this._setCart(cart)
      //     }else{
      //       console.log("取消了")
      //     }
      //   }
      // })
      // promise 形式
      const  res = await showModal({content:'您是否要删除？'})
      if(res.confirm){
        cart.splice(index,1)
        // 设置回缓存和data中
        this._setCart(cart)
      }else{
        console.log("取消了")
      }
    }else{
       // 进行修改数量
      cart[index].num += operation
      // 设置回缓存和data中
      this._setCart(cart)
    }


   
  },
  // 封装设置cart函数
  _setCart(cart){
    let allChecked = true
    let totalPrice = 0
    let totalNum = 0
    // 循环遍历
    cart.forEach((item)=>{
      // 只计算被选中的
      if(item.checked){
        // 商品总价格
        totalPrice += item.goods_price * item.num
        // 商品数量
        totalNum += item.num
      }else{
        // 全选
        allChecked = false
      }
    })
    // 赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync("cart",cart)
  },
  // 点击结算
  async handlePay(){
    // 判断收获地址
    const { address,totalNum } = this.data
    if(!address.userName){
      await showToast({title:"您还没有选择收获地址"})
      return 
    }

    // 判断用户有没有选购商品
    if(totalNum === 0 ){
      await showToast({title:"您还没有选购商品"})
      return 
    }

    // 跳转到支付页面
    wx.navigateTo({
      url:'/pages/pay/index'
    })
  }

  // 获取收获地址(普通用法)
  // handleChoosAddress(){
  //   //console.log("进来了")
  //   wx.getSetting({
  //     success:(res)=>{
  //       console.log(res)
  //       if(res.authSetting["scope.address"] == true || res.authSetting["scope.address"] == undefined){
  //         wx.chooseAddress({
  //           success:(res1)=>{
  //             console.log(res1)
  //           }
  //         })
  //       }else{
  //         // 用户以前拒绝过授予权限，先诱导用户打开授权页面
  //         wx.openSetting({
  //           success:(res2)=>{
  //             console.log(res2)
  //             // 调用收获地址
  //             wx.chooseAddress({
  //               success:(res1)=>{
  //                 console.log(res1)
  //               }
  //             })
  //           }
  //         })
  //       }
  //     }
  //   })
  // }
  
})