<template>
  <v-footer id="core-footer" absolute height="82">
    <div class="footer-items">
      <!-- <span v-for="link in links" :key="link.name">
        <a :href="link.Link" class="tertiary--text footer-links">{{ link.name }}</a>
      </span> -->
    </div>
    <v-spacer />
    <span class="font-weight-light copyright">
      Made for
      <v-icon color="tertiary" size="17">mdi-robot</v-icon>by 
      <a href="https://github.com/lschmittalves" target="_blank">Leo</a>
    </span>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    // links: [{ name: "Home", Link: "/#" }]
  })
};
</script>

<style>
#core-footer {
  z-index: 0;
}
</style>
