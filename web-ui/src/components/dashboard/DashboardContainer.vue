<script>
import TaskList from "@/components/dashboard/tasklist/TaskList.vue";

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
  computed: {},
  methods: {}
}
</script>

<template>
  <div class="dashboard-container">
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
</style>