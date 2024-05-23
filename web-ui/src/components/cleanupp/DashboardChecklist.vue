<template>
  <v-progress-linear v-if="!dashboardData || appStore.isLoading" v-model="appStore.getProgress" :indeterminate="appStore.getProgress < 1" color="primary" />
  <div v-if="dashboardData && !appStore.isLoading">
    <v-btn color="primary" prepend-icon="mdi-play" :text="$vuetify.locale.t('$vuetify.pages.index.button.auto_complete')" :disabled="appStore.isLoading"
           @click="autoCompleteTasks" block />
    <v-list density="compact">
      <v-list-group v-for="(taskGroup, taskGroupId) in dashboardData" :key="taskGroupId" :value="taskGroupId">
        <template v-slot:activator="{ props }">
          <v-list-item :class="(taskProgress(taskGroup).allPassed ? 'bg-green-lighten-4' : 'bg-red-lighten-4') + ' pt-0 pb-0'"
                       v-bind="props" :prepend-icon="taskIcon(taskGroup.TaskCategory.name)" :title="taskGroup.TemperatureTaskType.name">
            <template v-slot:append="{ isActive }">
              {{ taskProgress(taskGroup).passedTasks }} / {{ taskProgress(taskGroup).totalTasks }}
              <v-icon :icon="isActive ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
            </template>
          </v-list-item>
        </template>
        <v-list-item v-for="(task, taskId) in taskGroup.TemperatureTask" :key="taskId"
                     :class="(taskMeasurementProgress(task).allPassed ? 'bg-green-lighten-4' : 'bg-red-lighten-4') + ' pt-0 pb-0'">
          <v-list-item-title class="text-caption">
            <div class="d-flex flex-column justify-center align-star overflow-hidden">
              <span class="text-truncate">{{ task.excerpt }}</span>
              <div class="d-flex justify-start flex-wrap ga-1">
                <v-chip v-for="attribute in task.TMeasurement[0].CheckResult" :key="attribute.id" class="w-fit-content text-caption" :text="attribute.element" :color="attribute.passed ? 'green' : 'red'" density="compact" label />
              </div>
            </div>
          </v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
  </div>
  <div v-else>
    <v-skeleton-loader type="list-item-two-line@10" />
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia'
import { useAppStore } from '../../stores/app'
import { getDashboardData, postMeasurementValue } from '../../services/cleanupp'

export default {
  name: 'DashboardChecklist',
  computed: {
    ...mapStores(useAppStore),
  },
  data() {
    return {
      dashboardData: null
    }
  },
  methods: {
    taskIcon(taskCategory: string) {
      switch(taskCategory) {
        case 'temperature': return 'mdi-thermometer-lines'
        case 'cleaning': return 'mdi-water-pump'
        default: return 'mdi-blur'
      }
    },
    taskProgress(taskGroup: any): { passedTasks: number, totalTasks: number, allPassed: boolean } {
      let passedTasks = 0
      let totalTasks = 0
      for (const taskId in taskGroup.TemperatureTask) {
        const task = taskGroup.TemperatureTask[taskId]
        for (const index in task.TMeasurement[0].CheckResult) {
          const attribute = task.TMeasurement[0].CheckResult[index]
          if (attribute.passed) passedTasks += 1
          totalTasks += 1
        }
      }
      return { passedTasks, totalTasks, allPassed: passedTasks === totalTasks }
    },
    taskMeasurementProgress(task: any): { passedMeasurements: number, totalMeasurements: number, allPassed: boolean } {
      let passedMeasurements = 0
      let totalMeasurements = 0
      for (const index in task.TMeasurement[0].CheckResult) {
        const attribute = task.TMeasurement[0].CheckResult[index]
        if (attribute.passed) passedMeasurements += 1
        totalMeasurements += 1
      }
      return { passedMeasurements: passedMeasurements, totalMeasurements: totalMeasurements, allPassed: passedMeasurements === totalMeasurements }
    },
    loadDashboardData() {
      this.dashboardData = null
      this.appStore.setLoading(true)
      const date = this.appStore.getAPIFormattedDate
      getDashboardData(date)
        .then((response) => {
          this.dashboardData = response[date]
          this.appStore.setLoading(false)
        })
        .catch((error) => {
          console.log(error)
          this.appStore.setLoading(false)
        })
    },
    async autoCompleteTasks() {
      this.appStore.setLoading(true)
      this.appStore.setProgress(0)

      // Setup variables for progress bar
      const totalTaskGroups = Object.keys(this.dashboardData).length
      let completedTaskGoups = 0

      // Loop through the task groups
      for (const taskGroupId in this.dashboardData) {
        const taskGroup = this.dashboardData[taskGroupId]

        let counter = 0
        const measurementArray = []
        // Loop through the tasks
        for (const taskId in taskGroup.TemperatureTask) {
          const task = taskGroup.TemperatureTask[taskId]

          // Loop trough the measurements
          for (const measurementIndex in task.TMeasurement[0].CheckResult) {
            const measurement = task.TMeasurement[0].CheckResult[measurementIndex]
            if (measurement.passed) continue
            const jsonMeasurementValue = this.findValidMeasurementValue(measurement, counter.toString())
            measurementArray.push(`"${counter}":${jsonMeasurementValue}`)
            counter += 1
          }
        }
        const measurementArrayString = `{${measurementArray.join(',')}}`

        if (counter > 0) {
          await postMeasurementValue(measurementArrayString).finally(() => {})
        }

        completedTaskGoups += 1
        this.appStore.setProgress(Math.round((completedTaskGoups / totalTaskGroups) * 100))
      }
      this.appStore.setProgress(0)
      this.loadDashboardData()
    },
    findValidMeasurementValue(measurement: any, key: string = "0") {
      let value = null
      switch (measurement['check']) {
        case 'BETWEEN (inclusive)':
          value = Number(measurement['check_val_2']) - (Number(measurement['check_val_1']) / 2)
          break
        case '<':
          value = Number(measurement['check_val_1']) - 1
          break
        case '>=':
          value = Number(measurement['check_val_1']) + 1
          break
        case '<=':
          value = Number(measurement['check_val_1']) - 1
          break
        case '=':
          value = true
          break
        case '!=':
          value = true
          break
        default:
          console.log('Unknown Check: ' + measurement['check'])
          break
      }
      return JSON.stringify({
          "CheckResult": {
            "id": String(measurement['id']),
            "value": String(value),
            "action": "",
            "employee_id": String(null)
          }
      })
    }
  },
  mounted() {
    this.loadDashboardData()
  }
}
</script>

<style lang="sass" scoped>
.w-fit-content
  min-width: fit-content
</style>
