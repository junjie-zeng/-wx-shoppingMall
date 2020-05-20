

/*
    封装微信的promise

*/
// 用户是否授权
export const getSetting = ()=>{
    return new Promise((resolve,reject)=>{
        wx.getSetting({
            success:(res)=>{
                resolve(res)
            },
            fail:(err)=>{
                reject(err)
            }
        })
    })
}

// 调用收获地址
export const chooseAddress = ()=>{
    return new Promise((resolve,reject)=>{
        wx.chooseAddress({
            success:(res)=>{
                resolve(res)
            },
            fail:(err)=>{
                reject(err)
            }
        })
    })
}

// 打开设置
export const openSetting = ()=>{
    return new Promise((resolve,reject)=>{
        wx.openSetting({
            success:(res)=>{
                resolve(res)
            },
            fail:(err)=>{
                reject(err)
            }
        })
    })
}