<template>
    <Modal :showing="showing" @hide="$emit('hide')">
        <div class="p-4">
            <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>

            <div class="space-y-4 my-4">
                <div v-for="(item, index) in selectedItems" :key="item.id"
                    class="flex items-center justify-between gap-4">
                    <div class="flex-1">
                        <span class="text-sm font-medium">
                            Copy {{ index + 1 }}
                        </span>
                        <div class="text-xs text-gray-500">
                            <template v-if="showItemDetails">
                                <!-- Customize displayed details based on item type -->
                                <span v-if="item.description">({{ item.description }})</span>
                                <span v-if="item.amount">${{ formatAmount(item.amount) }}</span>
                                <span v-if="item.category">[{{ item.category }}]</span>
                            </template>
                            <span>Current Year: {{ item[yearField] }}</span>
                        </div>
                    </div>
                    <div class="flex-none w-40">
                        <HeaderSelectOption :value="yearSelections[item.id]" :options="yearOptions"
                            @input="handleYearChange(item.id, $event)" />
                    </div>
                </div>
            </div>

            <div class="mt-4">
                <div v-if="showBulkSelect" class="mb-4 flex items-center justify-end space-x-2">
                    <span class="text-sm">Set all years to:</span>
                    <div class="w-40">
                        <HeaderSelectOption :value="bulkYear" :options="yearOptions" @input="handleBulkYearChange" />
                    </div>
                </div>
            </div>

            <div class="flex justify-end space-x-2 mt-4">
                <button class="px-4 py-2 border rounded hover:bg-gray-100" @click="$emit('hide')">
                    Cancel
                </button>
                <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" @click="handleConfirm">
                    Confirm
                </button>
            </div>
        </div>
    </Modal>
</template>

<script>
export default {
    name: 'YearSelectionModal',

    props: {
        showing: {
            type: Boolean,
            default: false
        },
        selectedItems: {
            type: Array,
            default: () => []
        },
        yearOptions: {
            type: Array,
            default: () => []
        },
        yearField: {
            type: String,
            default: 'years'
        },
        title: {
            type: String,
            default: 'Select Years for Copies'
        },
        showItemDetails: {
            type: Boolean,
            default: true
        },
        showBulkSelect: {
            type: Boolean,
            default: true
        },
        type: {
            type: String,
            default: 'fbar' // 'fbar', 'income', 'expense', etc.
        }
    },

    data() {
        return {
            yearSelections: {},
            bulkYear: ''
        }
    },

    watch: {
        selectedItems: {
            immediate: true,
            handler(items) {
                this.yearSelections = items.reduce((acc, item) => ({
                    ...acc,
                    [item.id]: item[this.yearField]
                }), {})
            }
        }
    },

    methods: {
        formatAmount(amount) {
            return typeof amount === 'number'
                ? amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : amount
        },

        handleYearChange(itemId, newYear) {
            this.yearSelections = {
                ...this.yearSelections,
                [itemId]: newYear
            }
        },

        handleBulkYearChange(year) {
            this.bulkYear = year
            // Update all selections to the same year
            this.yearSelections = this.selectedItems.reduce((acc, item) => ({
                ...acc,
                [item.id]: year
            }), {})
        },

        handleConfirm() {
            this.$emit('confirm', {
                yearSelections: this.yearSelections,
                type: this.type
            })
            this.$emit('hide')
        }
    }
}
</script>