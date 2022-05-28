<script setup>
import { computed } from "@vue/runtime-core";
import { useAppStore } from "../stores/app";
import { useMapStore } from "../stores/map";

const storeMap = useMapStore();
const storeApp = useAppStore();

const path = computed(() => {
  return storeMap.path;
});

const pathData = computed(() => {
  return storeMap.getPathData;
});

const markers = computed(() => {
  let filterdMarkers = storeApp.items.filter(
    (el) => el.data.Type !== 5 && el.data.HasGeocodes
  );
  return filterdMarkers;
});
</script>

<template>
  <div class="mapDetailContainer" v-if="pathData.length > 1">
    <GMapMap :center="centerDetail" :zoom="zoom" :options="{
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      scaleControl: false,
      fullscreenControl: false,
    }" map-type-id="terrain" style="width: 100%; height: 22vw">
      <!-- <GMapMarker
        :key="index"
        v-for="(m, index) in pathData"
        :position="m.position"
        :clickable="true"
        :draggable="false"
        @click="selectMarkerDetail(m)"
        @mouseover="showByIndex = index"
        @mouseout="showByIndex = null"
      >
        <GMapInfoWindow :opened="showByIndex === index">
          <div class="popupTitle">{{ m.data.Title }}</div>
          <div class="popupDesc">{{ m.data.Description }}</div>
        </GMapInfoWindow>
      </GMapMarker> -->
      <GMapMarker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="true" :draggable="false"
        :icon="{
          url: iconMap(
            m.data.Type,
            m.data.IndustryCategoryGroups?.length > 0 &&
            m.data.IndustryCategoryGroups[0]
          ),
          scaledSize: { width: 35, height: 45 },
        }" @click="selectMarkerDetail(m)" @mouseover="showByIndex = index" @mouseout="showByIndex = null">
        <GMapInfoWindow :opened="showByIndex === index">
          <div class="popupImage" v-if="m.data.Type !== 5">
            <img v-lazy="
              m.data.Images && m.data.Images.length > 0
                ? m.data.Images[0].Url
                : '/images/no_image.png'
            " :alt="m.data.Name" />
          </div>
          <div class="popupTitle">{{ m.data.Name }}</div>
          <div class="popupDesc">{{ m.data.LongDescription }}</div>
        </GMapInfoWindow>
      </GMapMarker>
      <GMapPolyline :path="path" :options="{
        strokeColor: '#B311CF',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        icons: [
          { icon: lineSymbol, offset: '95%' },
          { icon: lineSymbol, offset: '75%' },
          { icon: lineSymbol, offset: '50%' },
          { icon: lineSymbol, offset: '25%' },
          { icon: lineSymbol, offset: '5%' },
        ],
      }" :editable="false" ref="polyline" />
    </GMapMap>
    <div class="popupInfo">Click on a pin to see more details</div>
    <div class="navDetail" v-if="selected">
      <div class="btnWrapper">
        <a href="#" @click="goToStart" class="left">Start</a>
        <a href="#" @click="prevMarker" v-show="itenary > 0">
          <BIconChevronLeft />&nbsp; Prev
        </a>
      </div>

      <div class="btnWrapper">
        <a href="#" class="left" v-show="itenary < pathData.length - 1" @click="nextMarker">Next &nbsp;
          <BIconChevronRight />
        </a>
        <a href="#" @click="goToFinish">Finish</a>
      </div>
    </div>
    <div class="detailPin" v-if="selected">
      <div class="title">
        {{ selected?.data?.Title }}
      </div>
      <div class="desc">
        {{ selected?.data?.Description }}
      </div>
    </div>

    <div class="detailActivity" v-if="selectedActivity">
      <div class="image" v-if="
        selectedActivity?.data?.Type !== 5 &&
        selectedActivity?.data?.Images?.length < 2
      ">
        <img v-lazy="
          selectedActivity?.data?.Images &&
            selectedActivity?.data?.Images.length === 1
            ? selectedActivity?.data?.Images[0].Url
            : '/images/no_image.png'
        " alt="" />
      </div>
      <carousel :items-to-show="1" v-if="selectedActivity?.data?.Images?.length > 1">
        <slide v-for="slide in selectedActivity?.data?.Images" :key="slide">
          <img v-lazy="slide.Url" class="img-carousel" :alt="selectedActivity?.data?.Name" />
        </slide>

        <template #addons>
          <navigation />
          <pagination />
        </template>
      </carousel>
      <div class="title">
        {{ selectedActivity?.data?.Name }}
      </div>
      <div class="desc">
        {{ selectedActivity?.data?.LongDescription }}
      </div>
      <div class="wishlist" v-if="selectedActivity?.Type !== 5" @click="storeApp.addToWishlists(selectedActivity)">
        Add to Wishlists
      </div>
    </div>
  </div>
</template>

<script>
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import { useMapStore } from "../stores/map";

export default {
  name: "MapDetail",
  setup() {
    const storeMap = useMapStore();
    const pathDataAct = computed(() => {
      return storeMap.pathData;
    });
    return { pathDataAct };
  },
  data() {
    return {
      selected: null,
      selectedActivity: null,
      zoom: 8,
      itenary: 0,
      pathData: this.pathDataAct,
      showByIndex: null,
      centerDetail: { lat: 51.5072, lng: 0.1276 },
      lineSymbol: {
        path: "M -4,0 0,0 4,0 0,-4 z",
        strokeColor: "#F00",
        fillColor: "#F00",
        fillOpacity: 1,
      },
      iconPoi: "/images/poi.png",
      iconExp: "/images/experience.png",
      iconActiv: "/images/activity.png",
      iconRestaurant: "/images/restaurant.png",
      iconShop: "/images/shopping.png",
      iconAccomm: "/images/accommodation.png",
    };
  },
  watch: {
    pathDataAct: function (newPathdata, oldPathData) {
      if (this.pathData.length > 0) {
        this.startMapDetail();
      }
    },
  },
  methods: {
    selectMarkerDetail(geo) {
      this.selected = geo;
      this.itenary = geo?.id;
      this.zoom = 10;
      this.selectedActivity = geo;
    },

    positioning(itenary) {
      this.selected = this.pathData[itenary];
      this.centerDetail.lat = this.selected.position.lat;
      this.centerDetail.lng = this.selected.position.lng;
    },

    nextMarker() {
      if (this.itenary < this.pathData.length - 1) {
        this.itenary++;
        this.zoom = 10;
        this.positioning(this.itenary);
      }
    },

    prevMarker() {
      if (this.itenary > 0) {
        this.itenary--;
        this.positioning(this.itenary);
      }
    },
    goToStart() {
      this.itenary = 0;
      this.positioning(this.itenary);
    },

    goToFinish() {
      this.itenary = this.pathData.length - 1;
      this.positioning(this.itenary);
    },
    startMapDetail() {
      this.selectMarkerDetail(this.pathData[0]);
      this.zoom = 10;
      this.centerDetail.lat = this.selected?.position?.lat;
      this.centerDetail.lng = this.selected?.position?.lng;
    },

    iconMap(type, group) {
      let icon = this.iconPoi;
      switch (type) {
        case 6:
          icon = this.iconPoi;
          break;
        case 5:
          icon = this.iconExp;
          break;
        case 3:
          switch (group) {
            case 0:
              icon = this.iconAccomm;
              break;
            case 1:
              icon = this.iconActiv;
              break;
            case 2:
              icon = this.iconRestaurant;
              break;
            case 3:
              icon = this.iconShop;
              break;
          }
      }

      return icon;
    },
  },
  mounted() {
    console.log(this.pathData);
    if (this.pathData) {
      this.startMapDetail();
    }
  },
};
</script>

<style lang="scss" scoped>
.mapDetailContainer {
  position: relative;
}

.btnWrapper {
  display: flex;

  .left {
    margin-right: 0.5rem;
  }
}

.navDetail {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;

  a {
    color: white;
    display: flex;
    align-items: center;
    text-decoration: none;
    background: cornflowerblue;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 12px;

    svg {
      width: 10px;
      height: 10px;
      margin-top: 1.5px;
    }

    &:hover {
      text-decoration: none;
    }
  }
}

.detailActivity {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid lightgray;
  margin-bottom: 3rem;
}

.popupInfo {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  background: rgba($color: cornflowerblue, $alpha: 0.8);
  color: white;
  font-size: small;
}

.popupTitle {
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 4px;
}

.popupDesc {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-size: 10px;
}

.desc {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-size: 12px;
}

.detailPin {
  margin-top: 0.5rem;
}
</style>
