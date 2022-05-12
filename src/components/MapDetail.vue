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
        @mouseover="showByIndex = index"
        @mouseout="showByIndex = null"
      >
        <GMapInfoWindow :opened="showByIndex === index">
          <div class="popupTitle">{{ m.data.Title }}</div>
          <div class="popupDesc">{{ m.data.Description }}</div>
        </GMapInfoWindow>
      </GMapMarker>
      <GMapPolyline
        :path="path"
        :options="{
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
        }"
        :editable="false"
        ref="polyline"
      />
    </GMapMap>
    <div class="popupInfo">Click on a pin to see more details</div>
    <div class="navDetail" v-if="selected">
      <div class="btnWrapper">
        <a href="#" @click="goToStart" class="left">Start</a>
        <a href="#" @click="prevMarker" v-show="itenary > 0"
          ><BIconChevronLeft />&nbsp; Prev</a
        >
      </div>

      <div class="btnWrapper">
        <a
          href="#"
          class="left"
          v-show="itenary < pathData.length - 1"
          @click="nextMarker"
          >Next &nbsp;<BIconChevronRight
        /></a>
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
      showByIndex: null,
      centerDetail: { lat: 51.5072, lng: 0.1276 },
      lineSymbol: {
        path: "M -4,0 0,0 4,0 0,-4 z",
        strokeColor: "#F00",
        fillColor: "#F00",
        fillOpacity: 1,
      },
    };
  },
  methods: {
    selectMarker(geo) {
      this.selected = geo;
      this.itenary = geo.id;
      this.zoom = 15;
    },

    positioning(itenary) {
      this.selected = this.pathData[itenary];
      this.centerDetail.lat = this.selected.position.lat;
      this.centerDetail.lng = this.selected.position.lng;
    },

    nextMarker() {
      if (this.itenary < this.pathData.length - 1) {
        this.itenary++;
        this.zoom = 15;
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
  },
  mounted() {
    this.selectMarker(this.pathData[0]);
    this.zoom = 15;
    this.centerDetail.lat = this.selected.position.lat;
    this.centerDetail.lng = this.selected.position.lng;
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
  display: block !important;
}

.detailPin {
  margin-top: 0.5rem;
}
</style>
