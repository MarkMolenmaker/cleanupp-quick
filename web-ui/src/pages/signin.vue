<template>
  <v-container>
    <v-card rounded="lg" border flat>
      <v-form @submit.prevent="signIn" :disabled="appStore.isLoading">
        <v-card-item>
          <div class="text-subtitle-1 text-medium-emphasis">{{ $vuetify.locale.t('$vuetify.pages.signin.username') }}</div>
          <v-text-field density="compact" :placeholder="$vuetify.locale.t('$vuetify.pages.signin.username_placeholder')" prepend-inner-icon="mdi-email-outline"
                        variant="outlined" v-model="usernameField" />

          <div class="text-subtitle-1 text-medium-emphasis">{{ $vuetify.locale.t('$vuetify.pages.signin.password') }}</div>
          <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                        density="compact" :placeholder="$vuetify.locale.t('$vuetify.pages.signin.password_placeholder')" prepend-inner-icon="mdi-lock-outline" variant="outlined"
                        v-model="passwordField" @click:append-inner="visible = !visible" />
        </v-card-item>
        <v-card-actions>
          <v-btn color="primary" size="large" variant="tonal" :text="$vuetify.locale.t('$vuetify.pages.signin.submit')" type="submit" :disabled="appStore.isLoading" block />
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import {getDashboardData, getSettings} from "../services/cleanupp";
import {useAppStore} from "../stores/app";
import {mapStores} from "pinia";

export default {
  name: 'Signin',
  data () {
    return {
      usernameField: '' as string,
      passwordField: '' as string,
      visible: false as boolean
    }
  },
  computed: {
    ...mapStores(useAppStore)
  },
  methods: {
    signIn() {
      this.appStore.setLoading(true)
      this.appStore.setAuthCredentials(this.usernameField, this.passwordField)
      getSettings()
        .then((response) => {
          this.appStore.setCurrentStore(response['Customer'])
          this.appStore.setLoading(false)
        })
        .then(() => {
          this.$router.push('/')
        })
        .finally(() => {
          this.appStore.setLoading(false)
        })
    }
  }
}
</script>
