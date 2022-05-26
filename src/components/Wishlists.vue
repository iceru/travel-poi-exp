<script setup>
import { computed } from "@vue/runtime-core";
import { useFilterStore } from "../stores/filter";

const storeFilter = useFilterStore();

const isOpen = computed(() => {
  return storeFilter.isOpen;
});
</script>

<template>
  <div class="container-wishlist" v-if="isOpen">
    <div class="icon-close" @click="storeFilter.closeFilter()">
      <BIconXLg />
    </div>
    <div class="title">Wishlist</div>
  </div>
</template>

<script>
export default {
  name: "Filter",
  data() {
    return {
      keywords: "",
      date: new Date(),
      pax: 1,
      duration: 1,
    };
  },
};
</script>

<style lang="scss">
.container-wishlist {
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 75%;
  width: 50%;
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  box-shadow: 0 0 32px rgba($color: #000000, $alpha: 0.4);

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
    display: flex;
    flex-wrap: wrap;
    .form-groups {
      margin-bottom: 1rem;
      width: 50%;

      &.w-100 {
        width: 100%;

        .form-input {
          width: calc(100% - 2rem);
        }
      }
    }
    .form-label {
      display: block;
      margin-bottom: 0.5rem;
    }

    .form-input {
      border-radius: 0.25rem;
      padding: 0.5rem 0.75rem;
      border: 1px solid gray;
      outline: none;
      width: calc(95% - 2rem);
    }
  }
}
</style>
