<template>
  <Table class="h-64" @keydown.tab.prevent="onKeyDown">
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
      <TableRow v-for="(type, idx) in contactTypes" :key="idx">
        <div class="table-col bg-gray-200 mr-1">
          <ClickCell @click="toggleSelected(fbar)">{{ idx + 1 }}</ClickCell>
        </div>
        <div class="table-col">
          <EditableCheckBoxCell v-model="type.include" />
        </div>
        <div class="table-col w-full" @click="toggleEditable(type.id)">
          <EditableInput v-model="type.value" :is-editable="isEditable(type.id)" />
        </div>
        <div class="table-col">
          <DeleteButton @click="deleteValue(type.id)" />
        </div>
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { mapState } from 'vuex';
import { models } from '~/shared/constants';
import { valueTypeValueConstructor } from '~/shared/constructors'
export default {
  name: "ContactTypesTable",
  data () {
    return {
      editableId: null
    }
  },
  computed: {
    ...mapState([models.valueTypes]),
    contactTypes () {
      return JSON.parse(JSON.stringify(this.valueTypes.contact_type.filter(type => type.show)));
    },
    headers () {
      return this.$api.getHeaders();
    }
  },
  methods: {
    toggleEditable (id) {
      this.editableId = id;
    },
    isEditable (id) {
      return this.editableId === id;
    },
    deleteValue (valueId) {
      this.$api.deleteValueType(this.headers, { valueId });
    },
    onAddRowClick () {
      const value = Object.assign({}, valueTypeValueConstructor, { key: 'contact_type', value: '' });
      this.$api.createValueType(this.headers, { value });
    },
  }
};
</script>

<style scoped>
</style>
