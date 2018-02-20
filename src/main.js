// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// https://github.com/MatteoGabriele/vue-analytics
import VueAnalytics from 'vue-analytics'
Vue.use(VueAnalytics, { id: process.env.GA })

// https://gitlab.com/robcresswell/vue-material-design-icons
import "icons/styles.css"
import PlayIcon from "icons/play"
import PauseIcon from "icons/pause"
import VolumeHighIcon from "icons/volume-high"
import VolumeMediumIcon from "icons/volume-medium"
import VolumeLowIcon from "icons/volume-low"
import VolumeOffIcon from "icons/volume-off"
// import MenuLeftIcon from "icons/menu-left"
// import MenuRightIcon from "icons/menu-right"
import FullscreenIcon from "icons/fullscreen"
import FullscreenExitIcon from "icons/fullscreen-exit"

Vue.component("play-icon", PlayIcon)
Vue.component("pause-icon", PauseIcon)
Vue.component("volume-high", VolumeHighIcon)
Vue.component("volume-medium", VolumeMediumIcon)
Vue.component("volume-low", VolumeLowIcon)
Vue.component("volume-off", VolumeOffIcon)
// Vue.component("menu-left", MenuLeftIcon)
// Vue.component("menu-right", MenuRightIcon)
Vue.component("fullscreen", FullscreenIcon)
Vue.component("fullscreen-exit", FullscreenExitIcon)

// https://github.com/NightCatSama/vue-slider-component
import VueSlider from 'vue-slider-component'

Vue.component("vue-slider", VueSlider)

// Require dependencies
var VueCookie = require('vue-cookie');

Vue.use(VueCookie);
 

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
