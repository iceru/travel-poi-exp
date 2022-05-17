import axios from "axios";
import { defineStore } from "pinia";

export const useMapStore = defineStore('map', {
    state: () => ({
        selectedItem: {},
        path: [],
        pathData: [],
        center: { lat: 51.5072, lng: 0.1276 },
    }),
    getters: {
        getSelected(state) {
            return state.selectedItem
        },
        getPath(state) {
            return state.path
        },
        getPathData(state) {
            return state.pathData
        }
    },
    actions: {
        selectMarker(marker) {
            this.selectedItem = marker.data;
            this.path = [];
            this.pathData = [];
            this.center = marker.position;
            debugger;
            marker.data.Geocodes && marker.data.Geocodes.map((geo, index) => {
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
            console.log(this.path);
            console.log(this.pathData);
        },
        resetSelected() {
            this.selectedItem = {};
        },

    }
})