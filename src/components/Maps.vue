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
    }"
    style="width: 100vw; height: 100vh"
  >
    <GMapCluster @click="clusterClick()" :minimumClusterSize="3">
      <GMapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="false"
        :icon="{
          url: m.data.Type === 6 ? iconPoi : iconExp,
          scaledSize: { width: 45, height: 45 },
        }"
        @click="
          storeMap.selectMarker(m);
          selectMarker(m);
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
          <div style="text-align: center">{{ m.data.Name }}</div>
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
      more: false,
      iconPoi: "/images/poi.png",
      iconExp: "/images/experience.png",
      path: [],
      pathData: [],
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
    clusterClick() {},
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
</style>
