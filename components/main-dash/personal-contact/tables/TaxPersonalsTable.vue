<template>
  <Table @keydown.tab.prevent @keyup.shift.tab.exact="goToPrevColumn">
    <template #header>
      <TableHeader>
        <div class="table-header">
          <AddRowButton @click="onAddRowClick" />
        </div>
        <div class="table-header xs"></div>
        <div class="sm table-header">Cat</div>
        <div class="xs table-header"></div>
        <div class="normal table-header">First</div>
        <div class="xs table-header">M</div>
        <div class="normal table-header">Last</div>
        <div class="sm table-header">DOB</div>
        <div class="normal table-header">SSN</div>
        <div class="sm table-header mr-4">Informal</div>
        <div class="sm table-header mr-3">Relation</div>
        <div class="sm table-header">Lang</div>
      </TableHeader>
    </template>
    <template #body>
      <TableRow v-for="(personal, idx) in displayedPersonals" :key="personal.id" :idx="idx"
        :selected="isSelected(personal.id)" :class="{
          'disabled': !personal.include,
        }" :style="{ backgroundColor: personal.isOverSixteen ? 'rgba(229, 231, 235, 0.34)' : '' }">
        <div class="table-col bg-gray-200 mr-1">
          <ClickCell @click="toggleSelected(personal)">{{ idx + 1 }}</ClickCell>
        </div>
        <div :id="`${idx}-include`" class="table-col xs" @click="toggleEditable(`${idx}-include`, personal.id)">
          <EditableCheckBoxCell v-model="personal.include" :is-editable="isEditable(`${idx}-include`)"
            @input="handleUpdate" />
        </div>
        <div :id="`${idx}-category`" class="sm table-col-primary"
          @click="toggleEditable(`${idx}-category`, personal.id, personal.category)">
          <EditableSelectCell v-model="personal.category" :is-editable="isEditable(`${idx}-category`)"
            :options="categoryOptions" @blur="onBlur(personal.category, $event)"
            @keyup.tab.native="onBlur(personal.category, $event)" initiallyOpen=true />
        </div>
        <div class="table-col xs">
          <button v-if="isPriSec(personal)" @click="irsPopup">
            <GlobeIcon class="w-4 h-4 text-indigo-500" />
          </button>
        </div>
        <div :id="`${idx}-firstName`" class="normal table-col"
          @click="toggleEditable(`${idx}-firstName`, personal.id, personal.firstName)">
          <EditableInputCell v-model="personal.firstName" @keyup.enter.native="onBlur(personal.firstName, $event)"
            @keyup.esc.native="onBlur(personal.firstName, $event)"
            @keyup.tab.native="onBlur(personal.firstName, $event)" :is-editable="isEditable(`${idx}-firstName`)"
            @blur="onBlur(personal.firstName, $event)" />
        </div>
        <div :id="`${idx}-middleInitial`" class="xs table-col"
          @click="toggleEditable(`${idx}-middleInitial`, personal.id, personal.middleInitial)">
          <EditableInputCell v-model="personal.middleInitial"
            @keyup.enter.native="onBlur(personal.middleInitial, $event)"
            @keyup.esc.native="onBlur(personal.middleInitial, $event)"
            @keyup.tab.native="onBlur(personal.middleInitial, $event)" :is-editable="isEditable(`${idx}-middleInitial`)"
            @blur="onBlur(personal.middleInitial, $event)" />
        </div>
        <div :id="`${idx}-lastName`" class="normal table-col"
          @click="toggleEditable(`${idx}-lastName`, personal.id, personal.lastName)">
          <EditableInputCell v-model="personal.lastName" @keyup.enter.native="onBlur(personal.lastName, $event)"
            @keyup.esc.native="onBlur(personal.lastName, $event)" @keyup.tab.native="onBlur(personal.lastName, $event)"
            :is-editable="isEditable(`${idx}-lastName`)" @blur="onBlur(personal.lastName, $event)" />
        </div>
        <div :id="`${idx}-dateOfBirth`" class="table-col sm"
          @click="toggleEditable(`${idx}-dateOfBirth`, personal.id, personal.dateOfBirth)">
          <EditableDateCell v-model="personal.dateOfBirth" :is-editable="isEditable(`${idx}-dateOfBirth`)"
            @blur="onBlurDate(personal.dateOfBirth, 'dateOfBirth', $event)"
            @keyup.tab.native="onBlurDate(personal.dateOfBirth, 'dateOfBirth', $event)"
            @keyup.enter.native="onBlurDate(personal.dateOfBirth, 'dateOfBirth', $event)" />
        </div>
        <div :id="`${idx}-ssn`" class="normal table-col"
          @click="toggleEditable(`${idx}-ssn`, personal.id, personal.ssn)">
          <EditableInputCell v-model="personal.ssn" @keyup.enter.native="onBlur(personal.ssn, $event)"
            @keyup.esc.native="onBlur(personal.ssn, $event)" @keyup.tab.native="onBlur(personal.ssn, $event)"
            :class="ssnClassObj(personal.ssn, personal.include)" :is-editable="isEditable(`${idx}-ssn`)"
            @blur="onBlur(personal.ssn, $event)" />
        </div>
        <div :id="`${idx}-informal`" class="sm table-col"
          @click="toggleEditable(`${idx}-informal`, personal.id, personal.informal)">
          <EditableInputCell v-model="personal.informal" @keyup.enter.native="onBlur(personal.informal, $event)"
            @keyup.esc.native="onBlur(personal.informal, $event)" @keyup.tab.native="onBlur(personal.informal, $event)"
            :is-editable="isEditable(`${idx}-informal`)" @blur="onBlur(personal.informal, $event)" />
        </div>
        <div :id="`${idx}-relation`" class="sm table-col"
          @click="toggleEditable(`${idx}-relation`, personal.id, personal.relation)">
          <EditableSelectCell v-model="personal.relation" :is-editable="isEditable(`${idx}-relation`)"
            :options="relationOptions" @blur="onBlur(personal.relation, $event)"
            @keyup.tab.native="onBlur(personal.relation, $event)" initiallyOpen=true />
        </div>
        <div :id="`${idx}-language`" class="sm table-col"
          @click="toggleEditable(`${idx}-language`, personal.id, personal.language)">
          <EditableSelectCell v-model="personal.language" :is-editable="isEditable(`${idx}-language`)"
            :options="languageOptions" @blur="onBlur(personal.language, $event)"
            @keyup.tab.native="onBlur(personal.language, $event)" initiallyOpen=true />
        </div>
        <div :id="`${idx}-delete`" class="table-col xs">
          <DeleteButton small @click="onDeleteClick(personal.id)" />
        </div>
      </TableRow>
      <div>
        <Modal :showing="showDeleteModal" @hide="closeDeleteModal">
          <DeleteType :label="deleteTypeLabel" @hide="closeDeleteModal" @delete="deleteTaxPersonal" />
        </Modal>
      </div>
    </template>
  </Table>
</template>

<script>
import { mapState } from 'vuex'
import { categories, models, tableGroups } from '~/shared/constants'
import { generateRandomId, searchArrOfObjs } from '~/shared/utility'

const columns = [
  'include',
  'category',
  'firstName',
  'middleInitial',
  'lastName',
  'dateOfBirth',
  'ssn',
  'informal',
  'relation',
  'language',
  'delete',
]

export default {
  name: 'TaxPersonalsTable',
  props: {
    showArchived: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editableId: '',
      newPersonalId: NaN,
      editablePersonalId: '',
      oldValue: '',
      selectedItems: {},
      updateTaxPersonal: [],
      trackedPersonalId: null, // Add this to track the personal being edited
      showDeleteModal: false,
      deleteTypeLabel: 'Tax personal',
      deletePersonalId: null,
      dateFieldsInProgress: new Set()
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.search, models.cmdPressed]),
    displayedPersonals() {
      const personals = this.filteredPersonals;
      if (!personals) return [];

      // Define category order
      const categoryOrder = { PRI: 1, SEC: 2, DEP: 3 };

      // Sort by category and then by DOB for DEP
      const sortedPersonals = personals.sort((a, b) => {
        // Normalize categories to remove trailing punctuation or whitespace
        const categoryA = (a.category || "").replace(/\W+$/, "").toUpperCase();
        const categoryB = (b.category || "").replace(/\W+$/, "").toUpperCase();

        // If categories are different, sort by category order
        if (categoryA !== categoryB) {
          return (categoryOrder[categoryA] || 4) - (categoryOrder[categoryB] || 4);
        }

        // If both are DEP category, sort by date of birth (oldest on top)
        if (categoryA === "DEP") {
          const dateA = a.dateOfBirth ? new Date(a.dateOfBirth).getTime() : Infinity;
          const dateB = b.dateOfBirth ? new Date(b.dateOfBirth).getTime() : Infinity;
          return dateA - dateB; // Sort DEP by DOB (falsy DOBs go to bottom)
        }

        return 0; // Keep original order for non-DEP categories
      });

      const processedPersonals = sortedPersonals.map(personal => {
        if (personal.category !== "DEP.") return personal;

        let isOverSixteen = false;
        if (personal.dateOfBirth) {
          let dobDate;

          // Handle Unix timestamp (assuming it's in milliseconds)
          if (typeof personal.dateOfBirth === "number") {
            if (personal.dateOfBirth > 315532800000 && personal.dateOfBirth < Date.now()) {
              dobDate = new Date(personal.dateOfBirth);
            }
          } else if (typeof personal.dateOfBirth === "string") {
            dobDate = new Date(personal.dateOfBirth);
          }

          if (dobDate && !isNaN(dobDate.getFullYear())) {
            const currentYear = new Date().getFullYear();
            const seventeenYearsAgo = currentYear - 17;
            isOverSixteen = dobDate.getFullYear() < seventeenYearsAgo;
          }
        }

        return {
          ...personal,
          isOverSixteen
        };
      });

      if (this.trackedPersonalId) {
        const newIndex = processedPersonals.findIndex(p => p.id === this.trackedPersonalId);
        if (newIndex !== -1) {
          this.$nextTick(() => {
            const currentColumn = this.editableId.split("-")[1];
            this.editableId = `${newIndex}-${currentColumn}`;
          });
        }
      }

      return searchArrOfObjs(processedPersonals, this.searchInput);
    },


    filteredPersonals() {
      if (this.taxPersonals) {
        return this.taxPersonals.filter((personal) => this.showArchived === personal?.archived)
      } else {
        return null
      }
    },
    categoryOptions() {
      return this.valueTypes.category
        .filter((category) => category.show)
        .sort((a, b) => {
          const order = ['PRI.', 'SEC.', 'DEP.'];
          return order.indexOf(a.value) - order.indexOf(b.value);
        });
    },
    languageOptions() {
      return this.valueTypes.language.filter((language) => language.show)
    },
    relationOptions() {
      return this.valueTypes.relation.filter((relation) => relation.show)
    },
    headers() {
      return this.$api.getHeaders()
    },
    clientId() {
      return this.selectedClient.id
    },
    taxPersonals() {
      if (this.selectedClient.taxPersonals) {
        return JSON.parse(JSON.stringify(this.selectedClient.taxPersonals))
        // return this.selectedClient.taxPersonals
      } else {
        return null
      }
    },
    searchInput() {
      return this.search?.[tableGroups.personalContact]
    },
    isCmdPressed() {
      return this.cmdPressed && !Array.isArray(this.cmdPressed)
    },
    isCopyingPersonals() {
      return this.isCmdPressed && this.selectedPersonalIds.length > 0
    },
    selectedPersonalIds() {
      return Object.keys(this.selectedItems).filter((id) => this.selectedItems[id])
    },
  },
  mounted() {

    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  beforeDestroy() {
    if (this.updateTaxPersonal.length > 0) this.sendUpdateTaxPersonal()
  },
  methods: {
    handleBeforeUnload(event) {
      if (this.updateTaxPersonal.length > 0) {
        this.sendUpdateTaxPersonal();
        // Optionally, to show a confirmation dialog
        event.preventDefault();
        event.returnValue = '';
      }
    },
    toggleEditable(id, personalId, value) {
      if (!value) {
        const val = id.split("-")[1]
        const personal = this.displayedPersonals.find((personal) => personal.id === personalId)
        if (!personal) {
          return
        }
        this.oldValue = personal[val]
      } else this.oldValue = value

      this.editablePersonalId = personalId
      this.trackedPersonalId = personalId // Track the personal being edited

      if (!(this.editableId === id)) {
        this.editableId = id
      }
    },
    isEditable(id) {
      return this.editableId === id
    },
    toggleSelected(personal) {
      this.selectedItems[personal.id] = !this.selectedItems[personal.id]
      this.selectedItems = Object.assign({}, this.selectedItems)
    },
    isSelected(personalId) {
      return this.selectedItems[personalId]
    },
    handleUpdate(field) {
      if (!this.editablePersonalId) return
      const personal = this.displayedPersonals.find((personal) => personal.id === this.editablePersonalId)
      if (/^([0-9]{9})$/.test(personal.ssn)) {
        personal.ssn = personal.ssn.replace(/^([0-9]{3})([0-9]{2})([0-9]{4})$/, '$1-$2-$3')
      }

      const index = this.updateTaxPersonal.findIndex(per => per.id === personal.id)
      if (index !== -1) {
        this.updateTaxPersonal[index] = personal
      } else {
        this.updateTaxPersonal.push(personal)
      }
      this.$store.dispatch('updateTaxPersonalAction', { personal });
    },
    sendUpdateTaxPersonal() {
      this.$api.updateTaxPersonals(this.headers, this.updateTaxPersonal)
        .catch(() => this.$toast.error('Error updating contact'));
    },

    onDeleteClick(personalId) {
      this.showDeleteModal = true
      this.deletePersonalId = personalId
      // const personal = this.displayedPersonals.find((personal) => personal.id === personalObj.id)
      // if (this.showArchived) {
      //   personal.archived = false
      // } else {
      //   personal.archived = true
      // }
      // const index = this.updateTaxPersonal.findIndex(c => c.id === personal.id)
      // if (index !== -1) {
      //   this.updateTaxPersonal[index] = personal
      // } else {
      //   this.updateTaxPersonal.push(personal)
      // }

      // this.$store.dispatch('updateTaxPersonalAction', { personal });
    },

    deleteTaxPersonal() {
      this.$api.deleteTaxPersonal(this.headers, { personalId: this.deletePersonalId }).then(res => {
        this.closeDeleteModal()
        this.$store.commit('deleteTaxPersonal', { personalId: this.deletePersonalId })
      }).catch(e => {
      })
    },

    closeDeleteModal() {
      this.showDeleteModal = false
    },
    updateClient(personalId, personal) {
      const taxPersonalIndex = this.taxPersonals.findIndex((taxPersonal) => taxPersonal.id === personalId)
      this.taxPersonals[taxPersonalIndex] = personal
      this.updateStoreObject()
    },
    onAddRowClick() {
      if (!this.selectedClient) {
        return
      }
      const clientId = this.selectedClient.id
      const defaultValues = {
        clientId,
        lastName: this.selectedClient.lastName.replace(/[0-9]/g, ''),
        include: true,
        archived: false,
        id: generateRandomId(),
      }
      if (this.isCopyingPersonals) {
        this.selectedPersonalIds.forEach((personalId, idx) => {
          const personalIndex = this.displayedPersonals.findIndex((personal) => personal.id === Number(personalId))
          const personal = this.displayedPersonals[personalIndex]
          const newPersonal = Object.assign({}, personal)
          newPersonal.id = generateRandomId()
          this.updateTaxPersonal.push(newPersonal)
          this.$store.commit('pushNewTaxPersonal', {
            state: this.selectedClient,
            personal: newPersonal
          });
          this.toggleEditable(`${personalIndex}-${columns[0]}`, newPersonal.id)
        })
      } else {
        const personal = Object.assign({}, defaultValues)
        this.updateTaxPersonal.push(personal)
        this.$store.commit('pushNewTaxPersonal', {
          state: this.selectedClient,
          personal
        });
        // Track the new personal immediately
        this.trackedPersonalId = personal.id;

        // Wait for Vue to update the DOM before setting focus
        this.$nextTick(() => {
          const newIndex = this.displayedPersonals.findIndex(p => p.id === personal.id);
          if (newIndex !== -1) {
            // Focus specifically on the category field (index 1 in columns array)
            this.toggleEditable(`${newIndex}-category`, personal.id);

            // Find and click the category cell to open the dropdown
            const categoryCell = document.getElementById(`${newIndex}-category`);
            if (categoryCell) {
              categoryCell.click();
            }
          }
        })
        // this.toggleEditable(`${this.displayedPersonals.length - 1}-${columns[1]}`, personal.id)
      }
    },
    goToNextColumn() {
      const currentCell = this.editableId
      const idArr = currentCell.split('-')
      const columnIndex = columns.findIndex((col) => col === idArr[1])
      const currentRow = Number(idArr[0])
      if (columnIndex < columns.length - 1) {
        const nextCell = `${currentRow}-${columns[columnIndex + 1]}`
        this.toggleEditable(nextCell, this.editablePersonalId)
      } else if (columnIndex === columns.length - 1 && currentRow < this.displayedPersonals.length - 1) {
        const nextRow = currentRow + 1
        const nextCell = `${nextRow}-${columns[0]}`
        this.toggleEditable(nextCell, this.editablePersonalId)
      }
    },
    // goToPrevColumn() {
    //   const currentCell = this.editableId
    //   const idArr = currentCell.split('-')
    //   const columnIndex = columns.findIndex((col) => col === idArr[1])
    //   const currentRow = Number(idArr[0])
    //   if (columnIndex === 0 && currentRow > 0) {
    //     const prevRow = currentRow - 1
    //     const prevCell = `${prevRow}-${columns[columns.length - 1]}`
    //     this.toggleEditable(prevCell, this.editablePersonalId)
    //   } else if (columnIndex > 0) {
    //     const prevCell = `${idArr}-${columns[columnIndex - 1]}`
    //     this.toggleEditable(prevCell, this.editablePersonalId)
    //   }
    // },
    goToPrevColumn() {
      const currentCell = this.editableId
      const idArr = currentCell.split('-')
      const columnIndex = columns.findIndex((col) => col === idArr[1])
      const currentRow = Number(idArr[0])
      if (columnIndex === 0 && currentRow > 0) {
        const prevRow = currentRow - 1
        const prevCell = `${prevRow}-${columns[columns.length - 1]}`
        this.toggleEditable(prevCell, this.editablePersonalId)
      } else if (columnIndex > 0) {
        const prevCell = `${idArr[0]}-${columns[columnIndex - 1]}`
        this.toggleEditable(prevCell, this.editablePersonalId)
      }
    },

    onBlurDate(val, field, event = null) {
      if (field === 'dateOfBirth') {
        // If this field is already being processed, skip
        if (this.dateFieldsInProgress.has(field)) {
          return;
        }


        // Mark this field as being processed
        this.dateFieldsInProgress.add(field);

        // Use setTimeout to allow the date picker to complete its update
        setTimeout(() => {
          const oldValueStr = JSON.stringify(this.oldValue);


          // Only proceed with update if values are different
          if (oldValueStr !== val) {
            this.handleUpdate();
            this.goToNextColumn();
          } else {
            // If no changes, still move to next item
            this.goToNextColumn();
          }

          // Remove field from processing set
          this.dateFieldsInProgress.delete(field);
        }, 100);

        return;
      }
      // this.handleUpdate(field)
      this.goToNextColumn()
    },

    onBlur(val, field, event = null) {
      if (event && event.shiftKey && event.key === "Tab") return;
      if (this.oldValue !== val) {
        this.handleUpdate(field)
        if (event?.key !== 'Escape') {
          this.goToNextColumn()
          return
        }
      }
      if (event?.key === 'Tab' || event?.key === 'Enter') {
        this.goToNextColumn()
        return
      }
      this.editableId = ""
    },
    isRedText(ssn) {
      return ssn?.charAt(0) === '9'
    },
    isPriSec(personal) {
      return personal.category === categories.primary || personal.category === categories.secondary
    },
    irsPopup() {
      window.open('https://sa.www4.irs.gov/irfof/lang/en/irfofgetstatus.jsp', 'popup', 'width=770,height=770')
    },
    ssnClassObj(ssn, include) {
      if (!include) return "italic"
      if (this.isRedText(ssn) && include) {
        return 'text-red-500'
      } else if (this.isRedText(ssn) && !include) {
        return 'text-red-200'
      } else {
        return ''
      }
    },
  },
}
</script>

<style scoped></style>
