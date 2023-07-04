<template>
  <header>
    <span class="title">CleanUpp Quick</span>
    <span class="message">{{ message }}</span>
  </header>
  <main v-if="isLoading" class="loading-main">
    <ProgressBar />
    <LoadingSpinner />
    <span class="loading-message" v-for="(msg, index) in messageHistory" :key="index">{{ msg }}</span>
  </main>
  <main v-else>
    <LoginSection v-if="!isLoggedIn" />
    <DashboardSection v-else />
  </main>
  <footer>
    <span class="text-content">Versie 2.1.1</span>
  </footer>
</template>

<script>
import { mapGetters } from "vuex";
import LoginSection from "@/components/LoginSection.vue";
import DashboardSection from "@/components/dashboard/DashboardSection.vue";
import LoadingSpinner from "@/components/loading/LoadingSpinner.vue";
import ProgressBar from "@/components/loading/ProgressBar.vue";

export default {
  name: 'App',
  components: {ProgressBar, LoadingSpinner, DashboardSection, LoginSection},
  computed: { ...mapGetters(['isLoggedIn', 'isLoading', 'message', 'messageHistory']) },
}
</script>

<style lang="css">
html, body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: #212121;
  background-color: #fafafa;
  min-width: 340px;
}
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
header, footer {
  display: flex;
  flex-direction: column;
  height: 4rem;
  width: auto;
  background-color: #009bdf;
  justify-content: center;
  align-items: center;
}
header .title {
  font-size: 1.5rem;
  font-weight: 400;
  color: #fff;
}
header .message {
  font-size: 0.75rem;
  color: #fff;
}
footer { margin-top: auto; margin-bottom: 0;}
footer .text-content {
  font-size: 0.75rem;
  font-weight: 400;
  color: #fff;
  text-align: center;
  margin: 0;
  padding: 0;
}
main {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
main.loading-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
span.loading-message {
  font-size: 0.75rem;
  color: #212121;
}
</style>
