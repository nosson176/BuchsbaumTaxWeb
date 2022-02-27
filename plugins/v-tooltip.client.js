import Vue from 'vue'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

const options = {
  themes: {
    'info-tooltip': {
      $extend: 'tooltip',
      $resetCss: true
    }
  }
}

Vue.use(FloatingVue, options)
