<script setup>
import GoogleMaps from "@/components/Maps.vue";
</script>

<template>
  <main>
    <GoogleMaps :poi="poi" :exp="exp" :dataReady="dataReady" />
  </main>
</template>

<script>
import url from "@/helpers/endpoints.js";
export default {
  name: "HomeView",
  data() {
    return {
      poi: [],
      exp: [],
      dataReady: false,
    };
  },
  async beforeCreate() {
    await this.axios
      .post(url.endpoints.search, url.body(6, "TestDistributor"))
      .then((response) => {
        this.poi = response.data.Entities;
        this.dataReady = true;
      });
    await this.axios
      .post(url.endpoints.search, url.body(5, "TestDistributor"))
      .then((response) => (this.exp = response.data.Entities));
  },
};
</script>
