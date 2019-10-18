<template>
  <v-content>
    <div id="core-view">
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </div>
    <core-footer/>
  </v-content>
</template>

<script>
export default {
  metaInfo () {
    return {
      title: 'Catolica SC -  Robotic Event Management'
    }
  }
}
</script>

<style>
#core-view {
  padding-bottom: 100px;
}
</style>
