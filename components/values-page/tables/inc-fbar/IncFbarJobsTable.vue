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
        <div class="table-header"></div>
      </TableHeader>
    </template>
    <template #body>
      <draggable :value="incFbarJobs" v-bind="dragOptions" @start="startDrag" @end="onDrop">
        <transition-group type="transition" :name="transitionName">
          <TableRow v-for="(type, idx) in incFbarJobs" :key="type.id" class="pr-1">
            <div class="table-col bg-gray-200 mr-1">
              <ClickCell>{{ idx + 1 }}</ClickCell>
            </div>
            <div class="table-col">
              <EditableCheckBoxCell v-model="type.show" @input="debounceUpdate" />
            </div>
            <div class="table-col w-full" @click="toggleEditable(type.id)">
              <EditableInput v-model="type.value" :is-editable="isEditable(type.id)" @input="debounceUpdate" />
            </div>
            <div class="table-col">
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
import { models, TRANSITION_NAME } from '~/shared/constants'
import { valueTypeValueConstructor } from '~/shared/constructors'

const TABLE_TYPE = 'job'

export default {
  name: 'IncFbarJobsTable',
  components: { draggable },
  data() {
    return {
      editableId: null,
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
    ...mapState([models.valueTypes]),
    incFbarJobs() {
      return JSON.parse(JSON.stringify(this.valueTypes[TABLE_TYPE]))
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
      const value = Object.assign({}, valueTypeValueConstructor, { key: TABLE_TYPE, value: '' })
      this.$api.createValueType(this.headers, { value })
    },
    handleUpdate() {
      const value = Object.values(this.incFbarJobs).find((type) => type.id === this.editableId)
      this.$api.updateValueType(this.headers, { valueId: value.id }, value)
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
    startDrag() {
      this.dragActive = true
    },
    onDrop(evt) {
      const item = this.incFbarJobs[evt.oldIndex]
      item.sortOrder = evt.newIndex
      this.$api.updateValueType(this.headers, { valueId: item.id }, item)
      this.dragActive = false
    },
  },
}
</script>

<style scoped></style>
