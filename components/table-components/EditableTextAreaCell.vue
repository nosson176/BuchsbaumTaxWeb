<!-- <template>
  <div :class="classObj">
    <div v-if="isEditable" class="fixed w-screen h-screen top-0 left-0 z-10" @click.stop>
      <div class="h-full" @click="onBlur" />
    </div>
    <textarea
      v-if="isEditable"
      ref="input"
      v-model="computedValue"
      tabindex="0"
      class="resize-none text-xs shadow-sm block w-full m-0 border-transparent outline-none border focus:border-indigo-500 absolute top-0 min-h-full z-20"
      spellcheck
      @click.prevent
      @keydown.tab.prevent="emitTab"
      @keydown.enter.prevent="emitTab"
      @input="onInput"
    />
    <span v-else tabindex="0" class="cursor-pointer" :class="computedValue ? '' : 'text-gray-400 italic'">{{
      computedValue || placeholder
    }}</span>
  </div>
</template>

<script>
import { events } from '~/shared/constants'

export default {
  name: 'EditableTextAreaCell',
  props: {
    value: {
      type: String,
      default: '',
    },
    isEditable: {
      type: Boolean,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    showOverflow: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    computedValue: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit(events.input, newVal)
      },
    },
    classObj() {
      const editMode = this.isEditable
      const readMode = !this.isEditable
      const overFlow = this.showOverflow
      return { editMode, readMode, overFlow }
    },
  },
  watch: {
    async isEditable(val) {
      if (val) {
        await this.$nextTick(() => {
          this.$refs.input.focus()
        })
      }
    },
  },
  mounted() {
    if (this.isEditable) {
      this.$refs.input.setAttribute('style', 'height:' + this.$refs.input.scrollHeight + 'px;overflow-y:hidden;')
    }
  },
  methods: {
    onBlur() {
      this.$emit(events.blur)
    },
    onInput() {
      this.$refs.input.style.height = 'auto'
      this.$refs.input.style.height = this.scrollHeight + 'px'
    },
    emitTab() {
      this.$emit(events.tab)
    },
  },
}
</script>

<style scoped>
.editMode {
  @apply relative z-10 overflow-visible outline-none h-8 w-full;
}

.readMode {
  @apply overflow-hidden overflow-ellipsis border-transparent outline-none border focus:border-indigo-500 h-5;
}

.overFlow {
  @apply overflow-visible h-full;
}
</style> -->
<template>
  <div :class="classObj">
    <div v-if="isEditable" class="fixed w-screen h-screen top-0 left-0 z-10" @click.stop>
      <div class="h-full" @click="onBlur" />
    </div>
    <textarea v-if="isEditable" ref="input" v-model="computedValue" tabindex="0"
      class="resize-none text-xs shadow-sm block w-full m-0 border-transparent outline-none border focus:border-indigo-500 absolute top-0 min-h-full z-20"
      spellcheck @click.prevent @keydown.tab.prevent="emitTab" @keydown.enter.prevent="emitTab" @input="onInput" />
    <span v-else tabindex="0" class="cursor-pointer" :class="computedValue ? '' : 'text-gray-400 italic'"
      v-html="formattedValue"></span>
  </div>
</template>

<script>
import { debounce } from 'lodash';
import { events } from '~/shared/constants'

export default {
  name: 'EditableTextAreaCell',
  props: {
    value: {
      type: String,
      default: '',
    },
    isEditable: {
      type: Boolean,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    showOverflow: {
      type: Boolean,
      default: false,
    },
    searchWord: {
      type: String,
      default: ''
    }
  },
  computed: {
    computedValue: {
      get() {
        return this.isEditable ? this.value.replace(/<\/?[^>]+>/gi, '') : this.value;
      },
      set(newVal) {
        this.$emit(events.input, newVal)
      },
    },
    formattedValue() {
      if (!this.searchWord) {
        return this.computedValue || this.placeholder
      }
      const regex = new RegExp(`(${this.searchWord})`, 'gi');
      return (this.computedValue || this.placeholder).replace(regex, '<span>$1</span>');
    },
    classObj() {
      const editMode = this.isEditable
      const readMode = !this.isEditable
      const overFlow = this.showOverflow
      return { editMode, readMode, overFlow }
    },
  },
  watch: {
    async isEditable(val) {
      if (val) {
        await this.$nextTick(() => {
          this.$refs.input.focus()
        })
      }
    },
  },
  mounted() {
    if (this.isEditable) {
      this.$refs.input.setAttribute('style', 'height:' + this.$refs.input.scrollHeight + 'px;overflow-y:hidden;')
    }
  },
  methods: {
    onBlur() {
      this.$emit(events.blur)
      this.cleanAndSave();
    },
    cleanAndSave() {
      // Clean the computed value to remove HTML tags
      const cleanValue = this.computedValue.replace(/<\/?[^>]+>/gi, '');
      this.$emit(events.input, cleanValue);
    },
    onInput: debounce(function () {
      this.$refs.input.style.height = 'auto';
      this.$refs.input.style.height = this.$refs.input.scrollHeight + 'px';
    }, 200),
    // onInput() {
    //   this.$refs.input.style.height = 'auto'
    //   this.$refs.input.style.height = this.scrollHeight + 'px'
    // },
    emitTab() {
      this.$emit(events.tab)
    },
  },
}
</script>

<style scoped>
.bold-blue {
  @apply font-bold text-blue-500 text-lg;
}

.editMode {
  @apply relative z-10 overflow-visible outline-none h-8 w-full;
}

.readMode {
  @apply overflow-hidden overflow-ellipsis border-transparent outline-none border focus:border-indigo-500 h-5;
}

.overFlow {
  @apply overflow-visible h-full;
}
</style>
