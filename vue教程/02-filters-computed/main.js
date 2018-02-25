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