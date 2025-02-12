<template>
  <div ref="el" :class="isEditable ? 'edit-mode' : 'read-mode'">
    <div v-if="isEditable" ref="selectDiv" class="relative m-0 p-0 z-20">
      <input ref="button" :value="value || ''" type="text" tabindex="0" readonly
        class="p-0 text-xs relative h-5 w-full bg-white text-gray-900 text-left cursor-pointer outline-none border-blue-600 border-2"
        @mousedown.stop="onButtonClick" @keydown="onKeyDown" />
      <ul v-if="showOptions && isEditable" ref="select" @mouseleave="resetHover"
        class="absolute z-10 w-auto bg-white max-h-80 text-base shadow-md overflow-auto transition ease-in duration-100 focus:outline-none m-0 p-0"
        :class="{
          'opacity-100': showOptions && isEditable,
          'opacity-0': !(showOptions && isEditable),
          'absolute': position
        }" tabindex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3">
        <li v-for="(option, idx) in options" :id="idx" :key="idx" ref="option"
          class="text-xs cursor-default select-none relative py-0 pl-0 pr-1" :class="isSelectOrHover(option, idx)"
          role="option" @mouseover="onMouseOver(idx)" @mousedown.stop="emitChange(option.value)">
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
    position: {
      type: [Boolean, String],
      default: true
    },
    initiallyOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showOptions: false,
      shiftActive: false,
      hoverIndex: -1,
      mouseMode: false,
      searchString: '',
      searchTimeout: null
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
    shownValue() {
      if (this.value === null || this.value === '') return this.placeholder;
      return this.value || this.placeholder;
    }
  },
  watch: {
    async isEditable(val) {
      if (!val) {
        this.showOptions = false;
        document.removeEventListener("mousedown", this.handleClickOutside);
      } else {
        document.addEventListener("mousedown", this.handleClickOutside);
        this.showOptions = true;
        await this.$nextTick(() => {
          this.$refs.button?.focus();
        });
      }
    },
    searchString(newVal) {
      if (newVal === '') {
        this.hoverIndex = -1;
        return;
      }

      if (newVal) {
        const matchingOptionIndex = this.options.findIndex(option =>
          option.value?.toLowerCase().startsWith(newVal.toLowerCase())
        );

        if (matchingOptionIndex !== -1) {
          this.hoverIndex = matchingOptionIndex;
          this.scrollToHoveredOption();
        }
      }
    }
  },
  mounted() {
    if (this.isEditable && this.initiallyOpen) {
      this.$nextTick(() => {
        this.showOptions = true;
        this.$refs.button?.focus();
      });
    }
    document.addEventListener("mousedown", this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  },
  methods: {
    handleClickOutside(event) {
      if (!this.isEditable || !this.showOptions) return;

      if (!this.$refs.el?.contains(event.target)) {
        this.showOptions = false;
        this.$emit(events.blur, false);
      }
    },
    onKeyDown(event) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' ||
        event.key === 'Enter' || event.key === 'Escape') {
        this.onInputKeyup(event);
      } else if (event.key === 'Backspace' || event.key === 'Delete') {
        this.searchString = this.searchString.slice(0, -1)
      }
      else if (event.key.length === 1) {
        this.searchString += event.key;
      }
    },
    emitChange(value) {
      this.computedValue = value;
      this.$emit('change');
      this.$emit(events.blur);
    },
    scrollToHoveredOption() {
      if (this.$refs.option && this.$refs.option[this.hoverIndex]) {
        this.$refs.option[this.hoverIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    },
    isSelected(option) {
      if (!Array.isArray(this.computedValue)) {
        return this.computedValue === option.value;
      }
      return this.computedValue.includes(option.value);
    },
    onBlur(event) {
      if (this.showOptions) {
        this.showOptions = false;
        this.$emit(events.blur, event);
      }
    },
    onButtonClick() {
      this.showOptions = !this.showOptions;
      if (this.showOptions) {
        this.$nextTick(() => {
          this.$refs.button?.focus()
        })
      }
    },
    onMouseOver(idx) {
      this.hoverIndex = idx;
    },
    onInputKeyup(event) {
      if (event.key === 'ArrowDown') {
        this.hoverIndex = (this.hoverIndex + 1) % this.options.length;
      } else if (event.key === 'ArrowUp') {
        this.hoverIndex = (this.hoverIndex - 1 + this.options.length) % this.options.length;
      } else if (event.key === 'Enter' && this.hoverIndex >= 0) {
        this.emitChange(this.options[this.hoverIndex].value, event);
        return
      } else if (event.key === 'Escape') {
        this.onBlur();
      }
      this.scrollToHoveredOption();
    },
    isSelectOrHover(option, idx) {
      return this.isSelected(option) || this.hoverIndex === idx ? 'text-white bg-indigo-600' : 'text-gray-900';
    },
    resetHover() {
      this.hoverIndex = -1;
    }
  },
};
</script>

<style scoped>
.edit-mode {
  @apply relative z-10 overflow-visible min-h-full outline-none;
}

.read-mode {
  @apply overflow-hidden overflow-ellipsis m-px outline-none;

  overflow: hidden;
  text-wrap: nowrap;
  text-overflow: ellipsis;
}
</style>