<template>
  <div class="mapDetailContainer">
    <GMapMap
      :center="centerDetail"
      :zoom="zoom"
      :options="{
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        scaleControl: false,
        fullscreenControl: false,
      }"
      map-type-id="terrain"
      style="width: 100%; height: 22vw"
    >
      <GMapMarker
        :key="index"
        v-for="(m, index) in pathData"
        :position="m.position"
        :clickable="true"
        :draggable="false"
        @click="selectMarker(m)"
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
        :editable="false"
        ref="polyline"
      />
    </GMapMap>
    <div class="popupInfo">Click on a pin to see more details</div>
    <div class="navDetail" v-if="selected">
      <div>
        <a href="#" @click="prevMarker" v-show="itenary > 0"
          ><BIconChevronLeft />&nbsp; Prev</a
        >
      </div>

      <div>
        <a href="#" v-show="itenary < pathData.length - 1" @click="nextMarker"
          >Next &nbsp;<BIconChevronRight
        /></a>
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
  </div>
</template>

<script>
export default {
  name: "MapDetail",
  props: ["path", "pathData", "center"],
  data() {
    return {
      selected: null,
      zoom: 8,
      itenary: 0,
      centerDetail: { lat: 51.5072, lng: 0.1276 },
    };
  },
  methods: {
    selectMarker(geo) {
      this.selected = geo;
      this.itenary = geo.id;
      this.zoom = 15;
    },

    nextMarker() {
      if (this.itenary < this.pathData.length - 1) {
        this.itenary++;
        this.selected = this.pathData[this.itenary];
        this.centerDetail.lat = this.selected.position.lat;
        this.centerDetail.lng = this.selected.position.lng;
      }
    },

    prevMarker() {
      if (this.itenary > 0) {
        this.itenary--;
        this.selected = this.pathData[this.itenary];
        this.pathData[this.itenary].position;
        this.centerDetail.lat = this.selected.position.lat;
        this.centerDetail.lng = this.selected.position.lng;
      }
    },
  },
  mounted() {
    this.selectMarker(this.pathData[0]);
    this.zoom = 8;
    this.centerDetail.lat = this.selected.position.lat;
    this.centerDetail.lng = this.selected.position.lng;
  },
};
</script>

<style lang="scss" scoped>
.mapDetailContainer {
  position: relative;
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

.desc {
  display: block !important;
}

.detailPin {
  margin-top: 0.5rem;
}
</style>
