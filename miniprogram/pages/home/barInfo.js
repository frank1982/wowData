
// 在页面中定义插屏广告
let interstitialAd = null

const app = getApp();
const F2 = require('@antv/wx-f2');
 
let chart = null;
 
function initChart(canvas, width, height) { // 使用 F2 绘制图表
  
  var pages = getCurrentPages();
  var currPage = pages[pages.length - 1]
  //var source = currPage.data.myData
  const map =currPage.data.map
  const data = currPage.data.mydata
/*
 const map = {
  芳华: '40%',
  妖猫传: '20%',
  机器之血: '18%',
  心理罪: '15%',
  寻梦环游记: '5%',
  其他: '2%'
};
const data = [{
  name: '芳华',
  percent: 0.4,
  a: '1'
}, {
  name: '妖猫传',
  percent: 0.2,
  a: '1'
}, {
  name: '机器之血',
  percent: 0.18,
  a: '1'
}, {
  name: '心理罪',
  percent: 0.15,
  a: '1'
}, {
  name: '寻梦环游记',
  percent: 0.05,
  a: '1'
}, {
  name: '其他',
  percent: 0.02,
  a: '1'
}];
*/
const chart = new F2.Chart({
  //id: 'container',
  //pixelRatio: window.devicePixelRatio
  el: canvas,
  width,
  height
});
chart.source(data, {
  percent: {
    formatter: function formatter(val) {
      return val * 100 + '%';
    }
  }
});
chart.legend({
  position: 'left',
  itemFormatter: function itemFormatter(val) {
    return val + '  ' + map[val];
  }
});
chart.tooltip(false);
chart.coord('polar', {
  transposed: true,
  radius: 0.85
});
chart.axis(false);
chart.interval()
  .position('a*percent')
  .color('name', [ '#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0' ])
  .adjust('stack')
  .style({
    lineWidth: 1,
    stroke: '#fff',
    lineJoin: 'round',
    lineCap: 'round'
  })
  .animate({
    appear: {
      duration: 1200,
      easing: 'bounceOut'
    }
  });

chart.render();
return chart;
}


Page({

  /**
   * 页面的初始数据
   */
  data: {

    title:'',
    map:{},
    mydata:[],
    /*
    map:{
      芳华: '40%',
      妖猫传: '20%',
      机器之血: '18%',
      心理罪: '15%',
      寻梦环游记: '5%',
      其他: '2%'
    },
    
    mydata : [{
      name: '芳华',
      percent: 0.4,
      a: '1'
    }, {
      name: '妖猫传',
      percent: 0.2,
      a: '1'
    }, {
      name: '机器之血',
      percent: 0.18,
      a: '1'
    }, {
      name: '心理罪',
      percent: 0.15,
      a: '1'
    }, {
      name: '寻梦环游记',
      percent: 0.05,
      a: '1'
    }, {
      name: '其他',
      percent: 0.02,
      a: '1'
    }],
    */
    pixelRatio:0,
    opts: {
      onInit: initChart
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 在页面onLoad回调事件中创建插屏广告实例
if (wx.createInterstitialAd) {
  interstitialAd = wx.createInterstitialAd({
    adUnitId: 'adunit-aaee8b7ebfbfbbad'
  })
  interstitialAd.onLoad(() => {
    console.log("插屏加载完毕")
  })
  interstitialAd.onError((err) => {
    console.log("插屏加载错误")
    console.log(err)
  })
  interstitialAd.onClose(() => {})
}

    var that = this
    wx.getSystemInfo({ 
      success: function(res) { 
      console.log(res.model) 
      console.log(res.pixelRatio) 
      that.setData({
        pixelRatio:res.pixelRatio
      })
      }
    })
    //console.log(options)
    var name = options.name
    var data = JSON.parse(options.data)
    var total_alliance = 0
    var total_horde = 0
    for(var i=0;i<data.length;i++){
      total_alliance += data[i].goods_alliance
      total_horde += data[i].goods_horde

    }


    var camp = options.camp
    var map = {}
    var mydata = []
    if(camp == "alliance"){

      //排序
      var newdata = data
      for (var a = 0; a < newdata.length - 1; a++) {

        //2.内部循环 保证 了 最大值 被 移动到最后
        for (var b = 0; b < newdata.length - 1; b++) {
  
          if (newdata[b].goods_alliance < newdata[b + 1].goods_alliance){
            // 使用 临时变量 的方式，交换两个 元素的值 -> 交换两个变量的值
            var sum = newdata[b];
            newdata[b] = newdata[b + 1];
            newdata[b + 1] = sum;
          }
  
        }
      }
   
      console.log(newdata)
      for(var i=0;i<newdata.length;i++){
        map[newdata[i].serverName] = Math.round(newdata[i].goods_alliance/total_alliance*100) + "%"
        mydata[i] = {
          name:newdata[i].serverName,
          percent:newdata[i].goods_alliance/total_alliance,
          a:'2'
        }
      }
      //console.log(map)
      
      

      this.setData({
        title:name+' '+'联盟阵容组成',
        map:map,
        mydata:mydata
      })
    }else{
      
      //排序
      var newdata = data
      for (var a = 0; a < newdata.length - 1; a++) {

        //2.内部循环 保证 了 最大值 被 移动到最后
        for (var b = 0; b < newdata.length - 1; b++) {
  
          if (newdata[b].goods_horde < newdata[b + 1].goods_horde){
            // 使用 临时变量 的方式，交换两个 元素的值 -> 交换两个变量的值
            var sum = newdata[b];
            newdata[b] = newdata[b + 1];
            newdata[b + 1] = sum;
          }
  
        }
      }
   
      console.log(newdata)
      for(var i=0;i<newdata.length;i++){
        map[newdata[i].serverName] = Math.round(newdata[i].goods_horde/total_horde*100) + "%"
        mydata[i] = {
          name:newdata[i].serverName,
          percent:newdata[i].goods_horde/total_horde,
          a:'2'
        }
      }
      //console.log(map)
      
      

      this.setData({
        title:name+' '+'部落阵容组成',
        map:map,
        mydata:mydata
      })
    }

    

    
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

  }
})