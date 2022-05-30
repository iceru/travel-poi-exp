<script setup>
import GoogleMaps from "@/components/Maps.vue";
import ListItems from "../components/ListItems.vue";
import Filter from "../components/Filter.vue";

import { computed, onMounted } from "vue";
import { usePoiStore } from "../stores/poi";
import { useExperiencesStore } from "../stores/experiences";
import { useServicesStore } from "../stores/services";
import Wishlists from "../components/Wishlists.vue";
import { useFilterStore } from "../stores/filter";

const storePoi = usePoiStore();
const storeExp = useExperiencesStore();
const storeServices = useServicesStore();
const storeFilter = useFilterStore();

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
  storeFilter.getLocations();
});
</script>

<template>
  <main>
    <GoogleMaps :services="services" :poi="poi" :exp="exp" />
    <ListItems :services="services" :poi="poi" :exp="exp" />
    <Filter />
    <Wishlists />
  </main>
</template>

<script>
export default {
  name: "HomeView",
};
</script>
