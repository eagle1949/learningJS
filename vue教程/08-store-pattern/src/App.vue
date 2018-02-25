<template>
  <div id="app">
    <img src="./assets/logo.png">
    <Navigation />
    <Friends />
    <FooterComponent />
    <!-- <router-view/> -->
  </div>
</template>

<script>
import Navigation from './components/Navigation'
import Friends from './components/Friends'
import FooterComponent from './components/Footer'
export default {
  name: 'App',
  components: {
    Navigation,
    Friends,
    FooterComponent,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  margin: 0;
}
</style>
