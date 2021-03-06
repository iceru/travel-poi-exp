<script setup>
import { useFilterStore } from "../stores/filter";
import { computed } from "@vue/runtime-core";
import { useMapStore } from "../stores/map";
import { useAppStore } from "../stores/app";
import { useWishlistsStore } from "../stores/wishlists";
import Detail from "./Detail.vue";
import { useServicesStore } from "../stores/services";
import { currencyFormatter } from "../helpers/formatter";

const storeFilter = useFilterStore();
const storeApp = useAppStore();
const storeMap = useMapStore();
const storeServices = useServicesStore();
const storeWishlists = useWishlistsStore();

const selected = computed(() => {
  return storeMap.selectedItem;
});

const itemsLoading = computed(() => {
  return storeApp.itemsLoading;
});

const sortedItems = computed(() => {
  return storeApp.sortedItems;
});

const experiences = computed(() => {
  return storeApp.items
    .filter((el) => el.data.Type === 5)
    .sort((a, b) => a.data?.Name?.localeCompare(b.data?.Name));
});

const sidebar = computed(() => {
  return storeMap.sidebarOpen;
});

const currentPage = computed(() => {
  return storeApp.currentPage;
});
const maxPerPage = computed(() => {
  return storeApp.maxPerPage;
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
  <div class="iconWishlists" @click="storeWishlists.toggleWishlists()">
    {{ $t("t.wishlists") }}
    <span class="counter">{{ storeWishlists.wishlists.length }}</span>
    <BIconHeartFill />
  </div>
  <div class="container" :class="sidebar ? 'active' : ''">
    <div class="itemsLoad" v-if="itemsLoading">
      <img src="/images/loading.gif" alt="" />
    </div>
    <div v-if="Object.keys(selected).length === 0 && !itemsLoading">
      <div class="actions">
        <div @click="storeFilter.openFilter()" class="filterButton">
          <BIconFilter /> {{ $t("t.filter") }}
        </div>
        <div class="selection">
          <select v-model="storeApp.lang">
            <option
              v-for="locale in $i18n.availableLocales"
              :key="`locale-${locale}`"
              :value="locale"
            >
              {{ locale.slice(0, 2) }}
            </option>
          </select>
          <select
            v-model="storeApp.currency"
            @change="storeServices.fetchServices()"
          >
            <option v-for="curr in currencies" :value="curr">{{ curr }}</option>
          </select>
        </div>
      </div>
      <p class="experiences-title" v-if="experiences.length > 0">Experiences</p>
      <div class="listItems experiences" v-if="experiences.length > 0">
        <div v-for="item in experiences" :key="item.data.Id" class="item">
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
          <div class="itemDesc" v-if="item.data.LongDescription">
            {{ item.data.LongDescription }}
          </div>
        </div>
      </div>
      <div class="listItems">
        <div v-for="item in sortedItems" :key="item.data.Id" class="item">
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

          <div v-if="item.data.Type === 3">
            <div
              class="wishlistBtn"
              @click="storeWishlists.addToWishlists(item.data)"
              v-if="!item.data.Wishlist"
            >
              <BIconHeart />
            </div>
            <div
              class="wishlistBtn"
              @click="storeWishlists.removeWishlist(item.data)"
              v-if="item.data.Wishlist"
            >
              <BIconHeartFill />
            </div>
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
            Starts From
            {{
              currencyFormatter(
                storeApp.currency,
                item.data.Availability?.Calendar?.LowestRate
              )
            }}
          </div>
        </div>
      </div>
      <div
        class="loadMore"
        v-on:click="storeApp.loadMore()"
        v-if="currentPage * maxPerPage < storeApp.items.length"
      >
        Load More
      </div>
    </div>

    <Detail v-if="Object.keys(selected).length > 0 && !itemsLoading" />
  </div>
</template>

<script>
import { useAppStore } from "../stores/app";

export default {
  name: "ListItems",
  data() {
    return {
      showLoadMore: true,
      currencies: ["GBP", "USD"],
    };
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
  },
};
</script>

<style lang="scss" scoped>
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
  font-size: 1rem;

  &.active {
    transition: all 0.2s ease;
    left: 34%;
  }

  .counter {
    position: absolute;
    right: 19px;
    top: 50%;
    transform: translateY(-50%);
    font-weight: bold;
    color: white;
    font-size: 12px;
  }

  svg {
    margin-left: 0.5rem;
    margin-bottom: -3px;
    font-size: 20px;
  }
}

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
    left: 35%;

    @media screen and (min-width: 1400px) {
      left: 34%;
    }
  }

  svg {
    font-size: 1.25rem;
  }
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

  .loadMore {
    width: calc(100% - 1rem);
    text-align: center;
    background-color: #404040;
    color: white;
    padding: 0.75rem;
    cursor: pointer;
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .itemsLoad {
    position: absolute;
    z-index: 3;
    background-color: white;
    width: 100%;
    top: 0;
    left: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 40px;
      margin-top: -2rem;
    }
  }

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
    display: flex;
    justify-content: space-between;

    .selection {
      display: flex;
    }

    select {
      padding: 0.5rem 0.75rem;
      margin-left: 0.5rem;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .filterButton {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      font-weight: bold;
      color: white;
      background-color: rgba(0, 0, 0, 0.75);

      svg {
        margin-right: 0.25rem;
      }
    }
  }

  .experiences-title {
    margin-bottom: 1rem;
    background-color: #a7d129;
    display: inline-block;
    margin-top: 0.5rem;
    padding: 0.25rem 0.75rem;
    font-weight: normal;
    color: white;
    font-size: 14px;
    border-radius: 100px;
  }

  .listItems {
    display: grid;
    grid-template-columns: repeat(2, 50%);
    gap: 12px;
    padding-bottom: 1rem;

    &.experiences {
      padding-bottom: 1rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid lightgray;

      .item {
        margin-bottom: 0.5rem;

        .itemBadge {
          display: none;
        }

        .wishlistBtn {
          position: relative;
          top: 0;
          left: 0;
          margin-bottom: 0.5rem;
        }
      }
    }

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

      .wishlistBtn {
        position: absolute;
        top: 0.5rem;
        left: 0.5rem;
        background-color: rgba($color: #000000, $alpha: 0.75);
        color: white;
        width: 23px;
        height: 23px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;

        svg {
          margin-bottom: -1px;
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
