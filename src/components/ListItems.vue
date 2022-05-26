<script setup>
import { useFilterStore } from "../stores/filter";
import { computed } from "@vue/runtime-core";
import { useMapStore } from "../stores/map";
import { useAppStore } from "../stores/app";
import Detail from "./Detail.vue";

const storeFilter = useFilterStore();
const storeApp = useAppStore();
const storeMap = useMapStore();

const selected = computed(() => {
  return storeMap.selectedItem;
});

const items = computed(() => {
  return storeApp.items?.sort((a, b) =>
    a.data?.Name?.localeCompare(b.data?.Name)
  );
});

const sidebar = computed(() => {
  return storeMap.sidebarOpen;
});
</script>

<template>
  <div
    class="iconOpen"
    @click="storeMap.toggleSidebar()"
    :class="sidebar ? 'active' : ''"
  >
    <BIconLayoutSidebarInset />
  </div>
  <div class="iconWishlists" @click="storeApp.toggleWishlists()">
    Wishlists
    <BIconHeartFill />
  </div>
  <div class="container" :class="sidebar ? 'active' : ''">
    <div v-if="Object.keys(selected).length === 0">
      <div class="actions">
        <div @click="storeFilter.openFilter()" class="filterButton">
          <BIconFilter /> Filter
        </div>
      </div>
      <div class="listItems">
        <div v-for="item in paginatedItems" :key="item.data.Id" class="item">
          <div class="itemImage" @click="storeMap.selectMarker(item)">
            <img
              v-lazy="
                item.data.Images
                  ? item.data.Images[0].Url
                  : '/images/no_image.png'
              "
              alt=""
            />
          </div>
          <div
            class="itemBadge"
            :class="
              typeName(
                item.data.Type,
                item.data.IndustryCategoryGroups?.length > 0 &&
                  item.data.IndustryCategoryGroups[0],
                'class'
              )
            "
          >
            {{
              typeName(
                item.data.Type,
                item.data.IndustryCategoryGroups?.length > 0 &&
                  item.data.IndustryCategoryGroups[0],
                "text"
              )
            }}
          </div>
          <div class="itemTitle" @click="storeMap.selectMarker(item)">
            {{ item.data.Name }}
          </div>
          <div class="itemDesc">{{ item.data.LongDescription }}</div>
          <div class="itemPrice" v-if="item.data.Type === 3">
            Starts From £{{ item.data.Availability?.Calendar?.LowestRate }}
          </div>
          <div class="wishlist" @click="storeApp.addToWishlists(item.data)">
            Add to Wishlists
          </div>
        </div>
      </div>
      <div
        class="loadMore"
        v-on:click="loadMore"
        v-if="currentPage * maxPerPage < items.length"
      >
        Load More
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
      currentPage: 1,
      maxPerPage: 10,
      showLoadMore: true,
    };
  },
  computed: {
    totalItems() {
      return Object.keys(this.items).length;
    },
    paginatedItems() {
      return this.items.slice(0, this.currentPage * this.maxPerPage);
    },
  },
  methods: {
    typeName(type, group, typeOutput) {
      let badgeName = "Service";
      switch (type) {
        case 6:
          badgeName = "Point of Interest";
          break;
        case 5:
          badgeName = "Experience";
          break;
        case 3:
          switch (group) {
            case 0:
              badgeName = "Accommodation";
              break;
            case 1:
              badgeName = "Activity";
              break;
            case 2:
              badgeName = "Restaurant";
              break;
            case 3:
              badgeName = "Shopping";
              break;
          }
      }
      badgeName =
        typeOutput === "class"
          ? badgeName.replace(/ /g, "-").toLowerCase()
          : badgeName;

      return badgeName;
    },
    loadMore() {
      this.currentPage += 1;
    },
  },
};
</script>

<style lang="scss" scoped>
.iconOpen {
  position: absolute;
  left: 1rem;
  top: 1rem;
  background-color: white;
  padding: 0.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 0 15px 4px rgba($color: #000000, $alpha: 0.2);
  &.active {
    transition: all 0.2s ease;
    left: 34%;
  }

  svg {
    font-size: 1.5rem;
  }
}

.iconWishlists {
  position: absolute;
  right: 1rem;
  top: 1rem;
  background-color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 0 15px 4px rgba($color: #000000, $alpha: 0.2);
  font-size: 1.25rem;
  &.active {
    transition: all 0.2s ease;
    left: 34%;
  }

  svg {
    margin-left: 0.5rem;
    margin-bottom: -3px;
  }
}

.loadMore {
  width: calc(100% - 1rem);
  text-align: center;
  background-color: cornflowerblue;
  color: white;
  padding: 0.5rem;
  cursor: pointer;
  margin-bottom: 2rem;
}
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
  transform: translateX(-100%);
  transition: all 0.2s ease;
  box-shadow: 8px 0 20px rgba($color: #000000, $alpha: 0.15);

  &.active {
    transition: all 0.2s ease;
    transform: translateX(0);
  }

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
      cursor: pointer;
      position: relative;
      .itemImage {
        margin-bottom: 0.5rem;
        img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
        }
      }

      .itemBadge {
        position: absolute;
        top: 8px;
        right: 8px;
        background-color: rgba($color: gray, $alpha: 0.75);
        color: white;
        border-radius: 100px;
        padding: 4px 12px;

        &.point-of-interest {
          background-color: rgba($color: #7868e6, $alpha: 0.75);
        }

        &.experience {
          background-color: rgba($color: #a7d129, $alpha: 0.75);
        }

        &.activity {
          background-color: rgba($color: #ea5455, $alpha: 0.75);
        }

        &.accommodation {
          background-color: rgba($color: #2d4059, $alpha: 0.75);
        }

        &.restaurant {
          background-color: rgba($color: #f07b3f, $alpha: 0.75);
        }

        &.shopping {
          background-color: rgba($color: #ffd460, $alpha: 0.75);
        }
      }

      .itemTitle {
        font-weight: bold;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        margin-bottom: 4px;
      }

      .itemPrice {
        margin-top: 4px;
        font-weight: bold;
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
