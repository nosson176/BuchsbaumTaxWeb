<template>
    <div ref="el" :class="isEditable ? 'edit-mode' : 'read-mode'">
        <!-- <div v-if="showOptions" class="fixed w-screen h-screen top-0 left-0 z-10" @click.stop>
            <div class="h-full" @click="onBlur" />
        </div> -->
        <div v-if="isEditable" ref="selectDiv" class="relative m-0 p-0 z-20">
            <input ref="button" v-model="filterOptionsValue" type="text" tabindex="0"
                class="p-0 text-xs relative h-5 w-full bg-white text-gray-900 text-left cursor-pointer outline-none border-blue-600 border-2"
                @click="onButtonClick" @keyup="onInputKeyup($event.key)"
                :placeholder="selectedValues.length ? undefined : placeholder" />
            <ul v-if="showOptions && isEditable" ref="select" @mouseleave="resetHover"
                class="absolute z-10  bg-white max-h-80 text-base shadow-md overflow-auto transition ease-in duration-100 focus:outline-none m-0 p-0"
                :class="{
                    'opacity-100': showOptions && isEditable,
                    'opacity-0': !(showOptions && isEditable),
                    'absolute': position,
                    'w-full': filingType,
                    'w-auto': filingType
                }" tabindex="-1" role="listbox" aria-labelledby="listbox-label">
                <li v-for="(option, idx) in filteredOptions" :id="idx" :key="idx" ref="option"
                    class="text-xs cursor-pointer select-none relative py-0 pl-0 pr-1"
                    :class="isSelectOrHover(option, idx)" role="option" @mouseover="onMouseOver(idx)"
                    @click.stop="toggleSelection(option)">
                    <span class="block truncate" :class="[
                        isSelected(option) ? 'font-semibold' : 'font-normal',
                        filingType ? 'ml-0' : 'ml-4'
                    ]">
                        {{ option.value || '\u00A0' }}
                    </span>
                    <span v-if="shouldShowCheckmark(option, idx)"
                        class="absolute inset-y-0 left-0 flex items-center p-0" :class="checkmarkColor(option, idx)">
                        <svg class="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                    </span>
                </li>
            </ul>
        </div>
        <span v-else class="cursor-pointer m-px" :class="selectedValues.length ? '' : 'text-gray-400 italic'">
            {{ shownValue }}
        </span>
    </div>
</template>

<script>
import { events } from '~/shared/constants';

export default {
    name: 'EditableMultiSelect',
    props: {
        value: {
            type: [Array, String],
            default: () => [],
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
            default: 'Select items...',
        },
        position: {
            type: [Boolean, String],
            default: true
        },
        initiallyOpen: {
            type: Boolean,
            default: false
        },
        filingType: {
            type: [Boolean, String],
            default: false
        }
    },
    data() {
        return {
            showOptions: false,
            hoverIndex: -1,
            mouseMode: false,
            filterOptionsValue: '',
            selectedValues: [],
            init: false
        };
    },
    computed: {
        inputValue: {
            get() {
                if (!this.filterOptionsValue && this.selectedValues.length > 0) {
                    return this.selectedValues.join(', ');
                }
                return this.filterOptionsValue;
            },
            set(value) {
                this.filterOptionsValue = value;
            },
        },
        shownValue() {
            if (this.selectedValues.length === 0) return this.placeholder;
            if (this.selectedValues.length === 1 && this.selectedValues[0] === 'MULTI') return this.placeholder
            if (this.selectedValues.length === 1 && this.selectedValues[0] !== 'MULTI') return this.selectedValues[0]
            if (this.selectedValues.length === 2 && this.selectedValues[0] === 'MULTI') return this.selectedValues[1];
            if (this.selectedValues.length >= 2) return 'MULTI';
            // return 'MULTI';
            return this.selectedValues.join('\n');
        },
        filteredOptions() {
            // if (!this.filterOptionsValue) return this.options;
            // return this.options.filter(option =>
            //     option.value.toLowerCase().includes(this.filterOptionsValue.toLowerCase())
            // );
            return this.options
        },
    },
    watch: {
        value: {
            immediate: true,
            handler(newVal) {
                if (Array.isArray(newVal)) {
                    this.selectedValues = [...newVal];
                } else if (typeof newVal === 'string') {
                    this.selectedValues = newVal.split('\n').filter(val => val.trim());
                } else {
                    this.selectedValues = [];
                }
            }
        },
        async isEditable(val) {
            if (!val) {
                this.showOptions = false;
                document.removeEventListener("mousedown", this.handleClickOutside);
            } else {
                this.showOptions = true;
                await this.$nextTick(() => {
                    this.$refs.button?.focus();
                    this.filterOptionsValue = this.value;
                    document.addEventListener("mousedown", this.handleClickOutside);
                });
            }

        },
    },
    mounted() {
        if (this.isEditable && this.initiallyOpen) {
            this.$nextTick(() => {
                this.showOptions = true;
                this.$refs.button?.focus();
                this.filterOptionsValue = '';
            });
        }
        if (this.isEditable) {
            document.addEventListener("mousedown", this.handleClickOutside);
        }

    },
    beforeDestroy() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    },
    methods: {
        handleClickOutside(event) {
            // if (this.init === false) {
            //     this.init = true
            //     return
            // }
            if (!this.isEditable) return
            if (!this.$refs.el.contains(event.target)) {
                this.showOptions = false;
                this.init = false
                this.filterOptionsValue = '';
                this.$emit('blur', false);
            }
        },
        shouldShowCheckmark(option, idx) {
            return this.isSelected(option) || (!this.mouseMode && this.hoverIndex === idx)
            // (this.mouseMode && this.hoverIndex === idx); // Added hover condition
        },
        checkmarkColor(option, idx) {
            return this.isSelectOrHover(option, idx) === 'text-white bg-indigo-600'
                ? 'text-white'
                : 'text-indigo-600';
        },
        toggleSelection(option) {
            const index = this.selectedValues.indexOf(option.value);
            if (index === -1) {
                this.selectedValues.push(option.value);
            } else {
                this.selectedValues.splice(index, 1);
            }
            const emitValue = typeof this.value === 'string'
                ? this.selectedValues.join('\n')
                : this.selectedValues;
            this.$emit(events.input, emitValue);
            this.filterOptionsValue = '';
        },
        scrollToHoveredOption() {
            if (this.$refs.option?.[this.hoverIndex]) {
                this.$refs.option[this.hoverIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }
        },
        isSelected(option) {
            return this.selectedValues.includes(option.value);
        },
        onBlur() {
            this.showOptions = false;
            this.filterOptionsValue = '';
            this.$emit(events.blur);
        },
        onButtonClick() {
            this.showOptions = !this.showOptions;
            if (this.showOptions) {
                this.filterOptionsValue = '';
            }
        },
        onMouseOver(idx) {
            this.hoverIndex = idx;
            this.mouseMode = true;
        },
        onInputKeyup(key) {
            if (key === 'ArrowDown') {
                this.hoverIndex = (this.hoverIndex + 1) % this.filteredOptions.length;
                this.mouseMode = false;
            } else if (key === 'ArrowUp') {
                this.hoverIndex = (this.hoverIndex - 1 + this.filteredOptions.length) % this.filteredOptions.length;
                this.mouseMode = false;
            } else if (key === 'Enter' && this.hoverIndex >= 0) {
                this.onBlur();
                // this.toggleSelection(this.filteredOptions[this.hoverIndex]);
            } else if (key === 'Escape') {
                this.onBlur();
            } else if (key.length === 1 || key === 'Backspace') {
                const matchingOptionIndex = this.options.findIndex(option =>
                    option.value?.toLowerCase().startsWith(this.filterOptionsValue.toLowerCase())
                );

                if (matchingOptionIndex !== -1) {
                    this.hoverIndex = matchingOptionIndex;
                } else {
                    this.hoverIndex = -1
                }
            }
            this.scrollToHoveredOption();
        },
        isSelectOrHover(option, idx) {
            return this.isSelected(option) || this.hoverIndex === idx
                ? 'text-white bg-indigo-600'
                : 'text-gray-900';
        },
        resetHover() {
            this.hoverIndex = -1;
            this.mouseMode = false;
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
}
</style>