<template>
    <Table class="h-auto shadow" @keydown.tab.prevent="onKeyDown">
        <template #header>
            <TableHeader>
                <div class="table-header">
                    <AddRowButton @click="onAddRowClick" />
                </div>
                <div class="table-header">
                    <CheckBoxWithEyeIcon />
                </div>
                <div class="table-header w-full ml-1">Name</div>
                <!-- <div class="table-header xs mr-1">
                    <button class="transform hover:text-indigo-500 hover:scale-110" @click="resetOrder">A-Z</button>
                </div> -->
            </TableHeader>
        </template>
        <template #body>
            <draggable :value="filteredCurrencyValues" v-bind="dragOptions" @start="startDrag" @end="onDrop">
                <transition-group type="transition" :name="transitionName">
                    <TableRow v-for="(type, idx) in filteredCurrencyValues" :key="type.id" class="pr-1 divide-y">
                        <div class="table-col bg-gray-200 mr-1">
                            <ClickCell>{{ idx + 1 }}</ClickCell>
                        </div>
                        <div class="table-col">
                            <EditableCheckBoxCell v-model="type.show" @input="debounceUpdate"
                                @click="toggleEditable(type.id)" />
                        </div>
                        <div class="table-col w-full" @click.stop="toggleEditable(`${idx}-year`, type.id)">
                            <EditableInputCell v-model="type.year" :is-editable="isEditable(`${idx}-year`)"
                                @blur="onBlur" @keyup.enter.native="onBlur" />
                        </div>
                        <div class="table-col w-full">
                            <EditableInputCell v-model="type.currency" :is-editable="isEditable(`${idx}-currency`)"
                                readonly />
                        </div>
                        <div class="table-col w-full" @click="toggleEditable(`${idx}-rate`, type.id)">
                            <EditableInputCell v-model="type.rate" :is-editable="isEditable(`${idx}-rate`)"
                                @blur="onBlur" @keyup.enter.native="onBlur" />
                        </div>
                        <div class="table-col xs">
                            <DeleteButton @click="deleteValue(type)" />
                        </div>
                    </TableRow>
                </transition-group>
            </draggable>
            <Modal :showing="showDelete" @hide="closeDeleteModal">
                <DeleteType @hide="closeDeleteModal" @delete="deleteItem" />
            </Modal>
        </template>
    </Table>
</template>

<script>
import { debounce } from 'lodash'
import { mapState } from 'vuex'
import draggable from 'vuedraggable'
import { models, TRANSITION_NAME } from '~/shared/constants'
import { exchangeRate } from '~/shared/constructors'

const TABLE_TYPE = 'currency_values'

export default {
    name: 'IncFbarCurrenciesValuesTable',
    components: { draggable },
    props: {
        CurrencyValue: {
            type: String,
            required: true
        },
    },
    data() {
        return {
            editableId: null,
            editable: '',
            showDelete: false,
            deleteId: '',
            dragActive: false,
            dragOptions: {
                animation: 200,
                ghostClass: 'ghost',
            },
        }
    },
    computed: {
        ...mapState([models.valueTypes, models.exchangeRate]),
        // incFbarCurrenciesValues() {
        //     console.log(JSON.parse(JSON.stringify(this.exchangeRate)))
        //     return Object.values(this.exchangeRate)
        // },
        filteredCurrencyValues() {
            console.log("run")
            const values = JSON.parse(JSON.stringify(this.exchangeRate));
            return Object.values(values)
                .filter(value => value.currency === this.CurrencyValue)
                .sort((a, b) => {
                    const yearA = a?.year ?? '';
                    const yearB = b?.year ?? '';

                    if (yearA === '' && yearB !== '') return -1; // a comes first
                    if (yearB === '' && yearA !== '') return 1;  // b comes first
                    if (yearA === '') return 1; // If both are "", keep the order (b comes first)
                    if (yearB === '') return -1; // If both are "", keep the order (a comes first)

                    return yearB - yearA; // Sort descending (newest first)
                });
        },
        headers() {
            return this.$api.getHeaders()
        },
        debounceUpdate() {

            return debounce(this.handleUpdate, 500)
        },
        transitionName() {
            if (!this.dragActive) {
                return TRANSITION_NAME
            }
            return null
        },
    },
    methods: {
        toggleEditable(textId, id) {
            if (this.editable === textId) {
                this.editable = '';
            } else {
                this.editable = textId;
                this.editableId = id
            }
        },
        isEditable(id) {
            return this.editable === id;
        },
        deleteValue(value) {
            this.deleteId = value.id
            this.deleteItemSelect = value
            this.showDelete = true
        },
        onAddRowClick() {
            const value = Object.assign({}, exchangeRate, {
                currency: this.CurrencyValue,
                year: '',
                show: true,
            })
            this.$api.createExchangeRate(this.headers, { value }).then(res => {
                console.log(res)
                this.$store.commit("pushNewExchangeRate", { value: res })
            })
        },
        onBlur() {
            this.handleUpdate()
            this.editable = null
        },
        handleUpdate() {
            if (!this.editable) return; // Ensure there's an editable ID set
            const value = this.filteredCurrencyValues.find((type) => type.id === this.editableId);

            if (!value) {
                console.warn("handleUpdate: No matching value found for ID", this.editableId);
                return;
            }

            this.$api.updateExchangeRate(this.headers, { valueId: value.id }, value)
                .then(res => {
                    console.log(res)
                    this.$store.commit("updateExchangeRate", { value });
                })
                .catch(err => {
                    console.error("Failed to update exchange rate:", err);
                });
        },
        deleteItem() {
            this.$api.deleteExchangeRate(this.headers, { valueId: this.deleteId }).then((res) => {
                console.log(res, this.deleteItemSelect.id)
                if (res.status === 204) this.$store.commit("deleteExchangeRate", { valueId: this.deleteItemSelect.id })
                this.showDelete = false
                this.deleteId = ''
            })
        },
        closeDeleteModal() {
            this.showDelete = false
            this.deleteId = ''
        },
        startDrag() {
            this.dragActive = true
        },
        onDrop(evt) {
            // יצירת עותק של האובייקט array והמרתו למערך
            const list = Object.values({ ...this.filteredCurrencyValues });

            // פריט שנגרר
            const item = list[evt.oldIndex];
            item.sortOrder = evt.newIndex + 1;

            // עדכון המיקום של הפריט שנגרר
            list.splice(evt.oldIndex, 1); // הסרה מהמיקום הישן
            list.splice(evt.newIndex, 0, item); // הוספה במיקום החדש

            // עדכון sortOrder לכל הפריטים ברשימה לפי המיקום החדש
            list.forEach((el, idx) => {
                el.sortOrder = idx + 1;
            });

            // קריאה ל-API לעדכון
            this.$store.commit("updateSortOrder", { value: list, tab: TABLE_TYPE });
            this.$api
                .updateValueType(this.headers, { valueId: item.id }, item)
                .catch(() => {
                    this.$toast.error("Exchange rate dosen't support drag drop")
                });

            this.dragActive = false; // סיום מצב גרירה
        },
        // resetOrder() {
        //     // Create a copy of the array
        //     const list = [...this.filteredCurrencyValues];
        //     if (list.length === 0) return
        //     // Sort the list alphabetically by the `value` field
        //     list.sort((a, b) => b.year - a.year);

        //     // Reset the sortOrder for each item
        //     list.forEach((item, index) => {
        //         item.sortOrder = index + 1;
        //     });

        //     // Send the first item to the server with sortOrder = 0 to trigger the server reset logic
        //     const item = this.filteredCurrencyValues[0];
        //     item.sortOrder = 0;

        //     this.$api.updateValueType(this.headers, { valueId: item.id }, item)
        //         .then(() => {
        //             // Commit the updated list to the Vuex store
        //             this.$store.commit("updateSortOrder", { value: list, tab: TABLE_TYPE });
        //         })
        //         .catch((error) => {
        //             console.error("Failed to reset order:", error);
        //         });
        // },
    },
}
</script>

<style scoped></style>