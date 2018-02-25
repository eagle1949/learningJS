/*
* @Author: caijw
* @Date:   2018-02-21 23:31:47
* @Last Modified by:   caijw
* @Last Modified time: 2018-02-22 00:20:31
*/
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
