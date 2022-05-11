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
    <GMapCluster :zoomOnClick="true" :minimumClusterSize="2">
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
        @mouseover="showByIndex = index"
        @mouseout="showByIndex = null"
      >
        <GMapInfoWindow :opened="showByIndex === index">
          <div class="popupImage" v-if="m.data.Type === 6">
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
  <div class="detail" :class="{ active: showDetail }">
    <div class="icon-close" @click="detailClose()">
      <BIconXLg />
    </div>
    <div class="image" v-if="selectedMarker.Type === 6">
      <img
        :src="
          selectedMarker.Images && selectedMarker.Images.length > 0
            ? selectedMarker.Images[0].Url
            : '/images/no_image.png'
        "
        alt=""
      />
    </div>
    <div class="title">
      {{ selectedMarker.Name }}
    </div>
    <div class="address" v-if="selectedMarker.PhysicalAddress">
      {{
        `${selectedMarker?.PhysicalAddress?.Line1}, ${selectedMarker?.PhysicalAddress?.City}, ${selectedMarker?.PhysicalAddress?.State}, ${selectedMarker?.PhysicalAddress?.CountryName}`
      }}
    </div>
    <div
      v-if="selectedMarker.LongDescription"
      class="desc"
      :class="setReadMore"
    >
      {{ selectedMarker.LongDescription }}
    </div>
    <span
      v-if="selectedMarker.LongDescription"
      class="more"
      @click="more = !more"
      >{{ textMore }}</span
    >
    <div class="path" v-if="selectedMarker.Type === 5">
      <MapDetail :path="path" :pathData="pathData" />
    </div>
  </div>
</template>

<script>
import MapDetail from "./MapDetail.vue";
export default {
  name: "GoogleMaps",
  props: ["poi", "exp", "dataReady"],
  data() {
    return {
      center: { lat: 51.5072, lng: 0.1276 },
      markers: [],
      selectedMarker: {},
      showDetail: false,
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
    selectMarker(item) {
      this.selectedMarker = item.data;
      this.showDetail = true;
      this.more = false;
      this.center = item.position;
      this.path = [];
      item.data.Geocodes.map((geo, index) => {
        this.path.push({
          lat: geo.Geocode.Latitude,
          lng: geo.Geocode.Longitude,
        });
        this.pathData.push({
          id: index,
          data: geo,
          position: {
            lat: geo.Geocode.Latitude,
            lng: geo.Geocode.Longitude,
          },
        });
      });
      console.log(this.pathData);
    },
    detailClose() {
      this.showDetail = false;
      this.readMore = false;
      this.path = [];
    },
  },
  mounted() {},
  components: { MapDetail },
};
</script>

<style lang="scss">
.detail {
  position: absolute;
  height: 100%;
  width: 30%;
  background-color: white;
  top: 0;
  left: 0;
  transform: translateX(-100%);
  padding: 2rem 1rem;
  padding-top: 1rem;
  overflow: auto;
  transition: transform 0.5s ease;

  @media screen and (max-width: 576px) {
    width: calc(100vw - 2rem);
    padding: 1rem;
  }

  &.active {
    transition: transform 0.5s ease;
    transform: translateX(0);
  }

  .icon-close {
    text-align: right;
    cursor: pointer;
    margin-bottom: 1rem;
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
    color: lightseagreen;
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
      height: 200px;
      object-fit: cover;
    }
  }
}

.popupImage {
  text-align: center;
  img {
    height: 60px;
    width: auto;
    margin-bottom: 4px;
    object-fit: cover;
  }
}
</style>
