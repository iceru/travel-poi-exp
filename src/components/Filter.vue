<script setup>
import { computed } from "@vue/runtime-core";
import { useFilterStore } from "../stores/filter";

const storeFilter = useFilterStore();

const isOpen = computed(() => {
  return storeFilter.isOpen;
});
</script>

<template>
  <div class="container-filter" v-if="isOpen">
    <div class="icon-close" @click="storeFilter.closeFilter()">
      <BIconXLg />
    </div>
    <div class="title">Filter</div>
    <div class="forms">
      <div class="form-groups">
        <label class="form-label" for="">Keywords</label>
        <input class="form-input" type="text" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Filter",
};
</script>

<style lang="scss">
.container-filter {
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 75%;
  width: 50%;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 0 32px rgba($color: #000000, $alpha: 0.2);

  .icon-close {
    text-align: end;
    cursor: pointer;
  }

  .title {
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 1rem;
  }

  .forms {
    .form-label {
      display: block;
      margin-bottom: 0.5rem;
    }

    .form-input {
      border-radius: 0.25rem;
      padding: 0.5rem 0.75rem;
      border: 1px solid gray;
      outline: none;
    }
  }
}
</style>
