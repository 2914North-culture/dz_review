//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    goodsLike: [],
    pages: 2,
    isRequesting:false,
    isLoadAll:false,
    currentCity: '未定位'
  },
  onLoad: function () {
    wx.request({
      url: 'https://data.miaov.com/article/shoplist?page=1&rows=10',
      method: 'POST',
      success: (res) => {
        if(res.data.length){
          // for(let i = 0; i < res.data.length; i++){
          //   res.data[i].customMark = 'home';
          // }
          this.setData({
            goodsLike: [...res.data]
          })
        }
      }
    })
  },
  // 生命周期 -- 页面显示
  onShow(){
    let backCurrentCity = wx.getStorageSync('currentCity');
    if(backCurrentCity){
      this.setData({
        currentCity: backCurrentCity
      })
    }
  },
  scrollBottom:function(){
    let {pages,goodsLike,isRequesting,isLoadAll} = this.data;
    if(isLoadAll || isRequesting){
      return;
    }
    this.setData({
      isRequesting:true
    })
    wx.request({
      url: `https://data.miaov.com/article/shoplist?page=${pages}&rows=10`,
      method: 'POST',
      success: (res) => {
        if(res.data.length){
          // for(let i = 0; i < res.data.length; i++){
          //   res.data[i].customMark = 'home';
          // }
          this.setData({
            goodsLike: [...goodsLike,...res.data],
            pages: pages+1,
            isRequesting:false
          })
        }
        if(res.data.error){
          this.setData({
            isRequesting: false,
            isLoadAll: true
          })
        }
      }
    })
  }
})
