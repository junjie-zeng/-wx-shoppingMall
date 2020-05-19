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



*/
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 获取收获地址
  handleChoosAddress(){
    //console.log("进来了")
    wx.getSetting({
      success:(res)=>{
        console.log(res)
        if(res.authSetting["scope.address"] == true || res.authSetting["scope.address"] == undefined){
          wx.chooseAddress({
            success:(res1)=>{
              console.log(res1)
            }
          })
        }else{
          // 用户以前拒绝过授予权限，先诱导用户打开授权页面
          wx.openSetting({
            success:(res2)=>{
              console.log(res2)
              // 调用收获地址
              wx.chooseAddress({
                success:(res1)=>{
                  console.log(res1)
                }
              })
            }
          })
        }
      }
    })
  }
  
})