<script setup>
import { computed } from "@vue/runtime-core";
import { useMapStore } from "../stores/map";
import { useAppStore } from "../stores/app";

const storeMap = useMapStore();
const storeApp = useAppStore();

const markers = computed(() => {
  return storeApp.items.filter((el) => el.data.HasGeocodes);
});

const center = computed(() => {
  return storeMap.center;
});
</script>

<template v-if="dataReady">
  <GMapMap
    :center="center"
    :zoom="7"
    ref="myMapRef"
    map-type-id="terrain"
    :options="{
      streetViewControl: false,
      mapTypeControl: false,
      scaleControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: 'poi',
          stylers: [{ visibility: 'off' }],
        },
      ],
    }"
    style="width: 100vw; height: 100vh"
  >
    <GMapCluster :zoomOnClick="true" :minimumClusterSize="5">
      <GMapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        ref="myMarkerRef"
        :draggable="false"
        :icon="{
          url: iconMap(
            m.data.Type,
            m.data.IndustryCategoryGroups?.length > 0 &&
              m.data.IndustryCategoryGroups[0],
            null
          ),
          scaledSize: { width: 55, height: 75 },
        }"
        @click="
          storeMap.selectMarker(m);
          storeMap.openSidebar();
          checkObject(markers, m);
          showByIndex = index;
        "
        @mouseover="showByIndex = index"
        @mouseout="showByIndex = null"
      >
        <GMapInfoWindow :opened="showByIndex === index">
          <div class="popupImage" v-if="m.data.Type !== 5">
            <img
              v-lazy="
                m.data.Images && m.data.Images.length > 0
                  ? m.data.Images[0].Url
                  : '/images/no_image.png'
              "
              :alt="m.data.Name"
            />
          </div>
          <div class="popupName">
            {{ m.data.Name }}
          </div>
        </GMapInfoWindow>
      </GMapMarker>
    </GMapCluster>
  </GMapMap>
</template>
<script>
import MapDetail from "./MapDetail.vue";
export default {
  name: "GoogleMaps",
  props: ["poi", "exp", "services"],
  data() {
    return {
      markers: [],
      showByIndex: null,
      iconPoi: "/images/poi.png",
      iconPoiSelected: "/images/poi-selected.png",
      iconExp: "/images/experience.png",
      iconActiv: "/images/activity.png",
      iconRestaurant: "/images/restaurant.png",
      iconShop: "/images/shopping.png",
      iconAccomm: "/images/accommodation.png",
      iconExpSelected: "/images/experience-selected.png",
      iconActivSelected: "/images/activity-selected.png",
      iconRestaurantSelected: "/images/restaurant-selected.png",
      iconShopSelected: "/images/shopping-selected.png",
      iconAccommSelected: "/images/accommodation-selected.png",
      path: [],
      pathData: [],
    };
  },
  methods: {
    checkObject(markers, selected) {
      this.$refs.myMarkerRef.map((item) => {
        markers.map((m) => {
          if (
            item.position.lat === m.position.lat &&
            item.position.lng === m.position.lng
          ) {
            item.$markerPromise.then((marker) => {
              const iconProps = {
                url: this.iconMap(
                  m.data.Type,
                  m.data.IndustryCategoryGroups?.length > 0 &&
                    m.data.IndustryCategoryGroups[0],
                  null
                ),
                scaledSize: { width: 55, height: 75 },
              };
              marker.setIcon(iconProps);
            });
          }
        });
        if (
          item.position.lat === selected.position.lat &&
          item.position.lng === selected.position.lng
        ) {
          item.$markerPromise.then((marker) => {
            const iconProps = {
              url: this.iconMap(
                selected.data.Type,
                selected.data.IndustryCategoryGroups?.length > 0 &&
                  selected.data.IndustryCategoryGroups[0],
                true
              ),
              scaledSize: { width: 55, height: 75 },
            };
            marker.setIcon(iconProps);
          });
        }
      });
    },
    iconMap(type, group, selected) {
      let icon = this.iconPoi;
      switch (type) {
        case 6:
          switch (selected) {
            case true:
              icon = this.iconPoiSelected;
              break;
            case null:
              icon = this.iconPoi;
              break;
          }
          break;
        case 5:
          switch (selected) {
            case true:
              icon = this.iconExpSelected;
              break;
            case null:
              icon = this.iconExp;
              break;
          }
          break;
        case 3:
          switch (group) {
            case 0:
              switch (selected) {
                case true:
                  icon = this.iconAccommSelected;
                  break;
                case null:
                  icon = this.iconAccomm;
                  break;
              }
              break;
            case 1:
              switch (selected) {
                case true:
                  icon = this.iconActivSelected;
                  break;
                case null:
                  icon = this.iconActiv;
                  break;
              }
              break;
            case 2:
              switch (selected) {
                case true:
                  icon = this.iconRestaurantSelected;
                  break;
                case null:
                  icon = this.iconRestaurant;
                  break;
              }
              break;
            case 3:
              switch (selected) {
                case true:
                  icon = this.iconShopSelected;
                  break;
                case null:
                  icon = this.iconShop;
                  break;
              }
              break;
          }
      }

      return icon;
    },
  },
  mounted() {
    this.$refs.myMapRef.$mapPromise.then((mapObject) => {
      console.log("map is loaded now", window.google);
    });
  },
  components: { MapDetail },
};
</script>

<style lang="scss">
.popupImage {
  text-align: center;

  img {
    height: 60px;
    width: auto;
    margin-bottom: 4px;
    object-fit: cover;
    border-radius: 4px;
  }
}

.popupName {
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
}

img[src="/images/poi.png"],
img[src="/images/experience.png"],
img[src="/images/activity.png"],
img[src="/images/accommodation.png"],
img[src="/images/restaurant.png"],
img[src="/images/shopping.png"] {
  filter: drop-shadow(0 0 6px black);
  width: 35px !important;
  height: 45px !important;
  left: 50% !important;
  top: 50% !important;
  transform: translate(-50%, -50%);
}

img[src="/images/poi-selected.png"],
img[src="/images/experience-selected.png"],
img[src="/images/activity-selected.png"],
img[src="/images/accommodation-selected.png"],
img[src="/images/restaurant-selected.png"],
img[src="/images/shopping-selected.png"] {
  filter: drop-shadow(0 0 6px red);
  width: 35px !important;
  height: 45px !important;
  left: 50% !important;
  top: 50% !important;
  transform: translate(-50%, -50%);
}
</style>
