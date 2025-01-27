<template>
  <div :class="classObj">
    <div v-if="isEditable" class="fixed w-screen h-screen top-0 left-0 z-10" @click.stop>
      <div class="h-full" @click="onBlur" />
    </div>
    <textarea v-if="isEditable" ref="input" v-model="computedValue" tabindex="0"
      class="overflow-visible resize-none text-xs shadow-sm block w-full m-0 border-transparent outline-none border focus:border-indigo-500 min-h-full z-20"
      :class="{
        'absolute top-0': position,
      }" spellcheck @click.prevent @keydown.tab.prevent="emitTab" @keydown.enter="handleEnterKey" @input="onInput" />
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
    },
    preventEnter: { // New prop to control "Enter" behavior
      type: Boolean,
      default: false,
    },
    position: {
      type: [Boolean, String],
      default: true
    },
    over: {
      type: [Boolean, String],
      default: true
    }
  },
  computed: {
    computedValue: {
      get() {
        // return this.isEditable ? this.value.replace(/<\/?[^>]+>/gi, '') : this.value;
        return this.isEditable ? (this.value || '').replace(/<\/?[^>]+>/gi, '') : (this.value || '');
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
      const editMode = this.isEditable;
      const readMode = !this.isEditable;
      const overFlow = this.showOverflow && this.over !== false; // Only allow overflow-visible if position is not false
      const hiddenOverflow = !this.position; // If position is false, apply overflow-hidden
      return {
        editMode,
        readMode,
        overFlow,
        hiddenOverflow,
      };
    },
  },
  watch: {
    async isEditable(val) {
      if (val) {
        await this.$nextTick(); // Wait for the DOM to be fully updated
        if (this.$refs.input) {
          this.$refs.input.focus();
          this.$refs.input.setAttribute('style', 'height:' + this.$refs.input.scrollHeight + 'px; overflow-y:hidden;');
        }
      }
    },
  },
  mounted() {
    if (this.isEditable) {
      this.$refs.input.setAttribute('style', 'height:' + this.$refs.input.scrollHeight + 'px;overflow-y:hidden;')
    }
  },
  methods: {
    onBlur(event) {
      this.$emit(events.blur, event)
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
    handleEnterKey(event) {
      if (this.preventEnter) {
        event.preventDefault();
      }
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

/* .hiddenOverflow {
  @apply overflow-hidden;
} */
</style>
