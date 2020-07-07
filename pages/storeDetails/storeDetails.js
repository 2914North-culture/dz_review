// pages/storeDetails/storeDetails.js
// 引入SDK核心类
let QQMapWX = require('../../common/js/qqmap-wx-jssdk.min');
let qqmapsdk;
Page({
  // 页面的初始数据
  data: {
    storeId: '',
    storeInfo: {},
    storeLocation: '',
    distance: '',
    time: '',
    hasLocationAuth: '' // 验证身份 确定是否成功授权
  },
  // 统一星级评分数值
  dealScore(res){
    let scoreDo = res.data.info.score;
    let power = '';
    let divisor = '';
    
    const rel = /^-?\d*\.\d+$/;
    if(scoreDo.length == 1 || rel.test(scoreDo)){
      scoreDo = scoreDo * 10;
      res.data.info.score = scoreDo;
      return;
    }else if(scoreDo == 10){
      res.data.info.score = scoreDo * 10;
      return;
    }else{
      power = (scoreDo.length - 1); // 2
      divisor = Math.pow(10,power);
      scoreDo = (scoreDo / divisor) * 10;
      res.data.info.score = scoreDo;
    }
  },
  // 处理位置信息
  _dealLocation(storeLocation){
    wx.getLocation({
      type: 'gcj02', // 坐标系采用gcj02坐标系
      success: (res) => {
        this.setData({
          hasLocationAuth: true
        })
        let userLocation = {
          latitude: res.latitude,
          longitude: res.longitude
        }

         // 计算用户和商铺之间的距离
        qqmapsdk.calculateDistance({
          // mode: 'walking', 默认就是步行
          from: userLocation,
          to: [storeLocation],
          success: (res) => {
            this.setData({
              distance: res.result.elements[0].distance
            })
            let oDistance = this.data.distance;
            this._dealTime(oDistance);
          },
          fail: (err) => {
            console.log(err);
            if(err.errMsg === 'getLocation:fail auth deny'){
              this.setData({
                hasLocationAuth: false
              })
            }
          }
        })

      }
    })
  },
  // 计算抵达目的地所需时长
  _dealTime(distance){
    // 距离： 146791(m)
    // 平均一个人一分钟步行100m
    // let timeMinutes = parseInt(distance / 100); // 1467(分钟)
    let timeMinutes = 1467;
    let timeHours = '';
    let timeDays = '';
    let timeWeeks = '';
    let timeResult = '';
    if(timeMinutes >= 60){
      timeHours = timeMinutes / 60;
      timeMinutes = timeMinutes % 60;
      if(timeHours >= 24){
        timeDays = timeHours / 24;
        timeHours = timeHours % 24;
        if(timeDays >= 7){
          timeWeeks = timeDays / 7;
          timeDays = timeDays % 7;
        }
      }
    }
    if(timeMinutes > 0){
      timeResult = parseInt(timeMinutes) + '分';
    }
    if(timeHours > 0){
      timeResult = parseInt(timeHours) + '时' + timeResult;
    }
    if(timeDays > 0){
      timeResult = parseInt(timeDays) + '天' + timeResult;
    }
    if(timeWeeks > 0){
      timeResult = parseInt(timeWeeks) + '周' + timeResult;
    }

    this.setData({
      time: timeResult 
    })
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    this.setData({
      storeId: options.id
    })
    wx.request({
      url: `https://data.miaov.com/article/detail?id=${this.data.storeId}`,
      method: 'GET',
      success: (res) => {
        //处理星级评分
        this.dealScore(res);
        console.log(res);
        this.setData({
          storeInfo: res.data.info
        });

        //==============================以下代码为商家位置处理==============================
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
          key: 'UWPBZ-2ZF3P-ZR2DU-LOYAS-3YHDH-FSFNU'
        });
        // 获取当前商铺经纬度
        let storeLocation = {
          latitude: 30.05,
          longitude: 103.83
        }
        this.setData({
          storeLocation: storeLocation
        })

        qqmapsdk.search({
          // keyword: '学校',
          location: storeLocation
        });
        this._dealLocation(storeLocation);
      }
    })

  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },

  // 生命周期函数--监听页面显示
  onShow: function () {
    this._dealLocation(this.data.storeLocation);
  },

  // 生命周期函数--监听页面隐藏
  onHide: function () {

  },

  // 生命周期函数--监听页面卸载
  onUnload: function () {

  },

  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {

  },

  // 页面上拉触底事件的处理函数
  onReachBottom: function () {

  },

  // 用户点击右上角分享
  onShareAppMessage: function () {

  }
})