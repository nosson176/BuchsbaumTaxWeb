<template>
  <div ref="datePickerWrapper" tabindex="-1" :class="isEditable ? 'edit-mode' : 'read-mode'">
    <date-picker v-if="isEditable" ref="input" v-model="computedValue" tabindex="0" :value-type="valueType"
      :format="format" autofocus :type="type" :open.sync="showPicker" @focus="onFocus">
      <template #header>
        <button class="w-full flex items-center justify-center mx-btn mx-btn-text"
          @click.stop="(event) => handleTodayClick(event)">
          Today
        </button>
      </template>
    </date-picker>
    <span v-else class="cursor-pointer">{{ displayedValue }}</span>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
import { formatUnixTimestamp, getStartDayInUnixTime } from '~/shared/utility';

export default {
  name: 'EditableDateCell',
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
    format: {
      type: String,
      default: 'MM/DD/YYYY',
    },
  },

  data() {
    return {
      showPicker: false,
      isSettingToday: false,
    };
  },

  computed: {
    computedValue: {
      get() {
        return this.value ? new Date(this.value) : null;
      },
      // set(newVal) {
      //   console.log('Setting new value:', newVal);
      //   const unixTimestamp = newVal ? newVal.getTime() : null;
      //   this.$emit('input', unixTimestamp);
      //   if (!this.isSettingToday) {
      //     this.$emit(events.blur);
      //   }
      //   this.isSettingToday = false;
      // },
      set(newVal) {
        const unixTimestamp = newVal instanceof Date ? newVal.getTime() : newVal;
        this.$emit('input', unixTimestamp);

        if (!this.isSettingToday) {
          this.$emit(events.blur);
        }
        this.isSettingToday = false;
      }
    },
    valueType() {
      return this.isTypeDate ? 'date' : 'time';
    },
    isTypeDate() {
      return this.type === 'date';
    },
    displayedValue() {
      return this.isTypeDate && this.value ? formatUnixTimestamp(this.value) : this.value;
    },
  },

  mounted() {
    if (this.isEditable) {
      document.addEventListener('mousedown', this.handleClickOutside);
      this.$refs.datePickerWrapper?.addEventListener('keydown', this.handleKeydown);
    }
  },

  beforeDestroy() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    this.$refs.datePickerWrapper.removeEventListener('keydown', this.handleKeydown);
  },

  updated() {
    if (this.isEditable) {
      this.$refs.input.focus();
    }
  },
  watch: {
    isEditable(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.$refs.datePickerWrapper?.addEventListener('keydown', this.handleKeydown);
          document.addEventListener('mousedown', this.handleClickOutside);

          const innerInput = this.$refs.datePickerWrapper?.querySelector('input');
          if (innerInput) {
            innerInput.focus();
            innerInput.select();
          }
        });
      } else {
        this.$refs.datePickerWrapper?.removeEventListener('keydown', this.handleKeydown);
        this.$refs.datePickerWrapper.removeEventListener('keydown', this.handleClickOutside);
      }
    },
  },

  methods: {
    handleClickOutside(event) {
      if (!this.isEditable) return;
      const isDatePickerElement = event.target.closest('.mx-datepicker-body');
      const isTodayButton = event.target.closest('.mx-btn-text');

      if (!isDatePickerElement && !isTodayButton) {
        this.onBlur();
      }
    },
    handleKeydown(event) {
      if (event.key === 'Enter') {
        if (this.isSettingToday) return;

        this.handleTodayClick(event); // Pass the event directly
      }
      if (event.key === 'Tab') {
        this.computedValue = this.convertDateStringToUnix(event.target.value);
        // this.onBlur();
      }

    },
    // convertDateStringToUnix(dateString) {
    //   console.log('Converting date string to Unix:', dateString);
    //   // מחלקים את התאריך לחלקים
    //   const [month, day, year] = dateString.split("/");

    //   // יוצרים אובייקט Date ב-JavaScript
    //   const date = new Date(year, month - 1, day); // חודש ב-JavaScript מתחיל מ-0
    //   return date
    // },
    convertDateStringToUnix(dateString) {

      let date;

      if (dateString.includes('/')) {
        // Format: MM/DD/YYYY
        const [month, day, year] = dateString.split('/');
        date = new Date(year, month - 1, day);
      } else if (dateString.includes('.')) {
        // Format: DD.MM.YY or DD.MM.YYYY
        const [month, day, rawYear] = dateString.split('.');
        let year = rawYear;

        // Handle two-digit years
        if (year.length === 2) {
          const yearNum = parseInt(year, 10);
          year = yearNum < 50 ? `20${year}` : `19${year}`;
        }

        date = new Date(year, month - 1, day);
      } else {
        throw new Error('Unknown date format');
      }
      return date.getTime(); // return Unix timestamp in milliseconds
    },



    handleTodayClick(event) {
      this.isSettingToday = true;
      this.$emit('input', getStartDayInUnixTime());
      event.stopPropagation();

      setTimeout(() => {
        this.onBlur();
        this.isSettingToday = false;
      }, 100);
    },

    onFocus() {
      this.showPicker = true;
    },

    onBlur() {
      this.$emit(events.blur);
    },
  },
};
</script>

<style scoped>
input {
  @apply w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 text-xs p-0 absolute top-0;
}

.edit-mode {
  @apply relative z-10 overflow-visible -mt-1;
}

.read-mode {
  @apply overflow-hidden overflow-ellipsis;

  overflow: hidden;
  text-wrap: nowrap;
  text-overflow: ellipsis;
}
</style>