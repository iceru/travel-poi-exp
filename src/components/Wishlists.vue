<script setup>
import { computed } from "@vue/runtime-core";
import { useAppStore } from "../stores/app";

const storeApp = useAppStore();

const wishlistsModal = computed(() => {
  return storeApp.wishlistsModal;
});

const wishlists = computed(() => {
  return storeApp.wishlists;
});
</script>

<template>
  <div class="container-wishlist" v-if="wishlistsModal">
    <div class="icon-close" @click="storeApp.closeWishlists()">
      <BIconXLg />
    </div>
    <div class="title">Wishlist</div>
    <div class="wishlist-items">
      <div class="item" v-for="item in wishlists">
        <div class="title">{{ item.Name }}</div>
      </div>
    </div>
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
