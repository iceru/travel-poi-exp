import axios from "axios";
import { defineStore } from "pinia";
import url from "@/helpers/endpoints.js";
import requests from '@/helpers/requests.js';

export const useMapStore = defineStore('map', {
    state: () => ({
        selectedItem: {},
        selectedChildren: [],
        path: [],
        pathData: [],
        sidebarOpen: true,
        center: { lat: 53.626123185627385, lng: -3.555439438969579 },
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
            marker.data.Geocodes && marker.data.Geocodes.length > 1 && marker.data.Geocodes.map((geo, index) => {
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
        getQuote(lists, formValues) {
            requests.quoteRequest.request.Configurations[0].Pax.Adults = parseInt(formValues && formValues.pax) || 2;
            requests.quoteRequest.request.CommencementDate = (formValues && formValues.date) || new Date();
            requests.quoteRequest.request.Duration = parseInt(formValues && formValues.duration) || 1;
            this.selectedChildren = [];
            lists.map((item) => {
                requests.quoteRequest.request.IndustryCategoryGroup = item.IndustryCategoryGroups[0];
                requests.quoteRequest.request.IndustryCategory = item.IndustryCategory;
                requests.quoteRequest.request.Configurations[0].ProductId = item.Id;

                try {
                    axios
                        .post(url.endpoints.bookingQuote, requests.quoteRequest)
                        .then((response) => {
                            this.selectedChildren.push(response.data);
                        });
                }
                catch (error) {
                    console.log(error);
                }
            })
        },
        toggleSidebar() {
            this.sidebarOpen = !this.sidebarOpen;
        },
        openSidebar() {
            this.sidebarOpen = true;
        }
    }
})