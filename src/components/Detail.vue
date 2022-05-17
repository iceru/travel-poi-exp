<script setup>
import { computed } from "@vue/runtime-core";
import { useMapStore } from "../stores/map";

const storeMap = useMapStore();

const selected = computed(() => {
  return storeMap.selectedItem;
});
</script>

<template>
  <div>
    <div class="detail">
      <div class="icon-close" @click="storeMap.resetSelected()">
        <BIconXLg />
      </div>
      <div class="image" v-if="selected?.Type !== 5">
        <img
          :src="
            selected?.Images && selected?.Images.length > 0
              ? selected?.Images[0].Url
              : '/images/no_image.png'
          "
          alt=""
        />
      </div>
      <div class="title">
        {{ selected?.Name }}
      </div>
      <div class="address" v-if="selected?.PhysicalAddress">
        {{
          `${selected?.PhysicalAddress?.Line1}, ${selected?.PhysicalAddress?.City}, ${selected?.PhysicalAddress?.State}, ${selected?.PhysicalAddress?.CountryName}`
        }}
      </div>
      <div v-if="selected?.LongDescription" class="desc" :class="setReadMore">
        {{ selected?.LongDescription }}
      </div>
      <span
        v-if="
          selected?.LongDescription &&
          selected?.LongDescription.split(' ').length > 35
        "
        class="more"
        @click="more = !more"
        >{{ textMore }}</span
      >
      <div class="path" v-if="selected?.Type === 5">
        <MapDetail :center="center" :path="path" :pathData="pathData" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.detail {
  &.active {
    transition: transform 0.5s ease;
    transform: translateX(0);
  }

  .icon-close {
    text-align: right;
    cursor: pointer;
    margin-bottom: 1rem;
  }

  .address {
    margin-bottom: 0.5rem;
    font-size: small;
  }

  .title {
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 0.5rem;
  }

  .more {
    margin-bottom: 1rem;
    cursor: pointer;
    font-size: 14px;
    color: lightseagreen;
  }

  .desc {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    font-size: 14px;

    &.active {
      display: block;
    }
  }

  .image {
    margin-bottom: 1rem;
    img {
      width: 100%;
      height: 30vh;
      object-fit: cover;
      border-radius: 8px;
    }
  }
}
</style>
