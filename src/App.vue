<template>
  <div id="app">
    <div id="video">
      <player/>
    </div>
    
    <div id="chat">
      <iframe
         :src="src"
         :width="width"
         :height="height"
         :frameborder="frameBorder"
         :scrolling="scrolling"
         ></iframe>
    </div>
  </div>
</template>

<script>
import Player from './components/player'

export default {
  components: {
    Player,
  },
  data() {
    return {
      channel: 'aaaa1379',
      height: "100%",
      width: "100%",
      theme: "dark",
      frameBorder: 0,
      scrolling: true,
    }
  },
  computed: {
    src: function () {
      let src = `https://www.twitch.tv/${this.channel}/chat`
      if (this.theme == "dark") { src += "?darkpopout" }
      return src
    },
  },
  methods: {
    handleResize: function () {
      // this.width = document.getElementById("chat").offsetWidth
      // this.height = document.getElementById("chat").offsetHeight
    }
  },
  mounted: function () {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background: black;
}
#app {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 3fr 1.2fr;
  grid-template-rows: 3fr 1fr;
  /* 
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
  */
  flex-direction:row;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#video {
  background: #eee;
  grid-column: 1;
  grid-row: 1 / 3;
}
#resizable {
}
#chat {
  grid-column: 2;
  grid-row: 1 / 3;
  position: relative;
}
.material-design-icon {
  font-size: 36px;
}
.material-design-icon__svg {
  align-self: center;
}
</style>
