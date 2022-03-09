<template>
  <Table class="h-64 shadow" @keydown.tab.prevent="onKeyDown">
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
      <TableRow v-for="(type, idx) in incFbarParts" :key="idx" class="pr-1">
        <div class="table-col bg-gray-200 mr-1">
          <ClickCell @click="toggleSelected(fbar)">{{ idx + 1 }}</ClickCell>
        </div>
        <div class="table-col">
          <EditableCheckBoxCell v-model="type.include" @input="debounceUpdate" />
        </div>
        <div class="table-col w-full" @click="toggleEditable(type.id)">
          <EditableInput
            v-model="type.value"
            :is-editable="isEditable(type.id)"
            @input="debounceUpdate"
          />
        </div>
        <div class="table-col">
          <DeleteButton @click="deleteValue(type.id)" />
        </div>
      </TableRow>
      <Modal :showing="showDelete" @hide="closeDeleteModal">
        <DeleteType @hide="closeDeleteModal" @delete="deleteItem" />
      </Modal>
    </template>
  </Table>
</template>

<script>
import { debounce } from 'lodash';
import { mapState } from 'vuex';
import { models } from '~/shared/constants';
import { valueTypeValueConstructor } from '~/shared/constructors'

const TABLE_TYPE = 'part';

export default {
  name: "IncFbarPartsTable",
  data () {
    return {
      editableId: null,
      showDelete: false,
      deleteId: ''
    };
  },
  computed: {
    ...mapState([models.valueTypes]),
    incFbarParts () {
      return JSON.parse(JSON.stringify(this.valueTypes[TABLE_TYPE]));
    },
    headers () {
      return this.$api.getHeaders();
    },
    debounceUpdate () {
      return debounce(this.handleUpdate, 500);
    },
  },
  methods: {
    toggleEditable (id) {
      this.editableId = id;
    },
    isEditable (id) {
      return this.editableId === id;
    },
    deleteValue (valueId) {
      this.deleteId = valueId;
      this.showDelete = true;
    },
    onAddRowClick () {
      const value = Object.assign({}, valueTypeValueConstructor, { key: TABLE_TYPE, value: "" });
      this.$api.createValueType(this.headers, { value });
    },
    handleUpdate () {
      const value = Object.values(this.incFbarParts).find(type => type.id === this.editableId);
      this.$api.updateValueType(this.headers, { valueId: value.id }, value);
    },
    deleteItem () {
      this.$api.deleteValueType(this.headers, { valueId: this.deleteId })
        .then(() => {
          this.showDelete = false;
          this.deleteId = '';
        });
    },
    closeDeleteModal () {
      this.showDelete = false;
      this.deleteId = '';
    },
  },
};
</script>

<style scoped>
</style>
