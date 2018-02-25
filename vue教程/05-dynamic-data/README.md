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