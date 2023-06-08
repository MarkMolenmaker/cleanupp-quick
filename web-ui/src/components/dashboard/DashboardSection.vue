<script>
import {mapGetters} from "vuex";
import {mapFields} from "vuex-map-fields";
import DashboardContainer from "@/components/dashboard/DashboardContainer.vue";

export default {
  name: 'DashboardSection',
  components: {DashboardContainer},
  computed: {
    ...mapGetters(['dashboards', 'formattedDate']),
    ...mapFields(['date', 'skipCompleted', 'randomValue', 'username'])
  },
  methods: {}
}
</script>

<template>
  <section class="dashboards-section">
    <div class="form-container">
      <form @submit.prevent="this.$store.dispatch('loadDashboardsData')">
        <label class="text">
          <span>Datum</span>
          <input type="date" v-model="date">
        </label>
        <button type="submit">Gegeven inladen</button>
      </form>
      <form @submit.prevent="this.$store.dispatch('autocompleteTasks')">
        <label class="checkbox">
          <input type="checkbox" v-model="skipCompleted" disabled>
          <span>Ingevulde taken overslaan</span>
        </label>
        <label class="checkbox">
          <input type="checkbox" v-model="randomValue" disabled>
          <span>Willekeurige waarde</span>
        </label>
        <button type="submit">Automatisch invullen</button>
      </form>
      <form @submit.prevent="this.$store.dispatch('logout')">
        <label class="text">
          <span>Winkel</span>
          <input type="text" v-model="username" disabled>
        </label>
        <button type="submit">Uitloggen</button>
      </form>
    </div>
    <DashboardContainer v-for="(value, id) in dashboards" :key="id" :dashboard="value" :date="id"/>
  </section>
</template>

<style scoped lang="css">
.dashboards-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
}
.form-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
form {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  background-color: #fff;
}
</style>