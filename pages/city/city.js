// pages/city/city.js
const QQMapWX = require('../../common/js/qqmap-wx-jssdk.min');
let qqmapsdk;
let cityData = require('./cityData');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityData: {},
    scrollCityId: '',
    moveCityListClienY: '',
    currentCity: ''
  },
  // 城市侧边栏(点击)
  clickToCity(event){
    if(event.target.dataset.type !== "fastCheck") return;
    this.setData({
      scrollCityId: `scroll-city-${event.target.id}`
    })
  },
  // 城市侧边栏(滚动)
  moveToCity(event){
    let clientY = event.touches[0].clientY; // 获取第一根手指按下的clientY
    console.log(clientY);
    let toItem = this.data.moveCityListClienY.find(item => {
      return clientY > item.top && clientY < item.bottom;
    })
    if(toItem){
      this.setData({
        scrollCityId: `scroll-city-${toItem.id}`
      })
    }
  },
  // 选择当前城市
  toCurrentCity(event){
    let {name} = event.target.dataset;
    if(name){
      wx.setStorageSync('currentCity',name); // 异步存储数据
      wx.navigateBack(); // 相当于点击了页面左上角的返回上一页按钮
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cityData: cityData
    });
    qqmapsdk = new QQMapWX({
      key: 'UWPBZ-2ZF3P-ZR2DU-LOYAS-3YHDH-FSFNU'
    })
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        if(res){
          let {latitude,longitude} = res;
          qqmapsdk.reverseGeocoder({
            location: {
              latitude,
              longitude
            },
            success: (res) => {
              if(res){
                this.setData({
                  currentCity: res.result.address_component.city
                })
              }
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let query = wx.createSelectorQuery();
    query.selectAll('.fastCheck').boundingClientRect(rects => {
      this.setData({
        moveCityListClienY: rects
      })
    }).exec();

    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})