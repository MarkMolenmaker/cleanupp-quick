<script>
export default {
  name: 'TaskElement',
  props: {
    task: {
      type: Object,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    taskPassed () {
      return this.task['TMeasurement'][0]['CheckResult'][0]['passed']
    },
    taskName () {
      return this.task.excerpt
    },
    style () {
      return {
        'color': this.taskPassed ? '#63c001' : '#df003b'
      }
    }
  },
  methods: {}
}
</script>

<template>
  <div class="task_element-container">
    <div class="task_element-title">
      <span :style="style">{{ taskPassed ? '&#9989;' : '&#10060;'}} {{ taskName }}</span>
    </div>
    <div class="task_element-content"></div>
  </div>
</template>

<style scoped lang="css">
.task_element-container {
  display: flex;
  flex-direction: row;
  gap: .5rem;
}
</style>