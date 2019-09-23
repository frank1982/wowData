// pages/home/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mydata:[
      {
        name:"frank",
        value:100,
      },{
        name: "jack",
        value: 50,
      }
    ],
    canvas_ids:[100,101]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.drawBar();
  
  },
  change:function(){
    this.setData({
      mydata: [
        {
          name: "neo",
          value: 10,

        }, {
          name: "abe",
          value: 20,

        }
      ]
    })
    this.drawBar();
  },
  click:function(e){
    console.log("click")
    this.change();
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

  },
  drawBar: function () {
    console.log("draw bar")
    var onerpx_px = wx.getSystemInfoSync().windowWidth / 750;
    var H = 60 * onerpx_px
    var FullW = 500 * onerpx_px
    var r = 6 * onerpx_px
    for (var i = 0; i < this.data.mydata.length; i++) {
      var info = this.data.mydata[i];
      var canvasId = this.data.canvas_ids[i]
      var value = info.value
      var name = info.name

      var ctx = wx.createCanvasContext(canvasId)
      this.roundRect(ctx, 0, 0, FullW * value/100, H, r, '#0079FF')
      ctx.draw();
    }
  },
  roundRect(ctx, x, y, w, h, r, c = '#fff') {
    if (w < 2 * r) { r = w / 2; }
    if (h < 2 * r) { r = h / 2; }

    ctx.beginPath();
    ctx.fillStyle = c;

    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.lineTo(x + w, y + r);

    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
    ctx.lineTo(x + w, y + h - r);
    ctx.lineTo(x + w - r, y + h);

    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
    ctx.lineTo(x + r, y + h);
    ctx.lineTo(x, y + h - r);

    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x + r, y);

    ctx.fill();
    ctx.closePath();
  },
})