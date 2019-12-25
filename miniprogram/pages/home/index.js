// pages/home/index.js
// 在页面中定义插屏广告
let interstitialAd = null
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingShow: false,
    pv: 0,
    indexWord: "",
    detailWords2:"",
    serversCount: "",
    openDays: "",
    isCoverShow: false,
    //isAdShow:true,//如果默认false canvas 错位！
    //heartsList:[],
    btnList: [
      {
        btnName: "物资",
        bgColor: "#696969",
        btnNo: 0,
      },
      {
        btnName: "联盟",
        bgColor: "#696969",
        btnNo: 1,
      },
      {
        btnName: "部落",
        bgColor: "#696969",
        btnNo: 2,
      },
      {
        btnName: "比例",
        bgColor: "#696969",
        btnNo: 3,
      },
    ],
    btnSelected: 0,
    serverInfoOnShow: [],
    canvas_ids: [],
    bottomImg0:"",
    bottomImg1: "",
    bottomItemSelected:-1,
  },
  countDays: function () {
    var s1 = '2019-08-26';
    s1 = new Date(s1.replace(/-/g, "/"));
    var s2 = new Date();//当前日期：2017-04-24
    var days = s2.getTime() - s1.getTime();
    var time = parseInt(days / (1000 * 60 * 60 * 24));
    return time
  },
  clickBottom2:function(){
    wx.navigateTo({
      url:'bat'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log("onload")

    
    var d = this.countDays()
    this.setData({
      openDays: this.countDays(),
    })

    const db = wx.cloud.database()

    db.collection('words')
      .get()
      .then(res => {

        //console.log(res.data)
        var indexWord = res.data[0].content
        var pv = res.data[1].pv
        var detailWords = res.data[5].content
        var detailWords2 = res.data[6].content
        console.log(detailWords)
        app.globalData.detailWords = detailWords
        //console.log(indexWord)
        console.log(pv)
        this.setData({
          pv: pv,
          indexWord: indexWord,
          detailWords2: detailWords2,
        })

      })

    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'updatePv',
      // 成功回调
      complete: res => {
        
        console.log(res)
      }
    })

    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-2c50af1d54821639'
      })
      interstitialAd.onLoad(() => {
        console.log('onLoad event emit')
      })
      //捕捉错误
      interstitialAd.onError(err => {
        console.log(err);
      })
    }

    
  },

  initBtns: function (no) {
    var tmp = this.data.btnList
    for (var i = 0; i < tmp.length; i++) {
      if (i == no) {
        tmp[i].bgColor = "#000000"
      } else {
        tmp[i].bgColor = "#696969"
      }
    }
    this.setData({
      btnList: tmp,
    })
  },
  initServerInfo: function (results) {

    var end = []
    var totalGoods_alliance = 0
    var totalGoods_horde = 0
    var canvasList = []

    for (var i = 0; i < results.length; i++) {

      var server = {}
      //console.log(results[i])
      totalGoods_alliance += results[i].goods_alliance
      totalGoods_horde += results[i].goods_horde
      server["serverName"] = results[i].serverName
      server["goods_alliance"] = results[i].goods_alliance
      server["goods_horde"] = results[i].goods_horde
      server["totalGoods"] = results[i].goods_alliance + results[i].goods_horde
      server["rate"] = (results[i].goods_alliance / results[i].goods_horde)
      var dotime = results[i].dotime
      server["dotime"] = results[i].dotime
      var isNew = false
      if (this.countDayInterval(dotime) <= 0) {
        isNew = true
      }
      server["isNew"] = isNew

      /*
      var hearts=this.data.heartsList
      for(var z=0;z<hearts.length;z++){
        //console.log(hearts[z])
        if (server["serverName"] == hearts[z]._id){
          server['heartNum'] = hearts[z].heartNum
          break
        }
      }
      */

      if (server["rate"] > 1 && server["rate"] < 10) {
        //处理下 3.0的情况
        server["rate"] = server["rate"].toFixed(1)
        var numStr = server["rate"] + ""
        var endWord = numStr.substr(numStr.length - 1, numStr.length)
        if (endWord == "0") {
          numStr = numStr.substr(0, numStr.length - 2)
        }
        server["rateNum"] = numStr + ":1"
      } else if (server["rate"] >= 10) {
        server["rateNum"] = "10+:1"
      } else if (server["rate"] < 1 && server["rate"] > 0.1) {

        server["rate"] = server["rate"].toFixed(2)
        var x = (1 / server["rate"]).toFixed(1)
        //处理下 3.0的情况
        var numStr = x + ""
        var endWord = numStr.substr(numStr.length - 1, numStr.length)
        //console.log("end:" + endWord)
        if (endWord == "0") {
          numStr = numStr.substr(0, numStr.length - 2)
        }
        server["rateNum"] = "1:" + numStr
      } else if (server["rate"] < 0.1) {
        server["rateNum"] = "1:10+"
      } else if (server["rate"] == 1) {
        server["rateNum"] = "1:1"
      }

      end.push(server)
      //计算显示出来的比例值
      canvasList[i] = i + 1
    }

    //找出总人口最多的数据，作为分母
    var maxGoods = 0
    for (var it = 0; it < end.length; it++) {
      if (end[it].totalGoods > maxGoods) {
        maxGoods = end[it].totalGoods
      }
    }
    //console.log("服务器最多的goods是: " + maxGoods)

    for (var z = 0; z < end.length; z++) {

      end[z]["bar_alliance"] = parseFloat((end[z]["goods_alliance"] / maxGoods).toFixed(2))
      end[z]["bar_horde"] = parseFloat((end[z]["goods_horde"] / maxGoods).toFixed(2))
    }


    //console.log("end:")
    //console.log(end)

    var totalGoods = totalGoods_alliance + totalGoods_horde
    var share_alliance = (totalGoods_alliance / totalGoods * 100).toFixed(0)

    this.setData({

      totalCount: {
        share_alliance: share_alliance,
        share_horde: 100 - share_alliance,
        totalGoods: totalGoods,
      },
      canvas_ids: canvasList,
    })

    //默认按总人口排序
    for (var wai = 0; wai < end.length - 1; wai++) {

      //2.内部循环 保证 了 最大值 被 移动到最后
      for (var wei = 0; wei < end.length - 1; wei++) {

        if (end[wei].totalGoods < end[wei + 1].totalGoods) {
          // 使用 临时变量 的方式，交换两个 元素的值 -> 交换两个变量的值
          var sum = end[wei];
          end[wei] = end[wei + 1];
          end[wei + 1] = sum;
        }

      }

    }


    //默认按总人口排序
    this.setData({
      serverInfoOnShow: end,
    });
    //console.log(this.data.canvas_ids)

  },
  selectServer: function (e) {
    var item = e.currentTarget.dataset.bean
    //console.log(item)
    var serverName = item.serverName
    var goods_alliance = item.goods_alliance
    var goods_horde = item.goods_horde
    //var dotime = item.dotime


    wx.navigateTo({

      //url: '/pages/home/newDetail?serverName=' + serverName + "&goodA=" + goods_alliance + "&goodH=" + goods_horde + "&dotime=" + dotime,
      url: '/pages/home/newDetail?serverName=' + serverName + "&goodA=" + goods_alliance + "&goodH=" + goods_horde,

    })

  },
  drawTotalBar: function () {
    var onerpx_px = wx.getSystemInfoSync().windowWidth / 750;
    var H = 60 * onerpx_px
    var FullW = 450 * onerpx_px
    var r = 6 * onerpx_px
    var ctx0 = wx.createCanvasContext('1000')
    var ctx1 = wx.createCanvasContext('1001')
    //console.log(this.data.totalCount.share_alliance)
    //console.log(this.data.totalCount.share_horde)
    this.roundRect(ctx0, 0, 0, FullW * this.data.totalCount.share_alliance / 100, H, r, '#0079FF')
    this.roundRect(ctx1, 0, 0, FullW * this.data.totalCount.share_horde / 100, H, r, '#D50000')
    ctx0.draw();
    ctx1.draw();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  loadAd: function () {
    console.log("load ad success")
    //this.loadBars();
  },
  loadAdError: function (e) {
    console.log("load ad error")
    console.log(e)
    //刷新当前页面的数据
    //getCurrentPages()[getCurrentPages().length - 1].onLoad()
  },
  loadClose: function () { },
  loadImg: function () {
    console.log("load img")
    
  },
  loadBars: function () {
    
    console.log("loadBars")
    wx.cloud.callFunction({
      // 需调用的云函数名
      //name: 'getAllPopRecords',
      name: 'getNewGoods',
      // 成功回调
      complete: res => {
        
        var results = res.result
        //console.log(results)
        console.log("共 " + results.length + " 条服务器goods信息")
        var that = this
        setTimeout(function () {

          that.initBtns(0)
          that.initServerInfo(results)
          that.drawTotalBar();
          that.drawBar();
          that.setData({
            loadingShow: true,
            serversCount: results.length,
            isCoverShow: true,
          })

        }, 400);
      }
    })
    /*
    wx.cloud.callFunction({
      // 需调用的云函数名
      //name: 'getAllPopRecords',
      name: 'getGoods',
      // 成功回调
      complete: res => {
        //console.log('callFunction test result: ', res.result)
        var results = res.result.data

        //console.log(results)
        //console.log("共 " + results.length + " 条服务器goods信息")
        var that = this
        setTimeout(function () {

          that.initBtns(0)
          that.initServerInfo(results)
          that.drawTotalBar();
          that.drawBar();
          that.setData({
            loadingShow: true,
            serversCount: results.length
          })

        }, 400);

      },
    })
    */
  },
  onReady: function () {

    console.log("onReady")
    this.loadBars();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow")
    this.setData({
      bottomItemSelected: 0,
      bottomImg0: "../../images/index1.png",
      bottomImg1: "../../images/special0.png",
    })
    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
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
    //console.log("draw bar")
    var onerpx_px = wx.getSystemInfoSync().windowWidth / 750;
    var H = 60 * onerpx_px
    //var FullW = 525 * onerpx_px
    var FullW = 450 * onerpx_px
    var r = 6 * onerpx_px
    for (var i = 0; i < this.data.serverInfoOnShow.length; i++) {
      var info = this.data.serverInfoOnShow[i];
      var canvasId = this.data.canvas_ids[i]
      var bar_alliance = info.bar_alliance;
      var bar_horde = info.bar_horde;
      //console.log(canvasId)
      //console.log(bar_alliance)
      var ctx = wx.createCanvasContext(canvasId)
      this.roundRect(ctx, 0, 0, FullW * bar_alliance, H, r, '#0079FF')

      this.roundRect(ctx, FullW * bar_alliance, 0, FullW * bar_horde, H, r, '#D50000')

      ctx.draw();
    }
  },
  clickBtn: function (e) {

    //console.log("click btn")
    var no = e.currentTarget.dataset.no;
    console.log(no);
    this.initBtns(no)
    if (no == 0) {//人口
      if (this.data.btnSelected != 0) {
        this.setData({
          btnSelected: 0,
        })
        //按总人口排名
        var tmp = this.data.serverInfoOnShow
        //console.log(serverInfoList)
        for (var wai = 0; wai < tmp.length - 1; wai++) {

          //2.内部循环 保证 了 最大值 被 移动到最后
          for (var wei = 0; wei < tmp.length - 1; wei++) {

            if (tmp[wei].totalGoods < tmp[wei + 1].totalGoods) {
              // 使用 临时变量 的方式，交换两个 元素的值 -> 交换两个变量的值
              var sum = tmp[wei];
              tmp[wei] = tmp[wei + 1];
              tmp[wei + 1] = sum;
            }

          }

        }

        this.setData({
          serverInfoOnShow: tmp,
        });
        this.drawBar()

      }

    } else if (no == 1) {//联盟
      if (this.data.btnSelected != 1) {
        this.setData({
          btnSelected: 1,
        })

        //this.clearBars();
        //按联盟人口排名
        var tmp = this.data.serverInfoOnShow
        //console.log(serverInfoList)
        for (var wai = 0; wai < tmp.length - 1; wai++) {

          //2.内部循环 保证 了 最大值 被 移动到最后
          for (var wei = 0; wei < tmp.length - 1; wei++) {

            if (tmp[wei].goods_alliance < tmp[wei + 1].goods_alliance) {
              // 使用 临时变量 的方式，交换两个 元素的值 -> 交换两个变量的值
              var sum = tmp[wei];
              tmp[wei] = tmp[wei + 1];
              tmp[wei + 1] = sum;
            }

          }

        }

        this.setData({
          serverInfoOnShow: tmp,
        });
        this.drawBar()
      }

    } else if (no == 2) {//部落
      if (this.data.btnSelected != 2) {
        this.setData({
          btnSelected: 2,
        })
        //按部落人口排名
        var tmp = this.data.serverInfoOnShow
        //console.log(serverInfoList)
        for (var wai = 0; wai < tmp.length - 1; wai++) {

          //2.内部循环 保证 了 最大值 被 移动到最后
          for (var wei = 0; wei < tmp.length - 1; wei++) {

            if (tmp[wei].goods_horde < tmp[wei + 1].goods_horde) {
              // 使用 临时变量 的方式，交换两个 元素的值 -> 交换两个变量的值
              var sum = tmp[wei];
              tmp[wei] = tmp[wei + 1];
              tmp[wei + 1] = sum;
            }

          }

        }

        this.setData({
          serverInfoOnShow: tmp,
        });
        this.drawBar()
      }


    } else {//比例
      if (this.data.btnSelected != 3) {
        this.setData({
          btnSelected: 3,
        })
        //按比例排名
        var tmp = this.data.serverInfoOnShow
        //console.log(serverInfoList)
        for (var wai = 0; wai < tmp.length - 1; wai++) {

          //2.内部循环 保证 了 最大值 被 移动到最后
          for (var wei = 0; wei < tmp.length - 1; wei++) {

            if (tmp[wei].rate < tmp[wei + 1].rate) {
              // 使用 临时变量 的方式，交换两个 元素的值 -> 交换两个变量的值
              var sum = tmp[wei];
              tmp[wei] = tmp[wei + 1];
              tmp[wei + 1] = sum;
            }

          }

        }

        this.setData({
          serverInfoOnShow: tmp,
        });
        this.drawBar()
      }
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
  countDayInterval: function (daystr1) {
    //var daystr1 = this.data.info_alliance.updateDay
    //var daystr2 = new Date()
    //console.log(daystr1)
    //console.log(daystr2)
    var t1 = new Date(daystr1)
    var t2 = new Date()
    //转成毫秒数，两个日期相减
    var ms = t2.getTime() - t1.getTime();
    //转换成天数
    var day = parseInt(ms / (1000 * 60 * 60 * 24));
    return day
  },
  clickBottom0:function(){

    console.log("click index")
    if (this.data.bottomItemSelected != 0){

      this.setData({
        bottomItemSelected:0,
        bottomImg0: "../../images/index1.png",
        bottomImg1: "../../images/special0.png",
      })
    }
  },
  clickBottom1: function () {

    console.log("click special")
    if (this.data.bottomItemSelected != 1) {

      this.setData({
        bottomItemSelected: 1,
        bottomImg0: "../../images/index0.png",
        bottomImg1: "../../images/special1.png",
      })

      wx.navigateTo({

        url: '/pages/home/newSpecial',

      })
    }


  }
})