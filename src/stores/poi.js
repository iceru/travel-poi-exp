import axios from "axios";
import { defineStore } from "pinia";
import url from "@/helpers/endpoints.js";
import { useAppStore } from "./app";

export const usePoiStore = defineStore('poi', {
    state: () => ({
        poi: [],
        selectedItem: {}
    }),
    getters: {
        getPoi(state) {
            return state.poi
        },
        getSelected(state) {
            return state.selectedItem
        }
    },
    actions: {
        async fetchPoi() {
            try {
                await axios
                .post(url.endpoints.search, url.body(6, "TestDistributor"))
                .then((response) => {
                  this.poi = response.data.Entities;
                  const app = useAppStore();
                  app.mergeItems(response.data.Entities);
                });
            }
            catch(error) {
                console.log(error);
            }
        },
        selectMarker(data) {
            this.selectedItem = data;
        },
        resetSelected() {
            this.selectedItem = {};
        }
    }
})