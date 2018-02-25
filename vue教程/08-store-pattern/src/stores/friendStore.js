/*
* @Author: caijw
* @Date:   2018-02-23 17:38:12
* @Last Modified by:   caijw
* @Last Modified time: 2018-02-23 17:42:45
*/
const FriendStore = {
  data: {
    friends: ["bobby", "billy"],
  },
  methods: {
    addFriend(name) {
      FriendStore.data.friends.push(name);
    }
  }
};

export default FriendStore;