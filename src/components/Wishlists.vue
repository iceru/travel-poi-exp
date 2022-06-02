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
  <div class="overlay-bg" v-if="wishlistsModal"></div>
  <div class="container-wishlist" v-if="wishlistsModal">
    <div class="icon-close" @click="storeApp.closeWishlists()">
      <BIconXLg />
    </div>
    <div class="title">Wishlist</div>
    <div class="wishlist-items">
      <div class="item" v-for="item in wishlists">
        <div class="wish-img">
          <img
            v-lazy="item.Images ? item.Images[0].Url : '/images/no_image.png'"
            alt=""
          />
        </div>
        <div>
          <h5 class="wish-title">{{ item.Name }}</h5>
          <p class="wish-desc">{{ item.LongDescription }}</p>
        </div>
        <div class="icon-delete" @click="storeApp.removeWishlist(item)">
          <div>
            <BIconTrash />
          </div>
        </div>
      </div>
      <div class="empty" v-if="wishlists.length === 0">
        Wishlists is Empty
        <BIconEmojiFrown />
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
  z-index: 6;

  .empty {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      margin-left: 0.5rem;
      margin-bottom: -2px;
    }
  }

  .icon-close {
    text-align: end;
    cursor: pointer;
  }

  .title {
    font-size: 20px;
    margin-bottom: 1rem;
    font-weight: bold;
  }

  .item {
    display: flex;
    align-items: center;

    .wish-img {
      margin-right: 1rem;

      img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
      }
    }

    .wish-title {
      margin-bottom: 4px;
      margin-top: 0;
    }

    .wish-desc {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-size: 12px;
      margin: 0;
    }

    .icon-delete {
      font-size: 18px;
      background-color: red;
      color: white;
      padding: 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      margin-left: 1rem;
      cursor: pointer;

      svg {
        margin-bottom: -3px;
      }
    }
  }
}
</style>
