<script setup>
import { computed } from "@vue/runtime-core";
import { useMapStore } from "../stores/map";
const storeMap = useMapStore();

const selectedChildren = computed(() => {
  return storeMap.selectedChildren;
});
</script>

<template>
  <div class="lists" v-if="selectedChildren.length > 0">
    <div v-for="children in selectedChildren" class="item">
      <h5 class="item-title">
        {{ children.Configurations[0].Name }}
      </h5>
      <p></p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ServiceList",
};
</script>
