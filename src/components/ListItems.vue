<script setup>
import { useFilterStore } from "../stores/filter";
import MapDetail from "./MapDetail.vue";
import { computed } from "@vue/runtime-core";
import { useMapStore } from "../stores/map";
import Detail from "./Detail.vue";

const storeFilter = useFilterStore();

const storeMap = useMapStore();

const selected = computed(() => {
  return storeMap.selectedItem;
});
</script>

<template>
  <div class="container">
    <div v-if="Object.keys(selected).length === 0">
      <div class="actions">
        <div @click="storeFilter.openFilter()" class="filterButton">
          <BIconFilter /> Filter
        </div>
      </div>
      <div class="listItems">
        <div v-for="item in items" :key="item.Id" class="item">
          <div class="itemImage">
            <img
              :src="item.Images ? item.Images[0].Url : '/images/no_image.png'"
              alt=""
            />
          </div>
          <div class="itemTitle">{{ item.Name }}</div>
          <div class="itemDesc">{{ item.LongDescription }}</div>
        </div>
      </div>
    </div>

    <Detail v-if="Object.keys(selected).length > 0" />
  </div>
</template>

<script>
export default {
  name: "ListItems",
  props: ["services", "poi", "exp"],
  data() {
    return {
      items: [],
    };
  },
  watch: {
    poi(newPoi) {
      if (newPoi.length > 0) {
        this.items.push(...this.poi);
      }
    },
    exp(newExp) {
      if (newExp.length > 0) {
        this.items.push(...this.exp);
      }
    },
    services(newServices) {
      if (newServices.length > 0) {
        this.items.push(...this.services);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: calc(30% + 1rem);
  overflow-y: auto;
  position: absolute;
  height: 99%;
  padding: 1rem;
  padding-bottom: 1rem;
  top: 0;
  left: 0;
  background-color: white;
  box-shadow: 8px 0 20px rgba($color: #000000, $alpha: 0.15);

  @media screen and (max-width: 576px) {
    width: calc(100vw - 2rem);
    padding: 1rem;
  }

  .actions {
    margin-bottom: 1rem;
    .filterButton {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      padding: 0.5rem;
      border: 1px solid black;
      border-radius: 8px;
      font-weight: bold;

      svg {
        margin-right: 0.25rem;
      }
    }
  }
  .listItems {
    display: grid;
    grid-template-columns: repeat(2, 50%);
    gap: 12px;
    padding-bottom: 1rem;

    .item {
      margin-bottom: 1rem;
      font-size: 12px;
      .itemImage {
        img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
        }
      }

      .itemTitle {
        font-weight: bold;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        margin-bottom: 4px;
      }

      .itemDesc {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font-size: 12px;
      }
    }
  }
}
</style>
