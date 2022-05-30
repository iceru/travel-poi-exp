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
            app.items = [];
            String.prototype.splice = function(idx, rem, str) {
                return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
            };
            const lang = app.lang.splice(2,0,'-')
            
            try {
                await axios
                .post(url.endpoints.search, url.body(6, "TestDistributor", lang))
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