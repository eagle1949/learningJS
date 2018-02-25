## vue学习01
index.html
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
const app = new Vue({
	el : '#app',//挂载在哪个节点
	data : {   //数据存储
		bobby: {
			name : 'bobby banne',
			age : 25
		},
		john : {
			name : 'john Baby',
			age : 25
		}
	},//模板
	template : `<div>
		<h2>Name: {{bobby.name}}</h2>
		<h2>Name: {{bobby.age}}</h2>
		<h2>Name: {{john.name}}</h2>
		<h2>Name: {{john.age}}</h2>
	</div>`
})
```