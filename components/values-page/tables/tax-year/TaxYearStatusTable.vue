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
        <div class="table-header xs mr-1">
          <button class="transform hover:text-indigo-500 hover:scale-110" @click="resetOrder">A-Z</button>
        </div>
      </TableHeader>
    </template>
    <template #body>
      <draggable :value="taxYearStatus" v-bind="dragOptions" @start="startDrag" @end="onDrop">
        <transition-group type="transition" :name="transitionName">
          <TableRow v-for="(type, idx) in taxYearStatus" :key="type.id" class="pr-1" :selected="isSelected(type)"
            @click="toggleSelected(type)">
            <div class="table-col bg-gray-200 mr-1">
              <ClickCell>{{ idx + 1 }}</ClickCell>
            </div>
            <div class="table-col">
              <EditableCheckBoxCell v-model="type.show" @input="debounceUpdate" />
            </div>
            <div class="table-col w-full flex justify-between items-center" @click="toggleEditable(type.id)">
              <EditableInput v-model="type.value" :is-editable="isEditable(type.id)" @blur="onBlur" />
              <span class="pr-1">{{ detailCount(type.id) }}</span>
            </div>
            <div class="table-col xs">
              <DeleteButton @click="deleteValue(type.id)" />
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
import { events, models, TRANSITION_NAME } from '~/shared/constants'
import { valueTypeValueConstructor } from '~/shared/constructors'

const TABLE_TYPE = 'tax_year_status'
const SECONDARY_TABLE_TYPE = 'tax_year_status_detail'

export default {
  name: 'TaxYearStatusTable',
  components: { draggable },
  data() {
    return {
      editableId: null,
      showDelete: false,
      deleteId: '',
      selectedId: null,
      dragActive: false,
      dragOptions: {
        animation: 200,
        ghostClass: 'ghost',
      },
    }
  },
  computed: {
    ...mapState([models.valueTypes]),
    taxYearStatus() {
      return JSON.parse(JSON.stringify(this.valueTypes[TABLE_TYPE]))
    },
    taxYearStatusDetail() {
      return JSON.parse(JSON.stringify(this.valueTypes[SECONDARY_TABLE_TYPE]))
    },
    headers() {
      return this.$api.getHeaders()
    },
    debounceUpdate() {
      return debounce(this.handleUpdate, 2000)
    },
    transitionName() {
      return this.dragActive ? null : TRANSITION_NAME
    },
  },
  methods: {
    toggleEditable(id) {
      this.editableId = id
    },
    isEditable(id) {
      return this.editableId === id
    },
    deleteValue(valueId) {
      this.deleteId = valueId
      this.showDelete = true
    },
    onAddRowClick() {
      const value = Object.assign({}, valueTypeValueConstructor, {
        key: TABLE_TYPE,
        value: '',
        sortOrder: this.valueTypes[TABLE_TYPE].length + 1,
      })
      this.$api.createValueType(this.headers, { value })
    },
    handleUpdate() {
      const value = this.taxYearStatus.find((type) => type.id === this.editableId)
      if (value) {
        this.$api.updateValueType(this.headers, { valueId: value.id }, value)
          .catch(error => console.error('Update failed:', error))
      } else {
        console.error('No value found for ID:', this.editableId)
      }
    },
    deleteItem() {
      this.$api.deleteValueType(this.headers, { valueId: this.deleteId }).then(() => {
        this.showDelete = false
        this.deleteId = ''
      })
    },
    closeDeleteModal() {
      this.showDelete = false
      this.deleteId = ''
    },
    detailCount(id) {
      return this.taxYearStatusDetail.filter((type) => type.parentId === id).length
    },
    toggleSelected(type) {
      this.$emit(events.click, type)
      this.selectedId = type.id
    },
    isSelected(type) {
      return this.selectedId === type.id
    },
    startDrag() {
      this.dragActive = true
    },
    onDrop(evt) {
      const item = this.taxYearStatus[evt.oldIndex]
      item.sortOrder = evt.newIndex + 1
      this.$api.updateValueType(this.headers, { valueId: item.id }, item)
      this.dragActive = false
    },
    resetOrder() {
      const item = this.taxYearStatus[0]
      item.sortOrder = 0
      this.$api.updateValueType(this.headers, { valueId: item.id }, item)
    },
    onBlur() {
      // Ensure to clear the editableId when the input loses focus
      this.handleUpdate()
      this.editableId = null
    }
  },
}
</script>

<style scoped></style>
