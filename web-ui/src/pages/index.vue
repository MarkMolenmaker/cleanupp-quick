<template>
  <v-container>
    <div v-if="appStore.getCurrentStore">
      <v-row>
        <v-col>
          <v-menu v-model="menu" :close-on-content-click="false" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" prepend-icon="mdi-calendar" v-bind="props" :text="selectedDateString" variant="tonal" :disabled="appStore.isLoading" />
            </template>
            <v-date-picker v-model="selectedDate" hide-header @update:model-value="pickDate" :disabled="appStore.isLoading" />
          </v-menu>
        </v-col>
        <v-col class="d-flex justify-end">
          <v-btn color="primary" append-icon="mdi-logout" :text="appStore.getCurrentStore.company_name" variant="outlined" :disabled="appStore.isLoading"
                 @click="signOut"/>
        </v-col>
      </v-row>
      <v-divider class="my-2" />
      <dashboard-checklist ref="dashboardChecklist" />
    </div>
    <div v-else>
      <v-skeleton-loader type="list-item" />
    </div>
  </v-container>
</template>

<script lang="ts">
import { mapStores } from 'pinia'
import { useAppStore } from '../stores/app'
import { useDate } from 'vuetify'
import DashboardChecklist from '../components/cleanupp/DashboardChecklist.vue'
import { getTaskTodoRange } from '../services/cleanupp'

export default {
  name: 'Index',
  components: {
    DashboardChecklist
  },
  computed: {
    ...mapStores(useAppStore),
    selectedDateString(): string {
      return useDate().format(this.appStore.getSelectedDate, 'fullDateWithWeekday')
    }
  },
  data () {
    return {
      menu: false as boolean,
      selectedDate: new Date(),
      taskTodoRangeHistory: null
    }
  },
  methods: {
    pickDate(date) {
      this.menu = false
      this.appStore.setSelectedDate(date)
      this.loadTaskTodoRangeHistory()
    },
    applyCalendarStyle() {
      const calendarDateElements = document.querySelectorAll('[data-v-date]')
      calendarDateElements.forEach((element) => {
        element.classList.remove('tasks-completed', 'tasks-not-completed')
      })

      for (const date in this.taskTodoRangeHistory) {
        const dateElement = document.querySelector(`[data-v-date="${date.substring(1)}"]`)    // Substring to remove the '_' that is included in this requests response for each date
        if (dateElement)
          if (this.taskTodoRangeHistory[date] > 0)
            dateElement.classList.add('tasks-not-completed')
          else dateElement.classList.add('tasks-completed')
      }
    },
    loadTaskTodoRangeHistory() {
      this.appStore.setLoading(true)
      const from = this.appStore.getAPIFormattedDateMinus30
      const until = this.appStore.getAPIFormattedDate
      getTaskTodoRange(from, until)
        .then((response) => {
          this.taskTodoRangeHistory = response
        })
        .finally(() => {
          this.$refs.dashboardChecklist.loadDashboardData()
        })
    },
    signOut() {
      this.appStore.setCurrentStore(null)
      this.appStore.setAuthCredentials('', '')
      this.appStore.setSelectedDate(new Date())
      this.$router.push('/signin')
    }
  },
  mounted() {
    this.loadTaskTodoRangeHistory()
  },
  watch: {
    menu(open: boolean) {
      if (open) this.$nextTick(() => this.applyCalendarStyle())
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
