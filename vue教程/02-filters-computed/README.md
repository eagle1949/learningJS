## vue02-filters-computer
filters: 自动data里面的数据查找
computer: 重新计算data里面的数据
html
```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	<title>Document</title>

</head>
<body>
  <h1>My App</h1>
  <div id="app"></div>

  <script src="https://unpkg.com/vue"></script>
  <script src="./main.js"></script>
</body>
</html>
```
main.js
```
/*
* @Author: caijw
* @Date:   2018-02-21 23:31:47
* @Last Modified by:   caijw
* @Last Modified time: 2018-02-21 23:48:16
*/
const app = new Vue({
	el : '#app',
	data : {
		bobby: {
			first : 'bobby',
			last : 'banne',
			age : 25
		},
		john : {
			first : 'john',
			last : 'Baby',
			age : 25
		}
	},
	//自动计算
	computed : {
		bobbyFullName(){
			return `${this.bobby.first} ${this.bobby.last}`;
		},
		johnFullName(){
			return `${this.john.first} ${this.john.last}`;
		},
		bobbyAge(){
			return this.bobby.age;
		}
	},
	//查找
	filters: {
	    ageInOneYear(age) {
	      return age + 1;
	    },
	    fullName(value) {
	      return `${value.last}, ${value.first}`;
	    }
	},
	template : `<div>
		<h2>Name: {{bobbyFullName}}</h2>
		<h2>age: {{bobbyAge}}</h2>
		<h2>Name: {{john | fullName}}</h2>
	</div>`
})
```