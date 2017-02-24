/*
* @Author: Administrator
* @Date:   2017-02-24 11:28:08
* @Author: Caijw
* @Last Modified by:   Caijw
* @email 573301753@qq.com
* @Last Modified time: 2017-02-24 16:44:19
*/

'use strict';

import echarts from 'echarts';
// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main'));
var option = {
    title: { text: 'ECharts 入门示例' },
    tooltip: {},
    xAxis: {
        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
    },
    yAxis: {},
    series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
    }]
};
// 绘制图表
myChart.setOption(option);
var app = {};
app.currentIndex = -1;

setInterval(function () {
    var dataLen = option.series[0].data.length;
    // 取消之前高亮的图形
    myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: app.currentIndex
    });
    app.currentIndex = (app.currentIndex + 1) % dataLen;
    // 高亮当前图形
    myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: app.currentIndex
    });
    // 显示 tooltip
    myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: app.currentIndex
    });
}, 1000);
//南丁格尔图
var myChart1 = echarts.init(document.getElementById('main1'));
myChart1.setOption({
    title: { text: '南丁格尔图' },
    roseType: 'angle',//Charts 中的饼图也支持通过设置 roseType 显示成南丁格尔图。
    tooltip: {},
    series : [
        {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            data:[
                {value:400, name:'搜索引擎'},
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:274, name:'联盟广告'},
                {value:235, name:'视频广告'}
            ]
        }
    ]
})
// 基于准备好的dom，初始化echarts实例结束

//加通用的样式(itemStyle)开始
var myChart2 = echarts.init(document.getElementById('main2'));
myChart2.setOption({
    title: { text: '加通用的样式(itemStyle)' },
    roseType: 'angle',//Charts 中的饼图也支持通过设置 roseType 显示成南丁格尔图。
    //backgroundColor: '#2c343c',//背景颜色
    textStyle: {//文本样式
        //color: 'rgba(255, 255, 255, 0.3)'
    },
    itemStyle: {
        normal: {
            // 阴影的大小
            shadowBlur: 200,
            // 阴影水平方向上的偏移
            shadowOffsetX: 0,
            // 阴影垂直方向上的偏移
            shadowOffsetY: 0,
            // 阴影颜色
            shadowColor: 'rgba(0, 0, 0, 0.5)',
             // 设置扇形的颜色
            color: '#c23531'
        },
        emphasis: {
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
    },
    //明暗度
    visualMap: {
        // 不显示 visualMap 组件，只用于明暗度的映射
        show: false,
        // 映射的最小值为 80
        min: 80,
        // 映射的最大值为 600
        max: 600,
        inRange: {
            // 明暗度的范围是 0 到 1
            colorLightness: [0, 1]
        }
    },
    series : [
        {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            data:[
                {value:400, name:'搜索引擎'},
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:274, name:'联盟广告'},
                {value:235, name:'视频广告'}
            ]
        }
    ]
})
//加通用的样式(itemStyle)结束


//数据的动态更新开始
var myChart3 = echarts.init(document.getElementById('main3'));
var base = +new Date(2014, 9, 3);
var oneDay = 24 * 3600 * 1000;
var date = [];

var data = [Math.random() * 150];
var now = new Date(base);

function addData(shift) {
    now = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/');
    date.push(now);
    data.push((Math.random() - 0.4) * 10 + data[data.length - 1]);

    if (shift) {
        date.shift();
        data.shift();
    }

    now = new Date(+new Date(now) + oneDay);
}

for (var i = 1; i < 100; i++) {
    addData();
}

myChart3.setOption({
    title: { text: '数据的动态更新' },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date
    },
    yAxis: {
        boundaryGap: [0, '50%'],
        type: 'value'
    },
    series: [
        {
            name:'成交',
            type:'line',
            smooth:true,
            symbol: 'none',
            stack: 'a',
            areaStyle: {
                normal: {}
            },
            data: data
        }
    ]
});

setInterval(function () {
    addData(true);
    myChart3.setOption({
        xAxis: {
            data: date
        },
        series: [{
            name:'成交',
            data: data
        }]
    });
}, 500);
//数据的动态更新结束



//Loading...开始有显示等待动画
var myChart4 = echarts.init(document.getElementById('main4'));

function fetchData(cb) {
    // 通过 setTimeout 模拟异步加载
    setTimeout(function () {
        cb({
            categories: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"],
            data: [5, 20, 36, 10, 10, 20]
        });
    }, 2000);
}

// 初始 option
myChart4.setOption({
    title: {
        text: 'Loading...'
    },
    tooltip: {},
    legend: {
        data:['销量']
    },
    xAxis: {
        data: []
    },
    yAxis: {},
    series: [{
        name: '销量',
        type: 'bar',
        data: []
    }]
});

//显示loading
myChart4.showLoading();

fetchData(function (data) {
    //隐藏loading
    myChart4.hideLoading();
    myChart4.setOption({
        xAxis: {
            data: data.categories
        },
        series: [{
            // 根据名字对应到相应的系列
            name: '销量',
            data: data.data
        }]
    });
});
//Loading...结束


//dataZoom 放大缩小
var myChart5 = echarts.init(document.getElementById('main5'));

myChart5.setOption({
    title: {
        text: 'dataZoom 放大缩小'
    },
    xAxis: {
        type: 'value'
    },
    yAxis: {
        type: 'value'
    },
    dataZoom: [
       {
            type: 'slider',
            xAxisIndex: 0,
            start: 10,
            end: 60
        },
        {
            type: 'inside',
            xAxisIndex: 0,
            start: 10,
            end: 60
        },
        {
            type: 'slider',
            yAxisIndex: 0,
            start: 30,
            end: 80
        },
        {
            type: 'inside',
            yAxisIndex: 0,
            start: 30,
            end: 80
        }
    ],
    series: [
        {
            type: 'scatter', // 这是个『散点图』
            itemStyle: {
                normal: {
                    opacity: 0.8
                }
            },
            symbolSize: function (val) {
                return val[2] * 40;
            },
            data: [["14.616","7.241","0.896"],["3.958","5.701","0.955"],["2.768","8.971","0.669"],["9.051","9.710","0.171"],["14.046","4.182","0.536"],["12.295","1.429","0.962"],["4.417","8.167","0.113"],["0.492","4.771","0.785"],["7.632","2.605","0.645"],["14.242","5.042","0.368"]]
        }
    ]
});