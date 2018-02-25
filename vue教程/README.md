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
	},//模板 mustache
	template : `<div>
		<h2>Name: {{bobby.name}}</h2>
		<h2>Name: {{bobby.age}}</h2>
		<h2>Name: {{john.name}}</h2>
		<h2>Name: {{john.age}}</h2>
	</div>`
})
```

## vue02-filters-computer
```
filters: 自动data里面的数据查找
computer: 重新计算data里面的数据
```
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

## directives 指令
```
v-for 循环
v-on:click 点击事件
v-model model绑定

methods 方法
```
```
/*
* @Author: caijw
* @Date:   2018-02-21 23:31:47
* @Last Modified by:   caijw
* @Last Modified time: 2018-02-22 00:06:57
*/
const app = new Vue({
	el : '#app',
	data : {
		friends: [
			{
				first : 'bobby',
				last : 'banne',
				age : 25
			},
			{
				first : 'john',
				last : 'Baby',
				age : 25
			}
		]
		
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
	methods : {
		incrementAge(friend){
			friend.age =  friend.age + 1;
		},
		decrementAge(friend) {
	      friend.age = friend.age - 1;
	    }
	},
	template : `<div>
		<h2 v-for="friend in friends">
			<h2>age: {{friend.age}}</h2>
			<h2>Name: {{friend | fullName}}</h2>
			<button v-on:click="incrementAge(friend)">+</button>
			<input v-model="friend.first"/>
			<input v-model="friend.last"/>
			<button v-on:click="decrementAge(friend)">-</button>
		</h2>
	</div>`
})
```

## components 组件
```
//组件
Vue.component('friend-component', {
	props : ['friend'],
	filters:{
		ageInOneYear(age) {
	      return age + 1;
	    },
	    fullName(value) {
	      return `${value.last}, ${value.first}`;
	    }
	},
	methods: {
		incrementAge(friend){
			friend.age =  friend.age + 1;
		},
		decrementAge(friend) {
	      friend.age = friend.age - 1;
	    }
	},
	template : `<div>
		<h2>age: {{friend.age}}</h2>
		<h2>Name: {{friend | fullName}}</h2>
		<button v-on:click="incrementAge(friend)">+</button>
		<input v-model="friend.first"/>
		<input v-model="friend.last"/>
		<button v-on:click="decrementAge(friend)">-</button>
	</div>`
})

const app = new Vue({
	el : '#app',
	data : {
		friends: [
			{
				first : 'bobby',
				last : 'banne',
				age : 25
			},
			{
				first : 'john',
				last : 'Baby',
				age : 25
			}
		]
		
	},
	template : `<div>
		 <friend-component v-for="item in friends" v-bind:friend="item" />
	</div>`
})

```

## 异步REST
```
/*
* @Author: caijw
* @Date:   2018-02-23 14:07:30
* @Last Modified by:   caijw
* @Last Modified time: 2018-02-23 15:04:40
*/
const app = new Vue({
	el : '#app',
	data : {
		editFriend : null,
		friends: [],
		newFriend : ''
	},
	methods: {
		addFriend(item){
			var obj = {
				firstname : item,
				lastname : 'cc',
				age : 29
			}
			fetch("http://localhost:3000/users/",{
				body: JSON.stringify(obj),
				method : 'POST',
				headers: {
					'Content-Type' : 'application/json'
				}
			})
			.then(()=>{
				this.fetchFriend();
			})
		},
		deleteFriend(id, i){
			fetch("http://localhost:3000/users/"+id,{
				method : 'DELETE'
			})
			.then(()=>{
				this.friends.splice(i, 1);
			})
		},
		updateFriend(friend){
			fetch("http://localhost:3000/users/" + friend.id,{
				body: JSON.stringify(friend),
				method : 'PUT',
				headers: {
					'Content-Type' : 'application/json'
				}
			})
			.then(()=>{
				this.editFriend = null;
			})
		},
		fetchFriend(){
			fetch('http://localhost:3000/users')
			.then(response => response.json())
			.then((data)=>{
				this.friends = data;
			})
		}
	},
	mounted(){
		this.fetchFriend();
	},
	template : `
		<div>
			add: <input v-on:keyup.13="addFriend(newFriend)" v-model="newFriend"/>
			<li v-for="friend, i in friends">
				<div v-if="editFriend === friend.id">
					<input v-on:keyup.13="updateFriend(friend)" v-model="friend.firstname" />
					<button v-on:click="updateFriend(friend)">save</button>
				</div>
				<div v-else>
					<button v-on:click="editFriend=friend.id">edit</button>
					<button v-on:click="deleteFriend(friend.id, i)">x</button>
					{{friend.firstname}}
				</div>
			</li>
		</div>
	`
})
```

## vue-cli下载
```
npm i -g vue-cli
```
```
vue list
vue init webpack
```
加载其他模块
```
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <Module />
    <Module1 />
  </div>
</template>

<script>
import Module from './module';
import Module1 from './module1';
export default {
  name: 'HelloWorld',
  components: {
    Module,
    Module1
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

```
module.vue
```
<template>
	<div>
		<h1>module111</h1>
	</div>
</template>

<script>
	export default {

	}
</script>

<style scoped>
	h1{
		color:red;
	}
</style>
```

main.js
```
vue init webpack //选择router
```
```
import router from './router'
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
```
```
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
```
router/index.js
```
import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Contact from '@/components/Contact'
import Friend from '@/components/Friend'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/Contact/:id/:name',
      name: 'Contact',
      props : true,//是否接受参数
      component: Contact
    },
    {
      path: '/Friend',
      name: 'Friend',
      component: Friend
    }
  ]
})

```
Contact.vue
```
<template>
	<div>
		<h1>contact</h1>
		{{id}} {{name}}
	</div>
</template>

<script>
	export default {
		props : [
			'id',
			'name'
		]
	}
</script>
```