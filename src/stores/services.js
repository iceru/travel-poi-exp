import axios from "axios";
import { defineStore } from "pinia";
import url from "@/helpers/endpoints.js";
import { useAppStore } from "./app";

export const useServicesStore = defineStore('services', {
    state: () => ({
        services: [],
    }),
    getters: {
        getServices(state) {
            return state.services
        }
    },
    actions: {
        async fetchServices(request) {
            const storeApp = useAppStore();
            const lang = storeApp.lang.splice(2, 0, '-');
            try {
                await axios
                    .post(url.endpoints.search, request ? request : url.bodyServices(lang, storeApp.currency))
                    .then((response) => {
                        this.services = response.data.Entities;
                        const app = useAppStore();
                        app.items = app.items.filter(el => el.data.Type !== 3);
                        app.itemsLoading = false;
                        app.mergeItems(response.data.Entities);
                        app.sortItems();
                    });
            }
            catch (error) {
                console.log(error);
            }
        }
    }
})