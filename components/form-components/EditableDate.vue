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
import { formatUnixTimestamp, getStartDayInUnixTime } from '~/shared/utility';

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
        let eventToPass = null; // הוספת משתנה לאירוע
        if (newVal && newVal.event) { // בדיקה אם יש אירוע
          eventToPass = newVal.event;
          newVal = newVal.value; // חילוץ הערך
        }
        console.log(newVal)
        console.log(1)
        if (newVal) {
          console.log(2)
          if (typeof newVal === 'number') {
            console.log(3)
            this.$emit('input', newVal);
          } else {
            console.log(3.11)
            this.$emit('input', newVal.getTime())
          }
          console.log(4)
          this.$emit(events.blur, eventToPass);
        } else {
          console.log(5)
          this.$emit('input', null);
          console.log(6)
          this.$emit(events.blur, eventToPass);
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
      console.log(7)
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
      if (val) {
        window.addEventListener('keydown', this.handleKeyDown)
        // Select input value when entering edit mode
        const innerInput = this.$refs.datePickerWrapper?.querySelector('input');
        if (innerInput) {
          innerInput.focus();
          innerInput.select();
        }
      }
      else window.removeEventListener('keydown', this.handleKeyDown)

    }
  },
  methods: {
    onFocus() {
      console.log(8)
      this.showPicker = true;
    },
    onBlur() {
      console.log(9)
      this.$emit(events.blur);
    },
    handleKeyDown(event) {
      console.log(10)
      // Handle the Enter key
      if (event.key === 'Enter' && this.showPicker) {
        console.log(11)
        event.preventDefault();
        this.setToday();
      }

      // Handle the Tab key
      if (event.key === 'Tab') {
        // Prevent Tab from propagating
        event.preventDefault();
        event.stopPropagation();

        console.log(12, event.target.value)
        const unixtime = this.convertDateStringToUnix(event.target.value);
        console.log(13, unixtime)
        if (unixtime) {
          // Send both value and original event for proper handling
          this.computedValue = { value: unixtime, event };
        } else {
          console.error('Failed to convert date string to unixtime');
          // Still emit blur to move to next field even if conversion fails
          this.$emit(events.blur, event);
        }
      }
    },
    setToday() {
      console.log(14)
      // const today = new Date();
      const today = getStartDayInUnixTime();
      this.computedValue = today;
      console.log(15)
      // this.showPicker = false;
    },
    convertDateStringToUnix(dateString) {
      // פונקציה להמרת מחרוזת תאריך ל-unixtime
      // החלף את הלוגיקה הזו בלוגיקה שלך
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return null; // מחרוזת תאריך לא חוקית
      }
      return date.getTime();
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