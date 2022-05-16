<script setup>
import GoogleMaps from "@/components/Maps.vue";
import ListItems from "../components/ListItems.vue";
import Filter from "../components/Filter.vue";

import { computed, onMounted } from "vue";
import { usePoiStore } from "../stores/poi";
import { useExperiencesStore } from "../stores/experiences";
import { useServicesStore } from "../stores/services";

const storePoi = usePoiStore();
const storeExp = useExperiencesStore();
const storeServices = useServicesStore();

const poi = computed(() => {
  return storePoi.poi;
});

const exp = computed(() => {
  return storeExp.experiences;
});

const services = computed(() => {
  return storeServices.services;
});

onMounted(() => {
  storePoi.fetchPoi();
  storeExp.fetchExperiences();
  storeServices.fetchServices();
});
</script>

<template>
  <main>
    <GoogleMaps :services="services" :poi="poi" :exp="exp" />
    <ListItems :services="services" :poi="poi" :exp="exp" />
    <Filter />
  </main>
</template>

<script>
export default {
  name: "HomeView",
};
</script>
