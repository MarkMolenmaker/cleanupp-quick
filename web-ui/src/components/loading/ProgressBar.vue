<script>
import {mapGetters} from "vuex";

export default {
  name: 'ProgressBar',
  computed: { ...mapGetters(['progress']) }
}
</script>

<template>
  <div class="progress-bar">
    <div class="progress" :style="{width: progress + '%'}"></div>
  </div>
</template>

<style scoped lang="css">
.progress-bar {
  position: relative;
  display: block;
  width: 100%;
  height: 0.5rem;
  background-color: #fff;
  border: solid 3px #ccc;
  border-radius: 0.25rem;
}
.progress {
  position: absolute;
  display: flex;
  z-index: 1;
  height: 100%;
  background-color: #009bdf;
}
</style>