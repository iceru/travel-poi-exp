import axios from "axios";
import { defineStore } from "pinia";

export const useMapStore = defineStore('map', {
    state: () => ({
        selectedItem: {},
        path: [],
        pathData: [],
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
        selectMarker(data) {
            this.selectedItem = data;
            this.path = [];
            this.pathData = [];
            data.Geocodes.map((geo, index) => {
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
        },
        resetSelected() {
            this.selectedItem = {};
        },

    }
})