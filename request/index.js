
/* 封装promise */


// 同时发送异步代码的次数（针对一个页面同时调用多次接口）
let ajaxTimes = 0 // 调用时++ ，请求回来时—-，直到等于0时才将图标关闭

export const request = (params)=>{
  ajaxTimes ++
  //显示正在加载图标
  wx.showLoading({
    title:'加载中',
    mask:true
  })


  // 公共接口
  let prefixUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      url: prefixUrl + params.url,
      success:(res)=>{
        resolve(res)
      },
      fail:(err)=>{
        reject(err)
      },
      complete:()=>{// 不管成功或失败都会调用
        ajaxTimes -- 
        if(ajaxTimes === 0){
          // 关闭正在等待图标
           wx.hideLoading();
        }
        

      }
    })
  })
}