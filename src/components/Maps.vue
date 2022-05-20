<script setup>
import { computed } from "@vue/runtime-core";
import { useMapStore } from "../stores/map";

const storeMap = useMapStore();

const center = computed(() => {
  return storeMap.center;
});
</script>

<template v-if="dataReady">
  <GMapMap
    :center="center"
    :zoom="7"
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
        :draggable="false"
        :icon="{
          url: iconMap(
            m.data.Type,
            m.data.IndustryCategoryGroups?.length > 0 &&
              m.data.IndustryCategoryGroups[0]
          ),
          scaledSize: { width: 45, height: 60 },
        }"
        @click="
          storeMap.selectMarker(m);
          selectMarker(m);
          storeMap.openSidebar();
        "
        @mouseover="showByIndex = index"
        @mouseout="showByIndex = null"
      >
        <GMapInfoWindow :opened="showByIndex === index">
          <div class="popupImage" v-if="m.data.Type !== 5">
            <img
              :src="
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
      iconExp: "/images/experience.png",
      iconActiv: "/images/activity.png",
      iconRestaurant: "/images/restaurant.png",
      iconShop: "/images/shopping.png",
      iconAccomm: "/images/accommodation.png",
      path: [],
      pathData: [],
    };
  },
  watch: {
    poi(newPoi) {
      if (newPoi.length > 0) {
        this.getMarkers();
      }
    },
    exp(newExp) {
      if (newExp.length > 0) {
        this.getExpMarkers();
      }
    },

    services(newServices) {
      if (newServices.length > 0) {
        this.getServiceMarkers();
      }
    },
  },
  methods: {
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
    getMarkers() {
      this.poi.map((item) => {
        if (item.HasGeocodes) {
          this.markers.push({
            data: item,
            position: {
              lat: item.Geocodes[0].Geocode.Latitude,
              lng: item.Geocodes[0].Geocode.Longitude,
            },
          });
        }
      });
    },
    getExpMarkers() {
      this.exp.map((item) => {
        if (item.HasGeocodes) {
          this.markers.push({
            data: item,
            position: {
              lat: item.Geocodes[0].Geocode.Latitude,
              lng: item.Geocodes[0].Geocode.Longitude,
            },
          });
        }
      });
    },

    getServiceMarkers() {
      this.services.map((item) => {
        if (item.HasGeocodes) {
          this.markers.push({
            data: item,
            position: {
              lat: item.Geocodes[0].Geocode.Latitude,
              lng: item.Geocodes[0].Geocode.Longitude,
            },
          });
        }
      });
    },

    selectMarker(item) {
      this.more = false;
    },
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
</style>
