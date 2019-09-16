// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingShow:false,
    totalCount:{},
    indexWord:"",
    btnList:[
      {
        btnName:"人口",
        bgColor:"#696969",
        btnNo:0,
      },
      {
        btnName: "联盟",
        bgColor:"#696969",
        btnNo: 1,
      },
      {
        btnName: "部落",
        bgColor:"#696969",
        btnNo: 2,
      },
      {
        btnName: "比例",
        bgColor:"#696969",
        btnNo: 3,
      },
    ],
    serverInfoOnShow: [],
    btnSelected:0,
    canvas_ids:[],
    

  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initBtns(0)
    
    /*
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'add',
      // 传给云函数的参数
      data: {
        a: 12,
        b: 19,
      },
      // 成功回调
      complete: res => {
        console.log('callFunction test result: ', res.result.sum)
      },
    });
    */
    const db = wx.cloud.database()
    //const _ = db.command
    db.collection('words').where({
      _id: "indexWord"
    })
    .get()
    .then(res => {
      console.log(res.data[0].content)
      this.setData({
        indexWord: res.data[0].content,
      })
    }),
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'getAllPopRecords',
      // 成功回调
      complete: res => {
        //console.log('callFunction test result: ', res.result)
        var results = res.result.data
        this.setData({
          loadingShow: true,
  
        })
        //console.log(results)
        console.log("共 "+results.length+" 条服务器population信息")
        this.initServerInfo(results)
        this.drawBar();
      },
    })
  },
  initServerInfo: function (results){
    var end = []
    var totalPop_alliance=0
    var totalPop_horde=0
    for(var i=0;i<results.length;i++){
      var server = {}
      var id = results[i]._id;
      var strs = id.split("_")
      var serverName = strs[0]
      server["serverName"] = serverName
      if (strs[1] == "alliance"){
        var alliancePop = results[i].population
        server["alliancePop"] = alliancePop
        server["hordePop"] = 0
        totalPop_alliance += alliancePop
      }else{
        var hordePop = results[i].population
        server["hordePop"] = hordePop
        server["alliancePop"] = 0
        totalPop_horde += hordePop
      }

      //加入结果集合
      var check = this.isServerExist(serverName, end)
      if(check != -1){
        if (end[check]["hordePop"] > 0){
          end[check]["alliancePop"] = alliancePop
        }else{
          end[check]["hordePop"] = hordePop
        }
       
      }else{
        end.push(server)
      }
    } 
    //计算总数情况
    console.log(totalPop_alliance)
    console.log(totalPop_horde)
    var totalPop = totalPop_alliance + totalPop_horde
    var share_alliance = (totalPop_alliance / totalPop * 100).toFixed(0)
    this.setData({
      totalCount:{
        share_alliance: share_alliance,
        share_horde: 100 - share_alliance,
        totalPop: totalPop,
      }
    })
    //console.log(this.data.totalCount)
    //绘制总人口图表
    this.drawTotalPopBar()

    var canvasList = []
    for(var idx=0;idx<end.length;idx++){
      end[idx].totalPop = end[idx].hordePop + end[idx].alliancePop
      if (end[idx].hordePop > 0){
        end[idx].rate = (end[idx].alliancePop / end[idx].hordePop).toFixed(1);
      } else{
        end[idx].rate = "99999"
      } 
      //初始化canvas_id list
      canvasList[idx] = idx+1
     
    }
    this.setData({
      canvas_ids : canvasList
    })
    //console.log("canvas_ids:")
    //console.log(this.data.canvas_ids)
    //找出总人口最多的数据，作为分母
    var maxPop = 0
    for(var it=0;it<end.length;it++){
      if(end[it].totalPop > maxPop){
        maxPop = end[it].totalPop
      }
    }
    //console.log("服务器最多的人口是: "+maxPop)

    var serverInfoList = []
    for(var z=0;z<end.length;z++){
      //console.log(end[z])
      var info = {}
      info["serverName"] = end[z]["serverName"]
      info["population"] = end[z]["totalPop"]
      info["bar_alliance"] = parseFloat((end[z]["alliancePop"] / maxPop).toFixed(2))
      info["bar_horde"] = parseFloat((end[z]["hordePop"] / maxPop).toFixed(2))
      //info["canvas_id"] = String(100 + z);
      //info["canvas_id"] = 100 + z
      info["rate"] = end[z].rate
      if (info["rate"] > 1 && info["rate"] < 100){
        //处理下 3.0的情况
        var numStr = info["rate"] +""
        var endWord = numStr.substr(numStr.length - 1, numStr.length)
        console.log("end:"+endWord)
        if (endWord == "0"){
          numStr = numStr.substr(0,numStr.length-2)
        }
        info["rateNum"] = numStr + ":1"

        //info["rateNum"] = info["rate"] + ":1"

      }else if (info["rate"] >= 100){
        info["rateNum"] = "100+:1" 
      } else if (info["rate"] < 1 && info["rate"] > 0.01){
        var x = (1 / info["rate"]).toFixed(1)
        //处理下 3.0的情况
        var numStr = x + ""
        var endWord = numStr.substr(numStr.length - 1, numStr.length)
        //console.log("end:" + endWord)
        if (endWord == "0") {
          numStr = numStr.substr(0, numStr.length - 2)
        }
        info["rateNum"] = "1:" + numStr
        //info["rateNum"] = "1:"+x
      }else if (info["rate"] < 0.01){
        info["rateNum"] = "1:100+"
      }else if (info["rate"] == 1){
        info["rateNum"] = "1:1" 
      }
      serverInfoList.push(info)
    }
    //console.log(serverInfoList)
    //默认按总人口排序
    for (var wai = 0; wai < serverInfoList.length - 1; wai++) {

      //2.内部循环 保证 了 最大值 被 移动到最后
      for (var wei = 0; wei < serverInfoList.length - 1; wei++) {

        if (serverInfoList[wei].population < serverInfoList[wei + 1].population) {
          // 使用 临时变量 的方式，交换两个 元素的值 -> 交换两个变量的值
          var sum = serverInfoList[wei];
          serverInfoList[wei] = serverInfoList[wei + 1];
          serverInfoList[wei + 1] = sum;
        }
        
      }
     
    }
    this.setData({
      serverInfoOnShow: serverInfoList,
    });
  },
  isServerExist:function(serverName,end){

    for(var j=0;j<end.length;j++){
      if(end[j].serverName == serverName){
        return j
      }
    }
    return -1
  },
  initBtns:function(no){
    var tmp=this.data.btnList
    for(var i=0;i<tmp.length;i++){
      if(i == no){
        tmp[i].bgColor = "#000000"
      }else{
        tmp[i].bgColor = "#696969"
      }
    }
    this.setData({
      btnList: tmp,
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
  clickBtn:function(e){
    console.log("click btn")
    var no = e.currentTarget.dataset.no;
    console.log(no);
    this.initBtns(no)
    if(no == 0){//人口
      if (this.data.btnSelected != 0){
         this.setData({
           btnSelected:0,
         })
        //按总人口排名
        var tmp = this.data.serverInfoOnShow
        //console.log(serverInfoList)
        for (var wai = 0; wai < tmp.length - 1; wai++) {

          //2.内部循环 保证 了 最大值 被 移动到最后
          for (var wei = 0; wei < tmp.length - 1; wei++) {

            if (tmp[wei].population < tmp[wei + 1].population) {
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

    }else if(no == 1){//联盟
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
           
            if (tmp[wei].bar_alliance < tmp[wei + 1].bar_alliance) {
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

    }else if(no == 2){//部落
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

            if (tmp[wei].bar_horde < tmp[wei + 1].bar_horde) {
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
      

    }else{//比例
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
  clearBars:function(){
    var onerpx_px = wx.getSystemInfoSync().windowWidth / 750;
    var H = 60 * onerpx_px
    var FullW = 525 * onerpx_px
    var r = 6 * onerpx_px
    for (var i = 0; i < this.data.serverInfoOnShow.length; i++) {
      var info = this.data.serverInfoOnShow[i];
      var canvasId = this.data.canvas_ids[i]
      var ctx = wx.createCanvasContext(canvasId)
      ctx.clearRect(0, 0, FullW, 60)
      ctx.draw()
    }
  },
  drawTotalPopBar:function(){
    var onerpx_px = wx.getSystemInfoSync().windowWidth / 750;
    var H = 60 * onerpx_px
    var FullW = 525 * onerpx_px
    var r = 6 * onerpx_px
    var ctx0 = wx.createCanvasContext('1000')
    var ctx1 = wx.createCanvasContext('1001')
    this.roundRect(ctx0, 0, 0, FullW * this.data.totalCount.share_alliance/100, H, r, '#0079FF')
    this.roundRect(ctx1, 0, 0, FullW * this.data.totalCount.share_horde/100, H, r, '#D50000')
    ctx0.draw();
    ctx1.draw();
  },
  drawBar: function () {
    console.log("draw bar")
    var onerpx_px = wx.getSystemInfoSync().windowWidth / 750;
    var H = 60 * onerpx_px
    var FullW = 525 * onerpx_px
    var r = 6 * onerpx_px
    for (var i = 0; i < this.data.serverInfoOnShow.length; i++) {
      var info = this.data.serverInfoOnShow[i];
      var canvasId = this.data.canvas_ids[i]
      var bar_alliance = info.bar_alliance;
      var bar_horde = info.bar_horde;
      if (i == 0) {
        console.log(info.serverName)
        console.log(info.bar_alliance)
        console.log(info.canvas_id)
        
      }
      var ctx = wx.createCanvasContext(canvasId)
      this.roundRect(ctx, 0, 0, FullW * bar_alliance, H,r, '#0079FF')
      this.roundRect(ctx, FullW * bar_alliance, 0, FullW * bar_horde, H, r, '#D50000')
      ctx.draw();
    }
  },
  selectServer:function(e){
    console.log("select:");
    var serverName = e.currentTarget.dataset.bean
    wx.navigateTo({

      url: '/pages/home/detail?serverName=' + serverName,

    })
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