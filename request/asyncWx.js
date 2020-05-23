

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

// promise形式 showModal
export const showModal = ({content})=>{
    return new Promise((resolve,reject)=>{
        wx.showModal({
            title:'提示',
            content:content,
            success:(res)=>{
              resolve(res)
            },
            fail:(err)=>{
            reject(res)
            }
          })
    })
}

// promise形式 showToast
export const showToast = ({title})=>{
    return new Promise((resolve,reject)=>{
        wx.showToast({
            title:title,
            icon:'none',
            success:(res)=>{
              resolve(res)
            },
            fail:(err)=>{
            reject(res)
            }
          })
    })
}



// promise形式 login

export const login = ()=>{
    return new Promise((resolve,reject)=>{
        wx.login({
            timeout:10000,
            success:(res)=>{
                resolve(res)
            },
            fail:(err)=>{
                reject(err)
            }
        })
    })
}

// promise形式 小程序支付 requestPayment

export const requestPayment = (pay)=>{
    return new Promise((resolve,reject)=>{
        wx.requestPayment({
            ...pay,
            success:(res)=>{
                resolve(res)
            },
            fail:(err)=>{
                reject(err)
            }
        })
    })
}