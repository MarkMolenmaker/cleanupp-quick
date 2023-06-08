<script>
export default {
  name: 'LoginSection',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      this.$store.dispatch('login', {
        username: this.username,
        password: this.password
      })
    }
  }
}
</script>

<template>
  <section class="login-container">
    <form @submit.prevent="login">
      <label class="text">
        <span>Gebruikersnaam</span>
        <input type="text" v-model="username">
      </label>
      <label class="text">
        <span>Wachtwoord</span>
        <input type="password" v-model="password">
      </label>
      <button type="submit">Inloggen</button>
    </form>
  </section>
</template>

<style scoped lang="css">
.login-container {
  display: flex;
  justify-content: center;
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