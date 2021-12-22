<template>
  <div class="flex w-full justify-between text-gray-500 bg-white px-2 py-1 text-xs client cursor-pointer" :class="classObj">
    <div class="w-1/8" @click="setEditable('finished')">
      <EditableCheckBoxCell
        v-model="finished"
        :is-editable="isEditable('finished')"
        @blur="onBlur"
        @input="debounceUpdate"
      />
    </div>
    <div class="w-1/8" @click="setEditable('translated')">
      <EditableCheckBoxCell
        v-model="translated"
        :is-editable="isEditable('translated')"
        @blur="onBlur"
        @input="debounceUpdate"
      />
    </div>
    <div class="w-3/4" @click="setEditable('memo')">
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
    classObj () {
      return {
        odd: this.odd
      }
    }
  },
  methods: {
  }
}

</script>

<style scoped>
.odd {
  @apply bg-gray-50;
}
</style>
