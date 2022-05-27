import axios from "axios";
import { defineStore } from "pinia";
import url from "@/helpers/endpoints.js";
import { useAppStore } from "./app";
import { useExperiencesStore } from "./experiences";

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
            const app = useAppStore();
            app.itemsLoading = true;
            
            try {
                await axios
                .post(url.endpoints.search, url.body(6, "TestDistributor"))
                .then((response) => {
                  this.poi = response.data.Entities;
                  const exp = useExperiencesStore();

                  exp.fetchExperiences();
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