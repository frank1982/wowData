
const app = getApp();
let chart = null;

function initChart(canvas, width, height, F2) {

  var pages = getCurrentPages();
  var currPage = pages[pages.length - 1]
  var data = currPage.data.myData
  
  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  chart.source(data);
  chart.tooltip({
    custom: true, // 自定义 tooltip 内容框
    onChange(obj) {
      const legend = chart.get('legendController').legends.top[0];
      const tooltipItems = obj.items;
      const legendItems = legend.items;
      const map = {};
      legendItems.map(item => {
        map[item.name] = Object.assign({}, item);
      });
      tooltipItems.map(item => {
        const { name, value } = item;
        if (map[name]) {
          map[name].value = value;
        }
      });
      legend.setItems(Object.values(map));
    },
    onHide() {
      const legend = chart.get('legendController').legends.top[0];
      legend.setItems(chart.getLegendItems().country);
    }
  });

  chart.interval().position('日期*物资')
    .color('camp', ['#0079FF', '#D50000'])
    .adjust({
      type: 'dodge',
      marginRatio: 0.05 // 设置分组间柱子的间距
    });
  chart.render();
  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    detailWords:"",
    goods_alliance:0,
    goods_horde:0,
    detailInfoList:[],
    //opts: { lazyLoad: true }, 
    myData:[],
    serverName:""
  },

  
  onLoad: function (options) {
    
    console.log("options+++++++++++", options)
    var serverName = options.serverName
    var dotime = options.dotime
    var goodsA = options.goodA
    var goodsH = options.goodH

    wx.setNavigationBarTitle({
      title: serverName
    })

    console.log(app.globalData.detailWords)
    this.setData({
      serverName: serverName,
      detailWords:app.globalData.detailWords,
      goods_alliance: goodsA,
      goods_horde: goodsH,
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
 
  onReady: function () {
    //取服务端数据

    var that = this
    
    setTimeout(function () {

      var serverName = that.data.serverName
      const db = wx.cloud.database()
      db.collection('newGoods').doc(serverName)
        //.skip(10) // 跳过结果集中的前 10 条，从第 11 条开始返回
        //.limit(10) // 限制返回数量为 10 条
        .get()
        .then(res => {

          var result = res.data.data.slice(0, 10)
          //console.log("result:")
          //console.log(result)
          var list = []
          for (var i = 0; i < result.length; i++) {

            var tmp = {}
            tmp["alliance"] = result[i].alliance
            tmp["horde"] = result[i].horde

            var dayStr = result[i].updateTime
            var upday = ""
            if (that.countDayInterval(dayStr) > 0) {
              upday = that.countDayInterval(dayStr) + "天前"
            } else {
              upday = "1天内"
            }
            tmp["dayStr"] = dayStr
            tmp["upday"] = upday
            var dd = dayStr.substring(8, 10)
            var mmstr = dayStr.substring(4, 7)
            var mm = that.GetMonth(mmstr)
            var timeStr = mm + "/" + dd
            tmp["timeStr"] = timeStr

            list.push(tmp)
          }
          that.setData({
            detailInfoList: list,

          })
          //准备图表数据
          var chartList = []
          var allianceList = []
          var hordeList = []
          for (var j = 0; j < list.length; j++) {

            var tmpAlliance = {}
            tmpAlliance["camp"] = "联盟"
            tmpAlliance["日期"] = list[j]["timeStr"]
            tmpAlliance["物资"] = list[j]["alliance"]

            allianceList.push(tmpAlliance)
          }
          allianceList.reverse()
          for (var j = 0; j < list.length; j++) {

            var tmpHorde = {}
            tmpHorde["camp"] = "部落"
            tmpHorde["日期"] = list[j]["timeStr"]
            tmpHorde["物资"] = list[j]["horde"]

            hordeList.push(tmpHorde)
          }
          hordeList.reverse()
          chartList = allianceList.concat(hordeList)

          that.setData({

            myData: chartList
          })
          that.ecComponent = that.selectComponent('#mycanvas');
          that.ecComponent.init(initChart);


        })


    }, 400)
   
  },
  selectInfo: function (e) {

    var item = e.currentTarget.dataset.bean
    console.log(item)
    var serverName = this.data.serverName
    wx.navigateTo({
      url: '/pages/home/newInfo?serverName=' + serverName+"&updateTime="+item.dayStr,

    })
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
  GetMonth: function (monthName) {
    var monthList = ["Jua", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (var i = 0; i <= monthList.length; i++) {
      if (monthList[i] == monthName) {

        var monthNum = i + 1
        if (monthNum < 10) {
          monthNum = "0" + monthNum
        }
        return monthNum
      }
    }
  },
  countDayInterval: function (daystr1) {
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
  
})