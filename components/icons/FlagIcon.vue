<template>
  <div @click="emitClick">
    <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 595.28 576.89">
      <g id="Ribbon_4" data-name="Ribbon 4">
        <path :fill="computedColor"
          d="M480.84,136.73c-23.05,16.1-47.61,23.92-75.09,23.92-36.18,0-73.22-12.94-112.44-26.63-40.93-14.29-83.25-29.07-126.82-29.07-36.71,0-69.45,10.39-100.06,31.78l-9.32,6.51v374.77l34.3-23.95c23.05-16.1,47.61-23.92,75.09-23.92,36.18,0,73.22,12.93,112.44,26.63,40.93,14.29,83.25,29.06,126.82,29.06,36.71,0,69.45-10.39,100.06-31.78l9.32-6.51V112.78l-34.3,23.95Z" />
      </g>
    </svg>
  </div>
</template>

<script>
import { events } from '~/shared/constants'

export default {
  name: 'FlagIcon',
  props: {
    color: {
      type: [Number, String],
      default: 4,
    },
  },
  computed: {
    computedColor() {
      const colors = {
        1: '#000000', // black
        2: '#bfdbfe', // blue-200
        3: '#bbf7d0', // green-200
        4: '#ffffff', // white
        5: '#facc15', // yellow-500 (כדי להחליף את orange)
        6: '#ec4899', // pink-500
        7: '#a855f7', // purple-500
        8: '#ef4444', // red-500
        9: '#047857', // green-600 (turquoise)
        10: '#fde047', // yellow-200
        11: '#ffffff', // white
      };
      return colors[this.color] || '#ffffff'; // ברירת מחדל - לבן
    },
  },
  methods: {
    emitClick() {
      this.$emit(events.click)
    },
  },
}
</script>
