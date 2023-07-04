<script>
import TaskList from "@/components/dashboard/tasklist/TaskList.vue";
import {mapGetters} from "vuex";

export default {
  name: 'DashboardContainer',
  props: {
    dashboard: {
      type: Object,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  },
  components: {TaskList},
  computed: { ...mapGetters(['taskCount'])},
  methods: {}
}
</script>

<template>
  <div class="dashboard-container">
    <div class="tasklist-size">
      <span class="tasklist-size-title">Taken voltooid:</span>
      <span class="tasklist-size-value">{{ taskCount.completed }}/{{ taskCount.total }}</span>
    </div>
    <TaskList v-for="(value, id) in dashboard" :key="id" :id="id" :tasklist="value"/>
  </div>
</template>

<style scoped lang="css">
.dashboard-container {
  display: flex;
  flex-direction: column;

  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  background-color: #fff;
}
.tasklist-size {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: .5rem;
}
.tasklist-size-title {
  font-size: 1rem;
}
.tasklist-size-value {
  font-family: 'Roboto Mono', monospace;
  margin-left: 1rem;
  white-space: nowrap;
}
</style>