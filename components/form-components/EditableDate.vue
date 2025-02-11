<template>
  <div tabindex="-1" :class="isEditable ? 'edit-mode' : 'read-mode'">
    <div v-if="isEditable" class="fixed w-screen h-screen top-0 left-0 z-10" @click.stop>
      <div class="h-full" @click="onBlur" />
    </div>
    <date-picker v-if="isEditable" ref="input" v-model="computedValue" :value-type="valueType" tabindex="0"
      :format="format" :type="type" :placeholder="placeholder" :open.sync="showPicker" @focus="onFocus">
      <template #header>
        <button class="w-full bg-gray-200 flex items-center justify-center mx-btn mx-btn-text" @click="setToday">
          Today
        </button>
      </template>
    </date-picker>
    <span v-else class="cursor-pointer" :class="value ? '' : 'text-gray-400 italic'">
      {{ displayedValue || placeholder }}
    </span>
  </div>
</template>


<script>
import { events } from '~/shared/constants';
import { formatUnixTimestamp } from '~/shared/utility';

export default {
  name: 'EditableDate',
  props: {
    value: {
      type: [String, Number],
      default: null,
    },
    isEditable: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      default: 'date',
    },
    placeholder: {
      type: String,
      default: '',
    },
    format: {
      type: String,
      default: 'MM/DD/YYYY',
    },
  },
  data() {
    return {
      showPicker: false,
    };
  },
  computed: {
    computedValue: {
      get() {
        return this.value ? new Date(this.value) : null;
      },
      set(newVal) {
        if (newVal) {
          this.$emit('input', newVal.getTime());
          this.$emit(events.blur);
        } else {
          this.$emit('input', null);
          this.$emit(events.blur);
        }
      },
    },
    valueType() {
      return this.isTypeDate ? 'date' : 'time';
    },
    isTypeDate() {
      return this.type === 'date';
    },
    displayedValue() {
      return this.value ? formatUnixTimestamp(this.value) : '';
    },
  },
  mounted() {
    // Add keydown event listener when component is mounted
    if (this.isEditable) {
      window.addEventListener('keydown', this.handleKeyDown);
    }
  },
  beforeDestroy() {
    // Remove event listener when component is destroyed
    window.removeEventListener('keydown', this.handleKeyDown);
  },
  updated() {
    if (this.isEditable && this.$refs.input) {
      this.$refs.input.focus();
    }
  },

  watch: {
    isEditable(val) {
      if (val) window.addEventListener('keydown', this.handleKeyDown)
      else window.removeEventListener('keydown', this.handleKeyDown)

    }
  },
  methods: {
    onFocus() {
      this.showPicker = true;
    },
    onBlur() {
      this.$emit(events.blur);
    },
    handleKeyDown(event) {
      // Only handle Enter key when picker is visible
      if (event.key === 'Enter' && this.showPicker) {
        event.preventDefault();
        this.setToday();
      }
    },
    setToday() {
      const today = new Date();
      this.computedValue = today;
      // this.showPicker = false;
    },
  },
}
</script>


<style scoped>
input {
  @apply w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 text-xs p-0;
}

.edit-mode {
  @apply overflow-visible;
}

.read-mode {
  @apply overflow-hidden overflow-ellipsis;

  overflow: hidden;
  text-wrap: nowrap;
  text-overflow: ellipsis;
}
</style>