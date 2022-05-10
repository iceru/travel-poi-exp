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
        @mouseover="showByIndex = index"
        @mouseout="showByIndex = null"
      >
        <GMapInfoWindow :opened="showByIndex === index">
          <div class="popupImage" v-if="m.data.Type === 6">
            <img
              :src="
                m.data.Images && m.data.Images.length > 0
                  ? m.data.Images[0].Url
                  : ''
              "
              :alt="m.data.Name"
              style="
                height: 100px;
                width: auto;
                margin-bottom: 4px;
                object-fit: cover;
              "
            />
          </div>
          <div style="text-align: center">{{ m.data.Name }}</div>
        </GMapInfoWindow>
      </GMapMarker>
    </GMapCluster>
  </GMapMap>
  <div class="detail" :class="{ active: showDetail }">
    <div class="icon-close" @click="detailClose()">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-x-lg"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
        />
        <path
          fill-rule="evenodd"
          d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
        />
      </svg>
    </div>
    <div class="image" v-if="selectedMarker.Type === 6">
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
      <GMapMap
        :center="center"
        :zoom="8"
        :options="{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          scaleControl: false,
          fullscreenControl: false,
        }"
        map-type-id="terrain"
        style="width: 100%; height: 200px"
      >
        <GMapMarker
          :key="index"
          v-for="(m, index) in path"
          :position="m"
          :clickable="true"
          :draggable="false"
        />
        <GMapPolyline
          :path="path"
          :options="{
            strokeColor: '#B311CF',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
          }"
          :icons="icons"
          :editable="false"
          ref="polyline"
        />
      </GMapMap>
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
      showByIndex: null,
      more: false,
      iconPoi: "/images/poi.png",
      iconExp: "/images/experience.png",
      path: [],
      icons: [
        {
          icon: {
            path: "M -2,0 0,-2 2,0 0,2 z",
            strokeColor: "#F00",
            fillColor: "#F00",
            fillOpacity: 1,
          },
          offset: "0%",
        },
      ],
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

      // if (this.markers.length > 0) {
      //   this.center.lat = this.markers[0].position.lat;
      //   this.center.lng = this.markers[0].position.lng;
      // }
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
      this.center = item.position;
      this.path = [];

      item.data.Geocodes.map((geo) => {
        this.path.push({
          lat: geo.Geocode.Latitude,
          lng: geo.Geocode.Longitude,
        });
      });

      console.log(this.path);
    },
    detailClose() {
      this.showDetail = false;
      this.readMore = false;
      this.path = [];
    },
  },
  mounted() {
    console.log(this.exp);
  },
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
  padding: 2rem;
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

  .title {
    font-weight: bold;
    font-size: 22px;
    margin-bottom: 0.5rem;
  }

  .more {
    margin-bottom: 1rem;
    cursor: pointer;
    color: lightseagreen;
  }

  .desc {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    margin-bottom: 0.5rem;

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
</style>
