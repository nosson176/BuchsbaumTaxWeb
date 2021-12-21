<template>
  <div class="flex w-full justify-between text-gray-500 bg-white px-2 py-1 text-xs client cursor-pointer" :class="classObj">
    <div @click="setEditable('finished')">
      <EditableCheckBoxCell
        v-model="finished"
        :is-editable="isEditable('finished')"
        @blur="onBlur"
        @input="debounceUpdate"
      />
    </div>
    <div @click="setEditable('translated')">
      <EditableCheckBoxCell
        v-model="translated"
        :is-editable="isEditable('translated')"
        @blur="onBlur"
        @input="debounceUpdate"
      />
    </div>
    <div @click="setEditable('memo')">
      <EditableSelectCell
        v-model="memo"
        :class="memo && !isEditable('memo') ? '' : 'missing'"
        :is-editable="isEditable('memo')"
        :options="memoOptions"
        @blur="onBlur"
        @input="debounceUpdate"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { debounce } from 'lodash'
import { models } from '~/shared/constants'

export default {
  name: 'ChecklistItem',
  props: {
    checklist: {
      type: Object,
      required: true
    },
    odd: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      editable: ''
    }
  },
  computed: {
    ...mapState([models.valueTypes, models.selectedClient]),
    finished: {
      get () {
        return this.checklist.finished
      },
      set (newVal) {
        this.formModel.finished = newVal
      }
    },
    translated: {
      get () {
        return this.checklist.translated
      },
      set (newVal) {
        this.formModel.translated = newVal
      }
    },
    memo: {
      get () {
        return this.checklist.memo
      },
      set (newVal) {
        this.formModel.memo = newVal
      }
    },
    formModel () {
      return {
        ...this.checklist
      }
    },
    memoOptions () {
      return this.valueTypes.checklist_memo.filter(memo => memo.show)
    },
    debounceUpdate () {
      return debounce(this.handleUpdate, 500)
    },
    classObj () {
      return {
        odd: this.odd
      }
    }
  },
  methods: {
    setEditable (editable) {
      this.editable = editable
    },
    isEditable (editable) {
      return this.editable === editable
    },
    handleUpdate () {
      const headers = this.$api.getHeaders()
      this.$api.updateChecklist(
        headers, { clientId: this.selectedClient.id, checklistId: this.checklist.id }, { ...this.formModel }
      )
    },
    onBlur () {
      this.editable = ''
    }
  }
}

</script>

<style scoped>
.odd {
  @apply bg-gray-50;
}
</style>
