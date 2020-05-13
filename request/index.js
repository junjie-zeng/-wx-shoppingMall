
/* 封装promise */
export const request = (params)=>{
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
      }
    })
  })
}