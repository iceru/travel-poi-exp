<script setup>
import GoogleMaps from "@/components/Maps.vue";
import ListItems from "../components/ListItems.vue";
import Filter from "../components/Filter.vue";

import { onMounted } from "vue";
import { usePoiStore } from "../stores/poi";
import Wishlists from "../components/Wishlists.vue";
import { useFilterStore } from "../stores/filter";

const storePoi = usePoiStore();
const storeFilter = useFilterStore();

onMounted(() => {
  storePoi.fetchPoi();
  storeFilter.getLocations();
});
</script>

<template>
  <main>
    <GoogleMaps />
    <ListItems />
    <Filter />
    <Wishlists />
  </main>
</template>

<script>
export default {
  name: "HomeView",
};
</script>
