<template>
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
    <GMapCluster>
      <GMapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="false"
        @click="selectMarker(m)"
      />
    </GMapCluster>
  </GMapMap>
  <div class="detail" :class="{ active: showDetail }">
    <div class="title">
      {{ selectedMarker.Name }}
    </div>
  </div>
</template>

<script>
export default {
  name: "GoogleMaps",
  props: ["poi", "exp", "dataReady"],
  data() {
    return {
      center: { lat: 51.5072, lng: 0.1276 },
      markers: [],
      selectedMarker: {},
      showDetail: false,
    };
  },
  watch: {
    poi(newPoi) {
      if (newPoi.length > 0) {
        this.getMarkers();
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

      console.log(this.markers);

      // if (this.markers.length > 0) {
      //   this.center.lat = this.markers[0].position.lat;
      //   this.center.lng = this.markers[0].position.lng;
      // }
    },
    selectMarker(item) {
      this.selectedMarker = item.data;
      this.showDetail = true;
      this.center = item.position;
    },
  },
  mounted() {
    console.log(this.markers);
  },
};
</script>

<style lang="scss">
.detail {
  position: absolute;
  height: 100vh;
  width: 30%;
  background-color: white;
  top: 0;
  left: 0;
  transform: translateY(-100%);

  &.active {
    transform: translateY(0);
  }
}
</style>
