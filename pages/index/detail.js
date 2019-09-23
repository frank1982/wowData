// pages/home/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverName:"",
    txtColor:{
      gray: "#696969",
      blue: '#0079FF',
      red: '#D50000',
      campAllianceTxtColor: "#696969",
      campHordeTxtColor: "#696969",
      raceNameTxtColor: "#696969",
    },
    raceOnShow:[],
    professionOnShow:[],
    infoOnShow:{},
    picOnShow:{},
    updateIntervalDays:"--",
    showView:false,
    showAlert:false,
    name0:"",
    name1:"",
    info_alliance:{},
    info_horde:{},
    canvasList_race:[100,101,102,103],
    canvasList_prof:[400,401,402,403,404,405,406,407]
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options+++++++++++", options)
    this.setData({
      serverName: options.serverName
    })
    wx.setNavigationBarTitle({
      title: options.serverName
    })

    //获取服务端信息
    var name0 = options.serverName + "_alliance"
    var name1 = options.serverName + "_horde"
    this.setData({
      name0: name0,
      name1: name1,
    })

    const db = wx.cloud.database()
    const _ = db.command
    //var that = this //闭包
    db.collection('detail').where({
      _id: _.in([name0, name1])
    })
    .get()
    .then(res => {
      // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
      console.log(res.data)
      if (res.data.length == 0){//均为空
        //没有数据
        this.setData({
          showAlert:true,
        })
      } else if(res.data.length == 1){//一方为空
        //判断哪一方为空
      
        if (res.data[0]._id.indexOf("alliance") != -1){
          console.log("联盟有数据")
          this.setData({
            info_alliance:{
              updateDay: res.data[0].dotime,
              pop: res.data[0].population,
              race_humanShare: res.data[0].human,
              race_elfShare: res.data[0].elf,
              race_dwarfShare: res.data[0].dwarf,
              race_gnomeShare: res.data[0].gnome,

              prof_druidShare: res.data[0].druid,
              prof_hunterShare: res.data[0].hunter,
              prof_priestShare: res.data[0].priest,
              prof_mageShare: res.data[0].mage,
              prof_palShare: res.data[0].pal,
              prof_rogueShare: res.data[0].rogue,
              prof_warlockShare: res.data[0].warlock,
              prof_warriorShare: res.data[0].warrior
            }
          })
          //显示联盟数据
          this.initAlliance()

        }else{
          console.log("部落有数据")
          this.setData({
            info_horde: {
              updateDay: res.data[0].dotime,
              pop: res.data[0].population,
              race_orcShare: res.data[0].orc,
              race_undeadShare: res.data[0].undead,
              race_trollShare: res.data[0].troll,
              race_taurenShare: res.data[0].tauren,

              prof_druidShare: res.data[0].druid,
              prof_hunterShare: res.data[0].hunter,
              prof_priestShare: res.data[0].priest,
              prof_mageShare: res.data[0].mage,
              prof_shamanShare: res.data[0].shaman,
              prof_rogueShare: res.data[0].rogue,
              prof_warlockShare: res.data[0].warlock,
              prof_warriorShare: res.data[0].warrior
            }
          })
          this.initHorde()
        }
       
      }else{//都有数据，默认显示联盟
        //初始化数据
        for(var idex=0;idex<=1;idex++){
            if (res.data[idex]._id.indexOf("alliance") != -1) {//联盟           
            this.setData({
              info_alliance: {
                updateDay: res.data[idex].dotime,
                pop: res.data[idex].population,
                race_humanShare: res.data[idex].human,
                race_elfShare: res.data[idex].elf,
                race_dwarfShare: res.data[idex].dwarf,
                race_gnomeShare: res.data[idex].gnome,

                prof_druidShare: res.data[idex].druid,
                prof_hunterShare: res.data[idex].hunter,
                prof_priestShare: res.data[idex].priest,
                prof_mageShare: res.data[idex].mage,
                prof_palShare: res.data[idex].pal,
                prof_rogueShare: res.data[idex].rogue,
                prof_warlockShare: res.data[idex].warlock,
                prof_warriorShare: res.data[idex].warrior
              }
            })

          }else{//部落
            this.setData({
              info_horde: {
                updateDay: res.data[idex].dotime,
                pop: res.data[idex].population,
                race_orcShare: res.data[idex].orc,
                race_undeadShare: res.data[idex].undead,
                race_trollShare: res.data[idex].troll,
                race_taurenShare: res.data[idex].tauren,

                prof_druidShare: res.data[idex].druid,
                prof_hunterShare: res.data[idex].hunter,
                prof_priestShare: res.data[idex].priest,
                prof_mageShare: res.data[idex].mage,
                prof_shamanShare: res.data[idex].shaman,
                prof_rogueShare: res.data[idex].rogue,
                prof_warlockShare: res.data[idex].warlock,
                prof_warriorShare: res.data[idex].warrior
              }
            })
            
          }
        }
        //显示联盟数据
        this.initAlliance()
      }

      //console.log(this.data.info_alliance)
    })
   
    //this.initAlliance();
 
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
  chooseAlliance:function(e){
    console.log("alliance");
    //判断空字典
    if (JSON.stringify(this.data.info_alliance) != '{}'){
      console.log(this.data.info_alliance)
      this.initAlliance();
    }else{
      console.log("联盟数据为空")
      this.setData({
        showView:false,
        showAlert: true,
        txtColor: {
            gray: "#696969",
            blue: '#0079FF',
            red: '#D50000',
            campAllianceTxtColor: '#0079FF',
            campHordeTxtColor: "#696969",
            raceNameTxtColor: "#0079FF",
        },
      })
    }
   
  },
  chooseHorde: function (e) {
    console.log("horde");
    //判断空字典
    if (JSON.stringify(this.data.info_horde) != '{}') {
      //console.log(this.data.info_horde)
      this.initHorde();
    } else {
      
      console.log("部落数据为空")
      this.setData({
        showView: false,
        showAlert: true,
        txtColor: {
          gray: "#696969",
          blue: '#0079FF',
          red: '#D50000',
          campAllianceTxtColor: '#696969',
          campHordeTxtColor: "#D50000",
          raceNameTxtColor: "#D50000",
        },
      })
      
      //this.initNullHorde();
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
  drawBar: function () {
    var onerpx_px = wx.getSystemInfoSync().windowWidth / 750;
    var H = 60 * onerpx_px
    var FullW = 390 * onerpx_px
    var r = 6 * onerpx_px
    var color = this.data.txtColor.raceNameTxtColor
    for (var i = 0; i < this.data.raceOnShow.length; i++) {
      var info = this.data.raceOnShow[i];
      //var canvasId = info.canvas_id;
      var canvasId = this.data.canvasList_race[i]
      var bar = info.popShare/100;
      var ctx = wx.createCanvasContext(canvasId)
      ctx.clearRect(0, 0, FullW, 60)
      this.roundRect(ctx, 0, 0, FullW * bar, H, r, color)
      ctx.draw();
    }
    for (var i = 0; i < this.data.professionOnShow.length; i++) {
      var info = this.data.professionOnShow[i];
      //var canvasId = info.canvas_id;
      var canvasId = this.data.canvasList_prof[i]
      //canvasList_prof
      console.log("canvasId")
      console.log(canvasId)
      var bar = info.popShare / 100;
      var ctx = wx.createCanvasContext(canvasId)
      //ctx.clearRect(0, 0, FullW, 60)
      this.roundRect(ctx, 0, 0, FullW * bar, H, r, color)
      ctx.draw();
    }
  },
  GetMon:function(monthName){
    var monthList = [ "Jua", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (var i = 0; i <= monthList.length;i++){
      if (monthList[i]==monthName){
        
        var monthNum=i+1
        if (monthNum<10){
          monthNum = "0" + monthNum
        }
        return monthNum
      } 
    }                        
},

  covertDate:function(timeStr){
    //Sun Sep 15 2019 09:31:09 GMT+0800 (CST)
    var dd = timeStr.substring(8, 10)
    var yy = timeStr.substring(11, 15)
    var mmstr = timeStr.substring(4, 7)
    var mm = this.GetMon(mmstr)
    return yy+mm+dd
  },
  
  initHorde:function(){
    console.log("load horde data")
    this.setData({
      txtColor: {
        gray: "#696969",
        blue: '#0079FF',
        red: '#D50000',
        campAllianceTxtColor: '#696969',
        campHordeTxtColor: "#D50000",
        raceNameTxtColor: "#D50000",
      },
      showView: true,
      showAlert:false,
    })
    //console.log(this.data.info_horde)
    var interval = this.countDayInterval()
    var updateDay = this.data.info_horde.updateDay
    var newformat = this.covertDate(updateDay)
    var interval = this.countDayInterval(updateDay) 
    console.log("interval:")
    console.log(interval)
    var intervalStr = (interval == 0) ? "今天" : interval + "天前"
    console.log(newformat)
    var src = "cloud://wow-d7eecd.776f-wow-d7eecd/images/" + newformat + "_" + this.data.name1 + ".png"
    
    //var tmpRaceOnShow =[]
    //tmpRaceOnShow = this.sort(tmpRaceOnShow)
    //var tmpProfOnShow = []
    
    //tmpProfOnShow = this.sort(tmpProfOnShow)

    this.setData({
      infoOnShow: {
        pop: this.data.info_horde.pop,
        updateIntervalDays: intervalStr,
      },
      raceOnShow: [
        {
          raceName: "亡灵",
          popShare: this.data.info_horde.race_undeadShare,//%
          //canvas_id: 200,
        },
        {
          raceName: "巨魔",
          popShare: this.data.info_horde.race_trollShare,//%
          //canvas_id: 201,
        },
        {
          raceName: "牛头人",
          popShare: this.data.info_horde.race_taurenShare,//%
          //canvas_id: 202,
        },
        {
          raceName: "兽人",
          popShare: this.data.info_horde.race_orcShare,//%
          canvas_id: 203,
        }],
      professionOnShow: [
        {
          profName: "法师",
          popShare: this.data.info_horde.prof_mageShare,//%
          ///canvas_id: 300,
        },
        {
          profName: "猎人",
          popShare: this.data.info_horde.prof_hunterShare,//%
          //canvas_id: 301,
        },
        {
          profName: "潜行者",
          popShare: this.data.info_horde.prof_rogueShare,//%
          //canvas_id: 302,
        },
        {
          profName: "战士",
          popShare: this.data.info_horde.prof_warriorShare,//%
          canvas_id: 303,
        },
        {
          profName: "萨满",
          popShare: this.data.info_horde.prof_shamanShare,//%
          //canvas_id: 304,
        },
        {
          profName: "牧师",
          popShare: this.data.info_horde.prof_priestShare,//%
          //canvas_id: 305,
        },
        {
          profName: "术士",
          popShare: this.data.info_horde.prof_warlockShare,//%
          //canvas_id: 306,
        },
        {
          profName: "德鲁伊",
          popShare: this.data.info_horde.prof_druidShare,//%
          //canvas_id: 307,
        },
      ],
      picOnShow: {
        picSrc: src,
        updateTime: this.data.info_horde.updateDay
      }
    })
    this.drawBar()

  },
  /*
  sort:function(list){

    //sort by popshare
    console.log(list)
    var result = list
    for (var z1 = 0; z1 < result.length - 1;z1++) {

      //2.内部循环 保证 了 最大值 被 移动到最后
      for (var z2 = 0; z2 < result.length - 1;z2++) {

        if (result[z2].popShare < result[z2 + 1].popShare) {
          // 使用 临时变量 的方式，交换两个 元素的值 -> 交换两个变量的值
          console.log("change")
          var sum = result[z2];
          result[z2] = result[z2+1];
          result[z2 + 1] = sum;
        }
      }
      
    }
    console.log(result)
    return result
  },
  */
  initAlliance:function(){

    console.log("load alliance data")
    this.setData({
      txtColor: {
        gray: "#696969",
        blue: '#0079FF',
        red: '#D50000',
        campAllianceTxtColor: '#0079FF',
        campHordeTxtColor: "#696969",
        raceNameTxtColor: "#0079FF",
      },
      showView: true,
      showAlert: false,
    })
    console.log("this.data.info_alliance:")
    console.log(this.data.info_alliance)
    var updateDay = this.data.info_alliance.updateDay
    var interval = this.countDayInterval(updateDay) 
    var intervalStr = (interval == 0) ? "今天" : interval + "天前"
    var newformat = this.covertDate(updateDay)
    console.log(newformat)
    var src = "cloud://wow-d7eecd.776f-wow-d7eecd/images/" + newformat+"_"+this.data.name0+".png"
    console.log(src)
    //"cloud://wow-d7eecd.776f-wow-d7eecd/images/20190913_狮心_联盟.png"
    //var tmpRaceOnShow=[]
    //tmpRaceOnShow = this.sort(tmpRaceOnShow)
    //var tmpProfOnShow = []
    //tmpProfOnShow = this.sort(tmpProfOnShow)  
    this.setData({
      infoOnShow:{
        pop: this.data.info_alliance.pop,
        updateIntervalDays: intervalStr,
      },
      raceOnShow: [
        {
          raceName: "人类",
          popShare: this.data.info_alliance.race_humanShare,//%
          //canvas_id: 200,
        },
        {
          raceName: "精灵",
          popShare: this.data.info_alliance.race_elfShare,//%
          canvas_id: 201,
        },
        {
          raceName: "侏儒",
          popShare: this.data.info_alliance.race_gnomeShare,//%
          //canvas_id: 202,
        },
        {
          raceName: "矮人",
          popShare: this.data.info_alliance.race_dwarfShare,//%
          //canvas_id: 203,
        },
      ],
      professionOnShow: [
        {
          profName: "法师",
          popShare: this.data.info_alliance.prof_mageShare,//%
          //canvas_id: 300,
        },
        {
          profName: "猎人",
          popShare: this.data.info_alliance.prof_hunterShare,//%
          //canvas_id: 301,
        },
        {
          profName: "潜行者",
          popShare: this.data.info_alliance.prof_rogueShare,//%
          //canvas_id: 302,
        },
        {
          profName: "战士",
          popShare: this.data.info_alliance.prof_warriorShare,//%
          //canvas_id: 303,
        },
        {
          profName: "骑士",
          popShare: this.data.info_alliance.prof_palShare,//%
          //canvas_id: 304,
        },
        {
          profName: "牧师",
          popShare: this.data.info_alliance.prof_priestShare,//%
          //canvas_id: 305,
        },
        {
          profName: "术士",
          popShare: this.data.info_alliance.prof_warlockShare,//%
          //canvas_id: 306,
        },
        {
          profName: "德鲁伊",
          popShare: this.data.info_alliance.prof_druidShare,//%
          //canvas_id: 307,
        },
      ],
      picOnShow:{
        picSrc:src,
        updateTime: this.data.info_alliance.updateDay
      }
    })
    this.drawBar()
  },
  
  countDayInterval: function (daystr1){
    //var daystr1 = this.data.info_alliance.updateDay
    var daystr2 = new Date()
    console.log(daystr1)
    console.log(daystr2)
    var t1 = new Date(daystr1)
    var t2 = new Date()
    //转成毫秒数，两个日期相减
    var ms = t2.getTime() - t1.getTime();
    //转换成天数
    var day = parseInt(ms / (1000 * 60 * 60 * 24));
    return day
  },
    /*
    
    this.setData({
      
      
      updateIntervalDays: "130天前"
    }),
    
    
    */
  

  lookImg:function(e){
    console.log("look img");
    var src = this.data.picOnShow.picSrc;//获取data-src
    console.log(src);
    //"../../images/1.png"
    var imgList = [src+""];//获取
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  }
})