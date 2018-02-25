/*
* @Author: caijw
* @Date:   2018-02-21 23:31:47
* @Last Modified by:   caijw
* @Last Modified time: 2018-02-21 23:35:48
*/
const app = new Vue({
	el : '#app',
	data : {
		bobby: {
			name : 'bobby banne',
			age : 25
		},
		john : {
			name : 'john Baby',
			age : 25
		}
	},
	template : `<div>
		<h2>Name: {{bobby.name}}</h2>
		<h2>Name: {{bobby.age}}</h2>
		<h2>Name: {{john.name}}</h2>
		<h2>Name: {{john.age}}</h2>
	</div>`
})