/*
* @Author: Administrator
* @Date:   2017-01-20 14:25:15
* @Author: Caijw
* @Last Modified by:   Caijw
* @email 573301753@qq.com
* @Last Modified time: 2017-01-20 14:43:19
*/

'use strict';

//import xlsx from 'node-xlsx'; es6写法
var xlsx = require('node-xlsx');

//import 'babel-polyfill'; es6写法
require('babel-polyfill');

//文件操作
var fs = require('fs');

//识别一个excel文件，这里的mobile.xlsx可以换成任何一个想解析的excel
//buffer  
var mobileSheetsFromBuffer = xlsx.parse(fs.readFileSync('./mobile.xlsx'));
//file
var mobileSheetsFromFile = xlsx.parse('./mobile.xlsx');

//console.log(workSheetsFromBuffer);
//console.log(workSheetsFromFile);

//格式例子
/*[{
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
}]*/
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