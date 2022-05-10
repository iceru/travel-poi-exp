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
    <GMapCluster :zoomOnClick="true" :minimumClusterSize="4">
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
        @click="selectMarker(m)"
      />
    </GMapCluster>
  </GMapMap>
  <div class="detail" :class="{ active: showDetail }">
    <div class="icon-close" @click="detailClose()">X</div>
    <div class="image" v-if="selectedMarker.Type === 5">
      <img
        :src="
          selectedMarker.Images && selectedMarker.Images.length > 0
            ? selectedMarker.Images[0].Url
            : ''
        "
        alt=""
      />
    </div>
    <div class="title">
      {{ selectedMarker.Name }}
    </div>
    <div class="desc" :class="readMore ? active : ''">
      {{ selectedMarker.LongDescription }}
      <span @click="readMore = true">Read More</span>
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
      readMore: false,
      iconPoi: "/images/poi.png",
      iconExp: "/images/experience.png",
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
    detailClose() {
      this.showDetail = false;
      this.readMore = false;
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
  transform: translateX(-100%);
  padding: 2rem;
  transition: transform 0.5s ease;

  &.active {
    transition: transform 0.5s ease;
    transform: translateX(0);
  }

  .icon-close {
    text-align: right;
    cursor: pointer;
    margin-bottom: 1rem;
  }

  .title {
    font-weight: bold;
    font-size: 22px;
    margin-bottom: 0.5rem;
  }

  .description {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;

    &.active {
      overflow: auto;
    }
  }

  .image {
    margin-bottom: 1rem;
    img {
      width: 100%;
      height: 250px;
      object-fit: cover;
    }
  }
}
</style>
