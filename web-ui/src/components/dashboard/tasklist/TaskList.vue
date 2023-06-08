<script>
import TaskElement from "@/components/dashboard/tasklist/TaskElement.vue";

export default {
  name: 'TaskList',
  props: {
    id: {
      type: String,
      required: true
    },
    tasklist: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tasklistCollapsed: true
    }
  },
  components: {TaskElement},
  computed: {
    tasklistCompleted () {
      let totalCompleted = 0
      for (const task in this.tasklist['TemperatureTask'])
        if(this.tasklist['TemperatureTask'][task]['TMeasurement'][0]['CheckResult'][0]['passed'] === true)
          totalCompleted++
      return totalCompleted.toString()//.padStart(2, '\u00A0') // Format the number to a string with leading spaces
    },
    tasklistSize () {
      const size = Object.keys(this.tasklist['TemperatureTask']).length
      return size.toString()//.padEnd(2, '\u00A0') // Format the number to a string with leading spaces
    },
    tasklistName () {
      return this.tasklist['TemperatureTaskType'].name
    },
    tasklistEntries () {
      return this.tasklist['TemperatureTask']
    },
    style () {
      return {
        'border-color': this.tasklistCompleted === this.tasklistSize ? '#63c001' : '#df003b'
      }
    }
  },
  methods: {
    toggleTasklist () {
      this.tasklistCollapsed = !this.tasklistCollapsed
    }
  }
}
</script>

<template>
  <div class="tasklist-container">
    <div class="tasklist-content" :style="style">
      <div class="tasklist-title">
        <span class="tasklist-name">{{ tasklistName }}</span>
        <span class="tasklist-state">{{ tasklistCompleted }}/{{ tasklistSize }}</span>
      </div>
      <div class="tasklist-tasks" v-if="!tasklistCollapsed">
        <TaskElement v-for="(value, id) in tasklistEntries" :key="id" :task="value" :id="id"/>
      </div>
    </div>
    <div class="tasklist-actions">
      <button class="tasklist-action-button" v-if="tasklistCollapsed"
        @click="toggleTasklist()">+</button>
      <button class="tasklist-action-button red" v-else
        @click="toggleTasklist()">-</button>
    </div>
  </div>
</template>

<style scoped lang="css">
.tasklist-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
}
.tasklist-content {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: .5rem;

  padding: 0 .5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
}
.tasklist-tasks {
  display: flex;
  flex-direction: column;
}
.tasklist-title {
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  font-size: 1rem;
  font-weight: 500;
  color: #212121;
}
.tasklist-name {
  margin-right: auto;
}
.tasklist-state {
  font-family: 'Roboto Mono', monospace;
  margin-left: 1rem;
  white-space: nowrap;
}
.tasklist-actions {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
.tasklist-action-button {
  display: flex;
  color: #fff;
  justify-content: center;
  align-items: center;
  font-family: 'Roboto Mono', monospace;
  font-weight: bolder;
  background-color: #009bdf;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
}
.tasklist-action-button:hover {
  background-color: #0088b3;
  cursor: pointer;
}
.tasklist-action-button:active { background-color: #007199; }
.tasklist-action-button.red { background-color: #df003b; }
.tasklist-action-button.red:hover { background-color: #b3002d; }
.tasklist-action-button.red:active { background-color: #990023; }
</style>