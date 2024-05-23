<template>
  <v-footer class="justify-center" color="primary" height="40" app>
    <span class="text-caption">{{ $vuetify.locale.t('$vuetify.app.version') }}</span>
  </v-footer>
</template>

<script lang="ts">
export default {
  name: 'AppFooter'
}
</script>

<style lang="sass" scoped>
</style>
