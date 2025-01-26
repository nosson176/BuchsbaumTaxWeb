<template>
    <div tabindex="-1" :class="isEditable ? 'edit-mode' : 'read-mode'">
        <div v-if="isEditable" class="fixed w-screen h-screen top-0 left-0 z-10" @click.stop>
            <div class="h-full" @click="onBlur" />
        </div>
        <date-picker v-if="isEditable" ref="input" v-model="internalValue" tabindex="0" :value-type="valueType"
            :format="format" autofocus :type="type" :open.sync="showPicker" @focus="onFocus" @select="handleSelect"
            @change="handleChange">
            <template #header="{ emit }">
                <button class="w-full flex items-center justify-center mx-btn mx-btn-text" @click="setToday(emit)">
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
            default: 'MM/DD/YYYY HH:mm', // Default to 'dd/mm/yyyy'
        },
    },
    data() {
        return {
            showPicker: false,
            shouldEmitBlur: false,
            internalValue: null,
            selectedDate: null
        }
    },
    watch: {
        value: {
            immediate: true,
            handler(newVal) {
                this.internalValue = newVal;
            }
        }
    },
    computed: {
        // format() {
        //     return this.isTypeDate ? 'MM-DD-YYYY HH:mm' : 'HH:mm:ss'
        // },
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
    methods: {
        handleSelect(value) {
            // Store the selected date when user picks from calendar
            if (!this.selectedDate) {
                this.selectedDate = value;
            }
        },
        handleChange(value) {
            // Combine the previously selected date with the new time
            if (this.selectedDate && value) {
                const dateStr = this.selectedDate.split(' ')[0]; // Get just the date part
                const timeStr = value.split(' ')[1]; // Get just the time part
                if (timeStr) {
                    // Only combine if we have both parts
                    this.internalValue = `${dateStr} ${timeStr}`;
                    this.$emit('input', this.internalValue);
                    if (this.shouldEmitBlur) {
                        this.$emit(events.blur);
                    }
                }
            } else {
                // Handle case where only date is selected
                this.internalValue = value;
                this.$emit('input', value);
                if (this.shouldEmitBlur) {
                    this.$emit(events.blur);
                }
            }
        },
        onFocus() {
            this.showPicker = true;
            this.selectedDate = null; // Reset selected date when focusing
        },
        onBlur() {
            this.$emit(events.blur);
            this.selectedDate = null; // Reset selected date when blurring
        },
        setToday(emit) {
            this.shouldEmitBlur = true;
            const now = new Date();
            const today = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            this.internalValue = today;
            emit(now);
            this.shouldEmitBlur = false
        },
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
}
</style>