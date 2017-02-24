###echarts的使用和例子<a href="http://echarts.baidu.com/tutorial.html#ECharts%20%E7%89%B9%E6%80%A7%E4%BB%8B%E7%BB%8D" target="_blank">传送门</a>
1.安装echarts
```
npm install echarts --save
```
####这里配置好了，直接输入
```
npm install //下载插件
npm start //运行
npm run build //打包压缩
```
####例子
html，div必须设置宽高
```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	<title>cjw</title>	
	<style>
		.item{
			width:300px;height:200px;float:left;
		}
	</style>
</head>
<body>
	<div id="main" class="item"></div>
	<div id="main1" class="item"></div>
	<script src="./dist/vendor.bundle.js"></script>
	<script src="./dist/app.js"></script>
</body>
</html>
```
js
```
// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main'));
myChart.showLoading();
// 绘制图表
myChart.setOption({
    title: { text: 'ECharts 入门示例' },//标题
    tooltip: {},//鼠标移动上去提示
    xAxis: {
        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
    },
    yAxis: {},
    series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
    }]
});
```


####通用样式(itemStyle)ECharts 中有一些通用的样式，诸如阴影、
透明度、颜色、边框颜色、边框宽度等，这些样式一般都会在系列的 
itemStyle 里设置。例如阴影的样式可以通过下面几个配置项设置：
阴影的配置
```
itemStyle: {
    normal: {
        // 阴影的大小
        shadowBlur: 200,
        // 阴影水平方向上的偏移
        shadowOffsetX: 0,
        // 阴影垂直方向上的偏移
        shadowOffsetY: 0,
        // 阴影颜色
        shadowColor: 'rgba(0, 0, 0, 0.5)'
    }
}
```

####深色背景和浅色标签
```
//背景色是全局的，所以直接在 option 下设置 backgroundColor

setOption({
    backgroundColor: '#2c343c'
})
//文本的样式可以设置全局的 textStyle。

setOption({
    textStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
    }
})
```

####loading 动画配合后台请求数据使用
```
myChart.showLoading();
$.get('data.json').done(function (data) {
    myChart.hideLoading();
    myChart.setOption(...);
});
```

####图例组件 legend、标题组件 title、视觉映射组件 visualMap、数据区域缩放组件 dataZoom、时间线组件 timeline
