<template>
  <div :class="isEditable ? 'edit-mode' : 'read-mode'">
    <div v-if="showOptions" class="fixed w-screen h-screen top-0 left-0 z-10" @click.stop>
      <div class="h-full" @click="onBlur" />
    </div>
    <div v-if="isEditable" ref="selectDiv" class="relative m-0 p-0 z-20">
      <input ref="button" v-model="inputValue" type="text" tabindex="0"
        class="p-0 text-xs relative h-5 w-full bg-white text-gray-900 text-left cursor-pointer outline-none border-blue-600 border-2"
        @click="onButtonClick" @keyup="onInputKeyup($event.key)" />
      <ul v-if="showOptions && isEditable" ref="select"
        class="absolute z-10 w-auto bg-white max-h-32 text-base shadow-md overflow-auto transition ease-in duration-100 focus:outline-none m-0 p-0"
        :class="showOptions && isEditable ? 'opacity-100' : 'opacity-0'" tabindex="-1" role="listbox"
        aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3">
        <li v-for="(option, idx) in filteredOptions" :id="idx" :key="idx" ref="option"
          class="text-xs cursor-default select-none relative py-0 pl-0 pr-1"
          :class="hoverIndex === idx ? 'text-white bg-indigo-600' : 'text-gray-900'" role="option"
          @mouseover="onMouseOver(idx)" @click.stop="emitChange(option.value)">
          <span class="ml-4 block truncate" :class="isSelected(option) ? 'font-semibold' : 'font-normal'">
            {{ option.value || '\u00A0' }}
          </span>
          <span v-if="isSelected(option)" class="text-indigo-600 absolute inset-y-0 left-0 flex items-center p-0">
            <svg class="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
              aria-hidden="true">
              <path fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd" />
            </svg>
          </span>
        </li>
      </ul>
    </div>
    <span v-else class="cursor-pointer m-px" :class="computedValue[0] ? '' : 'text-gray-400 italic'">
      {{ shownValue }}
    </span>
  </div>
</template>

<script>
import { events } from '~/shared/constants';

export default {
  name: 'EditableSelectCell',
  props: {
    value: {
      type: [String, Number, Array],
      default: '',
    },
    isEditable: {
      type: Boolean,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showOptions: false,
      shiftActive: false,
      hoverIndex: -1,
      mouseMode: false,
      filterOptionsValue: '',
    };
  },
  computed: {
    computedValue: {
      get() {
        if (this.value === null || this.value === '') return [];
        return Array.isArray(this.value) ? this.value : [this.value];
      },
      set(newVal) {
        this.$emit(events.input, newVal);
      },
    },
    inputValue: {
      get() {
        return this.showOptions ? this.shownValue : this.shownValue;
      },
      set(value) {
        this.filterOptionsValue = value;
      },
    },
    shownValue() {
      if (this.value === null || this.value === '') return this.placeholder;
      return this.value || this.placeholder;
    },
    filteredOptions() {
      return this.options.filter((option) =>
        option?.value?.toLowerCase().includes(this.filterOptionsValue.toLowerCase())
      );
    },
  },
  watch: {
    async isEditable(val) {
      if (!val) {
        this.showOptions = false;
      } else {
        this.showOptions = true;
        await this.$nextTick(() => {
          this.$refs.button.focus();
          this.inputValue = '';
        });
      }
    },
  },
  methods: {
    emitChange(value) {
      this.computedValue = value;
      this.$emit('change');
      this.onBlur();
    },
    isSelected(option) {
      if (!Array.isArray(this.computedValue)) {
        return this.computedValue === option.value;
      }
      return this.computedValue.includes(option.value);
    },
    onBlur() {
      this.showOptions = false;
      this.$emit(events.blur);
    },
    onButtonClick() {
      this.showOptions = !this.showOptions;
    },
    onMouseOver(idx) {
      this.hoverIndex = idx;
    },
    onInputKeyup(key) {
      if (key === 'ArrowDown') {
        this.hoverIndex = (this.hoverIndex + 1) % this.filteredOptions.length;
      } else if (key === 'ArrowUp') {
        this.hoverIndex = (this.hoverIndex - 1 + this.filteredOptions.length) % this.filteredOptions.length;
      } else if (key === 'Enter' && this.hoverIndex >= 0) {
        this.emitChange(this.filteredOptions[this.hoverIndex].value);
      }
    },
  },
};
</script>

<style scoped>
.edit-mode {
  @apply relative z-10 overflow-visible min-h-full outline-none;
}

.read-mode {
  @apply overflow-hidden overflow-ellipsis m-px outline-none;
}
</style>
