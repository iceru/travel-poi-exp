<script setup>
import GoogleMaps from "@/components/Maps.vue";
import ListItems from "../components/ListItems.vue";
</script>

<template>
  <main>
    <GoogleMaps
      :services="services"
      :poi="poi"
      :exp="exp"
      :dataReady="dataReady"
    />
    <ListItems :services="services" />
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
      services: [],
      dataReady: false,
    };
  },
  methods: {
    async getExperiences() {
      await this.axios
        .post(url.endpoints.search, url.body(5, "TestDistributor"))
        .then((response) => {
          this.exp = response.data.Entities;
          this.dataReady = true;
        });
    },

    async getServices() {
      await this.axios
        .post(url.endpoints.search, url.bodyServices)
        .then((response) => {
          this.services = response.data.Entities;
          console.log(this.services);
        });
    },
  },
  async beforeCreate() {
    await this.axios
      .post(url.endpoints.search, url.body(6, "TestDistributor"))
      .then((response) => {
        this.poi = response.data.Entities;

        this.getExperiences();
        this.getServices();
      });
  },
};
</script>
