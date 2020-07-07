// pages/classify/classify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'scopeFor': 'distance',
    showOther: '',
    conditionNavValue: 'distance',
    scopeNavValue: '500',
    classifyData: '',
    categoryId: '',
    order: 'asc',
    pages: 2,
    isRequesting: false,
    isLoadAll: false,
  },
  chooseCondition(event){
    let {type} = event.currentTarget.dataset;
    if(type === 'condition'){
      this.setData({
        showOther: type
      })
    }else{
      if(type === 'distance'){
        this.setData({
          showOther: type
        })
      }else{
        this.setData({
          showOther: type
        })
      }
    }
  },
  onTapValue(event){
    let {type} = event.currentTarget.dataset;
    let {value} = event.target.dataset;

    if(type === 'condition'){
      this.setData({
        conditionNavValue: value,
        showOther: '',
      })
      if(value === 'score'){
        this.setData({
          scopeNavValue: '10',
          scopeFor: 'score',
        })
      }else{
        this.setData({
          scopeNavValue: '500',
          scopeFor: 'distance',
        })
      }
    }else{
      this.setData({
        scopeNavValue: value,
        showOther: ''
      })
    }

    if(this.data.conditionNavValue === 'distance'){
      this.setData({
        order: 'asc',
        pages: 2
      })
    }else{
      this.setData({
        order: 'desc',
        pages: 2
      })
    }
    let {categoryId,order,conditionNavValue,scopeNavValue} = this.data;
    console.log(categoryId,order,conditionNavValue,scopeNavValue);
    wx.request({
      url: 'https://data.miaov.com//article/shoplist?page=1&rows=10',
      method: 'POST',
      data: {
        category_id: categoryId,
        order: order,
        distance: scopeNavValue,
        sort: conditionNavValue
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        console.log(res.data);
        if(res.data.length){
          this.setData({
            classifyData: res.data
          })
        }
      }
    })
    

  },
  // 下拉到底懒加载
  scrollBottom(){
    let {classifyData,pages,categoryId,order,conditionNavValue,scopeNavValue,isRequesting,isLoadAll} = this.data;
    if(isLoadAll || isRequesting){
      return;
    }
    this.setData({
      isRequesting: true
    })
    wx.request({
      url: `https://data.miaov.com//article/shoplist?page=${pages}&rows=10`,
      method: 'POST',
      data: {
        category_id: categoryId,
        orde: order,
        distance: scopeNavValue,
        sort: conditionNavValue
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        if(res.data.length){
          console.log(res.data);
          this.setData({
            classifyData: [...classifyData,...res.data],
            pages: pages+1,
            isRequesting: false
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      categoryId: options.id
    })
    let {categoryId,order,conditionNavValue,scopeNavValue} = this.data;
    console.log(categoryId,order,conditionNavValue,scopeNavValue);
    wx.request({
      url: 'https://data.miaov.com//article/shoplist?page=1&rows=10',
      method: 'POST',
      data: {
        category_id: categoryId,
        order: order,
        distance: scopeNavValue,
        sort: conditionNavValue
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        if(res.data.length){
          this.setData({
            classifyData: res.data
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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