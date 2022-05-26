<script setup>
import { computed } from "@vue/runtime-core";
import { useMapStore } from "../stores/map";
import MapDetail from "./MapDetail.vue";
import ServiceList from "./ServiceList.vue";
import { useAppStore } from "../stores/app";

const storeMap = useMapStore();
const storeApp = useAppStore();

const selected = computed(() => {
  return storeMap.selectedItem;
});
</script>

<template>
  <div>
    <div class="detail">
      <div class="icon-close" @click="storeMap.resetSelected()">
        <BIconArrowLeft />
        Back
      </div>
      <div
        class="image"
        v-if="selected?.Type !== 5 && selected?.Images?.length < 2"
      >
        <img
          v-lazy="
            selected?.Images && selected?.Images.length === 1
              ? selected?.Images[0].Url
              : '/images/no_image.png'
          "
          alt=""
        />
      </div>
      <carousel :items-to-show="1" v-if="selected?.Images?.length > 1">
        <slide v-for="slide in selected?.Images" :key="slide">
          <img v-lazy="slide.Url" class="img-carousel" :alt="selected?.Name" />
        </slide>

        <template #addons>
          <navigation />
          <pagination />
        </template>
      </carousel>

      <div class="title">
        {{ selected?.Name }}
      </div>
      <div class="address" v-if="selected?.PhysicalAddress">
        {{
          `${selected?.PhysicalAddress?.Line1}, ${selected?.PhysicalAddress?.City}, ${selected?.PhysicalAddress?.State} ${selected?.PhysicalAddress?.CountryName}`
        }}
      </div>
      <div v-if="selected?.LongDescription" class="desc" :class="setReadMore">
        {{ selected?.LongDescription }}
      </div>

      <span
        v-if="
          selected?.LongDescription &&
          selected?.LongDescription.split(' ').length > 50
        "
        class="more"
        @click="more = !more"
        >{{ textMore }}</span
      >
      <div class="wishlist" @click="storeApp.addToWishlists(selected)">
        Add to Wishlists
      </div>
      <div class="check-price" v-if="selected?.Type === 3">
        <h4>Check Price & Availability</h4>
        <div class="forms">
          <input v-model="formValues.date" type="date" />
          <input
            v-model="formValues.pax"
            type="number"
            min="1"
            class="small-input"
          />
          <input
            v-model="formValues.duration"
            type="number"
            min="1"
            class="small-input"
          />
          <button
            type="button"
            class="btn btn-primary"
            @click="storeMap.getQuote(selected?.Children, formValues)"
          >
            Search
          </button>
        </div>
      </div>
      <div class="serviceList">
        <ServiceList />
      </div>
      <div class="path">
        <MapDetail />
      </div>
    </div>
  </div>
</template>

<script>
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

export default {
  name: "Detail",
  data() {
    return {
      more: false,
      formValues: {
        date: new Date(),
        duration: 1,
        pax: 1,
      },
    };
  },
  computed: {
    setReadMore() {
      return this.more ? "active" : "";
    },
    textMore() {
      return this.more ? "Show Less" : "Show More";
    },
  },
  methods: {},
};
</script>

<style lang="scss">
.detail {
  &.active {
    transition: transform 0.5s ease;
    transform: translateX(0);
  }

  .img-carousel {
    width: 100%;
    height: 260px;
    object-fit: cover;
    border-radius: 20px;
  }

  .icon-close {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    margin-bottom: 1rem;
    font-weight: bold;

    svg {
      margin-right: 0.5rem;
    }
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
    color: cornflowerblue;
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

  .check-price {
    input {
      width: 20%;
      margin-right: 1rem;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      border: 1px solid gray;
    }

    .small-input {
      width: 15%;
    }

    .forms {
      display: flex;
    }
  }
}

.carousel__prev,
.carousel__next {
  background-color: cornflowerblue;
}

.carousel__pagination-button {
  background-color: rgba($color: cornflowerblue, $alpha: 0.3);
}
.carousel__pagination-button--active {
  background-color: cornflowerblue;
}
</style>
