<template>
    <div ref="el" tabindex="-1" :class="isEditable ? 'edit-mode' : 'read-mode'">
        <date-picker v-if="isEditable" ref="input" v-model="internalValue" tabindex="0" :value-type="valueType"
            :format="format" autofocus :type="type" :open.sync="showPicker" @focus="onFocus" @select="handleSelect"
            @change="handleChange">
            <template #header="{ emit }">
                <button class="w-full flex items-center justify-center mx-btn mx-btn-text" @click.stop="setToday(emit)">
                    Today
                </button>
            </template>
        </date-picker>
        <span v-else class="cursor-pointer">{{ displayedValue }}</span>
    </div>
</template>

<script>
import { events } from '~/shared/constants'
import { formatUnixTimestamp } from '~/shared/utility';

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
            default: 'datetime',
        },
        format: {
            type: String,
            default: 'MM/DD/YYYY HH:mm',
        },
    },
    data() {
        return {
            showPicker: false,
            shouldEmitBlur: false,
            init: false,
            internalValue: null,
            selectedDate: null
        }
    },
    watch: {
        value: {
            immediate: true,
            handler(newVal) {
                this.internalValue = newVal;
                this.init = false;
                setTimeout(() => {
                    this.init = true;
                }, 100);
            },
        },
        isEditable(newVal) {
            if (newVal) {
                this.$nextTick(() => {
                    this.$refs.el?.addEventListener('keydown', this.handleKeydown);
                    document.addEventListener('mousedown', this.handleClickOutside);
                });
            } else {
                document.addEventListener("mousedown", this.handleClickOutside);
                this.$refs.el.removeEventListener('keydown', this.handleKeydown);
            }
        }
    },
    computed: {
        valueType() {
            return this.isTypeDate ? 'MM-DD-YYYY HH:mm' : 'HH:mm:ss'
        },
        isTypeDate() {
            return this.type === 'datetime'
        },
        displayedValue() {
            return this.isTypeDate && this.internalValue ? formatUnixTimestamp(this.internalValue) : this.internalValue
        },
    },
    updated() {
        if (this.isEditable) {
            this.$refs.input?.focus()
        }
    },
    mounted() {
        if (this.isEditable) {
            document.addEventListener("mousedown", this.handleClickOutside);
            this.$refs.el.addEventListener('keydown', this.handleKeydown);
        }
    },
    beforeDestroy() {
        document.removeEventListener("mousedown", this.handleClickOutside);
        this.$refs.el.removeEventListener('keydown', this.handleKeydown);
    },
    methods: {
        handleKeydown(event) {
            if (event.key === 'Enter') {
                if (this.shouldEmitBlur) return; // Prevent double blur1

                this.setToday((date) => {
                    this.$emit('input', date);
                    this.shouldEmitBlur = true;
                    // this.$emit(events.blur);

                    setTimeout(() => {
                        this.shouldEmitBlur = false;
                    }, 100);
                });
            }
        },
        handleClickOutside(event) {
            // if (this.init === false) {
            //     this.init = true
            //     return
            // }
            if (!this.isEditable) return
            const el = this.$refs.el;
            const datePicker = this.$refs.input?.$el;
            const isDatePickerElement = event.target.closest(".mx-datepicker-body");
            const isTodayButton = event.target.closest(".mx-btn-text");

            if (el?.contains(event.target) || datePicker?.contains(event.target) || isDatePickerElement || isTodayButton) {
                return;
            }

            if (!this.$refs.el.contains(event.target)) {
                this.$emit(events.blur, false)
                this.init = false
            }
        },
        handleSelect(value) {
            if (!this.selectedDate) {
                this.selectedDate = value;
            }
        },
        handleChange(value) {
            if (this.selectedDate && value) {
                const dateStr = this.selectedDate.split(' ')[0];
                const timeStr = value.split(' ')[1];
                if (timeStr) {
                    this.internalValue = `${dateStr} ${timeStr}`;
                    this.$emit('input', this.internalValue);
                    if (this.shouldEmitBlur) {
                        this.$emit(events.blur);
                    }
                }
            } else {
                this.internalValue = value;
                this.$emit('input', value);
                if (this.shouldEmitBlur) {
                    this.$emit(events.blur);
                }
            }
            this.shouldEmitBlur = false;
        },
        onFocus() {
            this.showPicker = true;
            this.selectedDate = null;
        },
        onBlur() {
            this.$emit(events.blur);
            this.selectedDate = null;
        },
        setToday(emit) {
            const now = new Date();

            // Format the date as MM-DD-YYYY HH:mm
            const today = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

            // Store the formatted date in internalValue
            this.internalValue = today;

            // Emit the Unix timestamp in milliseconds
            const unixTimestampMillis = now.getTime();
            emit(unixTimestampMillis);

            // Use setTimeout to ensure the value is set before emitting blur
            setTimeout(() => {
                this.$emit('input', today); // Emit the formatted date string
                this.$emit(events.blur); // Trigger the blur event
            }, 0);
        }
    },
}
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