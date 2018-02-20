<template>
  <div class="video-container">
    <div v-if="this.$el" class="player-header">
      <span>
        第 {{ this.episode_string }} 集 -- 
        {{ this.current_percentage }} %
      </span>
    </div>
    <video id="player">
      <source :src="src" :type="type">
      Your browser does not support HTML5 video.
    </video>
    <div class="player-nav">
      <span v-show="!is_playing" @click="player_play"><play-icon fillColor="white"/></span>
      <span v-show="is_playing" @click="player_pause"><pause-icon fillColor="white"/></span>
      <span v-show="!is_mute && volume_float >= 0.66" @click="player_mute"><volume-high fillColor="white"/></span>
      <span v-show="!is_mute && volume_float <  0.66 && volume_float >= 0.33" @click="player_mute"><volume-medium fillColor="white"/></span>
      <span v-show="!is_mute && volume_float <  0.33 && volume_float >  0"    @click="player_mute"><volume-low fillColor="white"/></span>
      <span v-show="is_mute || volume_float == 0" @click="player_unmute"><volume-off fillColor="white"/></span>
      <div class="slider" :style="sliderStyle">
        <vue-slider
          ref="slider" v-model="volume"
          :min="0" :max="1" :interval="0.01"
          :tooltip="false"
          :width="sliderStyle.width"
          :process-style="processStyle"
          :bg-style="bgStyle"
          @callback="on_volume_change"
          ></vue-slider>
      </div>

      <div v-if="false">
        <span v-show="!is_fullscreen" @click="enter_fullscreen"><fullscreen fillColor="white"/></span>
        <span v-show="is_fullscreen" @click="exit_fullscreen"><fullscreen-exit fillColor="white"/></span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Player',
  data: function () {
    return {
      episode: 1,
      seconds: 0,
      duration: 0,
      base: "https://storage.googleapis.com/chuukaichiban",
      type: "video/mp4",
      timestamps: [
        // will convert second format on mounted
        // 1        2        3        4        5        6        7        8        9       10
        "22:05", "22:05", "22:06", "22:05", "22:05", "22:05", "22:05", "22:05", "22:05", "22:05", // 0
        "22:05", "22:05", "22:05", "22:05", "22:05", "22:05", "22:05", "22:05", "22:05", "22:05", // 1
        "22:05", "22:05", "21:45", "22:05", "22:05", "22:05", "22:05", "22:05", "22:05", "22:05", // 2
        "22:05", "22:05", "22:05", "22:05", "22:05", "21:45", "22:05", "22:05", "22:05", "22:05", // 3
        "22:05", "22:05", "22:06", "22:05", "22:05", "22:05", "22:05", "22:06", "22:05", "22:05", // 4
        "22:06", "21:45",                                                                         // 5
      ],
      timestamps_sec: [],
      is_playing: true,
      is_mute: false,
      is_fullscreen: false,
      volume: 0.5,
      sliderStyle: {
        width: "100px",
      },
      processStyle: {
        "background-color": "white",
      },
      bgStyle: {
        "background-color": "rgba(255,255,255,.3)",
      }
    }
  },
  computed: {
    episode_string: function () {
      if (this.episode >= 0 && this.episode < 10) {
        return `0${this.episode}`
      }
      else {
        return `${this.episode}`
      }
    },
    src: function () {
      return `${this.base}/v1/${this.episode_string}/index.mp4`
    },
    player: function () {
      return document.getElementById('player')
    },
    volume_float: function () {
      return (typeof this.volume === 'string') ? parseFloat(this.volume) : this.volume
    },
    current_percentage: function () {
      var percentage = Math.round(10000 * this.seconds / this.duration)
      return Number.isInteger(percentage) ? percentage / 100 : "--.--"
    }
  },
  methods: {
    plus_episode: function () {
      this.episode++;
      if (this.episode > this.episode_length) {
        this.episode - this.episode_length
      }
    },
    ntp: function () {
      this.timestamps_sec = this.timestamps.map(num => {
        var a = num.split(':')
        return (+a[0]) * 60 + (+a[1])
      })

      let sum = this.timestamps_sec.reduce((total, num) => { return total + num })

      let seconds = Math.round(Date.now() / 1000) % sum
      let episode = 1
      
      while (seconds > this.timestamps_sec[episode - 1]) {
        seconds -= this.timestamps_sec[episode - 1]
        episode += 1
      }

      this.episode = episode
      this.seconds = seconds

      if (this.player) {
        this.player.src = this.src
        this.player.currentTime = this.seconds
      }
    },
    player_play: function () {
      this.ntp()
      this.player.play()
      this.is_playing = true
    },
    player_pause: function () {
      this.player.pause()
      this.is_playing = false
    },
    player_toggle: function () {
      (this.is_playing) ? this.player_pause() : this.player_play()
    },
    player_mute: function () {
      this.player.volume = 0
      this.$cookie.set('is_mute', 'true')
      this.is_mute = true
    },
    player_unmute: function () {
      if (this.volume == 0) {
        this.volume = 0.5
        this.$cookie.set('volume', 0.5)
      }
      this.player.volume = this.volume
      this.$cookie.set('is_mute', 'false')
      this.is_mute = false
    },
    on_volume_change: function (v) {
      this.player_unmute()
      this.$cookie.set('volume', v)
      this.volume = v
      this.player.volume = v
    },
    enter_fullscreen: function () {
      this.player.webkitEnterFullscreen()
    },
    exit_fullscreen: function () {
      this.player.webkitExitFullscreen()
    },
  },
  created () {
    this.volume = this.$cookie.get('volume') || 0.5
    console.log(this.$cookie.get('is_mute'))
    this.is_mute = (this.$cookie.get('is_mute') == 'true')
  },
  mounted () {

    if (process.env.NODE_ENV !== "development") {
      this.player_play()
    }
    else {
      this.player_pause()
    }

    this.player.onended = () => {
      this.plus_episode()
      this.player.src = this.src
      this.player.play()
    }

    setInterval(() => {
      this.seconds = this.player.currentTime
      this.duration = this.player.duration
    }, 1000)
  }
}
</script>

<style scoped>
.video-container {
  position: relative;
  width: 100%;
  height: 100%;
}
video {
  width: 100%;
  height: 100%;
  background: black;
}

.video-container:fullscreen {
  display: true;
}

.video-container .player-nav, .video-container .player-header {
  position: absolute;
  margin: auto;
  width: 100%;
  height: 36px;
  opacity: 0;
  transition: opacity .15s ease-in-out;
}
.player-nav {
  bottom: 0;

  /* gradient background */
  background: -moz-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(19,19,19,0.75) 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(top, rgba(255,255,255,0) 0%,rgba(19,19,19,0.75) 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(19,19,19,0.75) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00ffffff', endColorstr='#80131313',GradientType=0 ); /* IE6-9 */
}
.player-header {
  top: 0;

  /* gradient background */
  background: -moz-linear-gradient(top, rgba(19,19,19,0.75) 0%, rgba(255,255,255,0) 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(top, rgba(19,19,19,0.75) 0%,rgba(255,255,255,0) 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to bottom, rgba(19,19,19,0.75) 0%,rgba(255,255,255,0) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#bf131313', endColorstr='#00ffffff',GradientType=0 ); /* IE6-9 */
}
.player-header span {
  line-height: 36px;
  color: white;
  padding-left: 12px;
}

.video-container:hover .player-nav, .video-container:hover .player-header {
  opacity: 100;
}
.player-nav .material-design-icon:first-child {
  padding-left: 12px;
}
.slider {
  display: inline-block;
  width: 100px;
}

video::-webkit-media-controls {
  display:none !important;
}
</style>


