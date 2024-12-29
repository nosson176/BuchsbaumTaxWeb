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
      <draggable :value="taxPersonalRelations" v-bind="dragOptions" @start="startDrag" @end="onDrop">
        <transition-group type="transition" :name="transitionName">
          <TableRow v-for="(type, idx) in taxPersonalRelations" :key="type.id" class="pr-1">
            <div class="table-col bg-gray-200 mr-1">
              <ClickCell>{{ idx + 1 }}</ClickCell>
            </div>
            <div class="table-col">
              <EditableCheckBoxCell v-model="type.show" @input="debounceUpdate" />
            </div>
            <div class="table-col w-full" @click="toggleEditable(type.id)">
              <EditableInput v-model="type.value" :is-editable="isEditable(type.id)" @blur="onBlur" />
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
import { valueTypeValueConstructor } from '~/shared/constructors'

const TABLE_TYPE = 'relation'

export default {
  name: 'TaxPersonalRelationsTable',
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
    taxPersonalRelations() {
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
    deleteValue(value) {
      this.deleteId = value.id
      this.deleteItemSelect = value
      this.showDelete = true
    },
    onAddRowClick() {
      const value = Object.assign({}, valueTypeValueConstructor, {
        key: TABLE_TYPE,
        value: '',
        sortOrder: this.valueTypes[TABLE_TYPE].length + 1,
      })
      this.$api.createValueType(this.headers, { value }).then(res => {
        this.$store.commit("pushNewValueType", { value: res, tab: TABLE_TYPE })
      })
    },
    onBlur() {
      this.handleUpdate()
      this.editableId = null
    },
    handleUpdate() {
      const value = Object.values(this.taxPersonalRelations).find((type) => type.id === this.editableId)
      this.$api.updateValueType(this.headers, { valueId: value.id }, value).then(res => {
        this.$store.commit("updateValueType", { value: res, tab: TABLE_TYPE })
      })
    },
    deleteItem() {
      this.$api.deleteValueType(this.headers, { valueId: this.deleteId }).then((res) => {
        if (res.success === "Success") this.$store.commit("deleteValueType", { valueId: this.deleteItemSelect.id, tab: TABLE_TYPE })
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
      const list = Object.values({ ...this.taxPersonalRelations });

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
        .catch(err => {
          console.error("Error updating value type:", err);
        });

      this.dragActive = false; // סיום מצב גרירה
    },
    resetOrder() {
      // Create a copy of the array
      const list = [...this.taxPersonalRelations];
      if (list.length === 0) return
      // Sort the list alphabetically by the `value` field
      list.sort((a, b) => a.value?.localeCompare(b.value));

      // Reset the sortOrder for each item
      list.forEach((item, index) => {
        item.sortOrder = index + 1;
      });

      // Send the first item to the server with sortOrder = 0 to trigger the server reset logic
      const item = this.taxPersonalRelations[0];
      item.sortOrder = 0;

      this.$api.updateValueType(this.headers, { valueId: item.id }, item)
        .then(() => {
          // Commit the updated list to the Vuex store
          this.$store.commit("updateSortOrder", { value: list, tab: TABLE_TYPE });
        })
        .catch((error) => {
          console.error("Failed to reset order:", error);
        });
    },
  },
}
</script>

<style scoped></style>
