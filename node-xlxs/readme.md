###1.安装 必要组件
```
npm install node-xlsx -S

/*Babel默认只转换新的JavaScript句法（syntax），而不转换新的API，比如Iterator、Generator、Set、
Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）
都不会转码。举例来说，ES6在Array对象上新增了Array.from方法。Babel就不会转码这个方法。如果想让这个方
法运行，必须使用babel-polyfill，为当前环境提供一个垫片。*/
npm install babel-polyfill -S
```
<a href="https://github.com/mgcrea/node-xlsx" target="_blank">node-xlsx传送门</a>
##2.example 
```
//import xlsx from 'node-xlsx'; es6写法
var xlsx = require('node-xlsx');

//import 'babel-polyfill'; es6写法
require('babel-polyfill');

//文件操作
var fs = require('fs');

//识别一个excel文件，这里的mobile.xlsx可以换成任何一个想解析的excel
//buffer  
var workSheetsFromBuffer = xlsx.parse(fs.readFileSync('./mobile.xlsx'));
//file
var workSheetsFromFile = xlsx.parse('./mobile.xlsx');

//格式例子
[{
	name : 'sheet1',
	data [
		['one', 'two'],
		['one', 'two'],
		['one', 'two'],
		['one', 'two'],
	]
},
{
	name : 'sheet2',
	data [
		['one', 'two'],
		['one', 'two'],
		['one', 'two'],
		['one', 'two'],
	]
}]

//这里把表1的数据复制到mobile2.xlsx里面
var newData = mobileSheetsFromBuffer[0].data;

var buffer = xlsx.build([
    {
        name : '号码',
        data : newData
    }        
]);

//将文件内容插入新的文件中
fs.writeFileSync('号码.xlsx', buffer, {'flag':'w'});

```