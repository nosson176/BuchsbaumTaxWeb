<template>
    <div tabindex="-1" :class="isEditable ? 'edit-mode' : 'read-mode'">
        <div v-if="isEditable" class="fixed w-screen h-screen top-0 left-0 z-10" @click.stop>
            <div class="h-full" @click="onBlur" />
        </div>
        <date-picker v-if="isEditable" ref="input" v-model="computedValue" tabindex="0" :value-type="valueType"
            :format="format" autofocus :type="type" :open.sync="showPicker" @focus="onFocus">
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
// import { formatDateForClient } from '~/shared/domain-utilities'
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
    },
    data() {
        return {
            showPicker: false,
            shouldEmitBlur: false
        }
    },
    computed: {
        computedValue: {
            get() {
                return this.value;
            },
            set(newVal) {
                this.$emit('input', newVal);

                // Emit blur event only if explicitly triggered (e.g., via Today button)
                if (this.shouldEmitBlur) {
                    this.$emit(events.blur);
                }
            },
        },
        format() {
            return this.isTypeDate ? 'DD-MM-YYYY HH:mm' : 'HH:mm:ss'
        },
        valueType() {
            return this.isTypeDate ? 'DD-MM-YYYY HH:mm' : 'HH:mm:ss'
        },
        isTypeDate() {
            return this.type === 'datetime'
        },
        displayedValue() {
            return this.isTypeDate && this.computedValue ? formatUnixTimestamp(this.computedValue) : this.computedValue
        },
    },
    updated() {
        if (this.isEditable) {
            this.$refs.input.focus()
        }
    },
    methods: {
        onFocus() {
            this.showPicker = true
        },
        onBlur() {
            this.$emit(events.blur)
        },
        setToday(emit) {
            this.shouldEmitBlur = true; // Enable blur event emission
            emit(new Date()); // Set today's date
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