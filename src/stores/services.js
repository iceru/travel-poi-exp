import axios from "axios";
import { defineStore } from "pinia";
import url from "@/helpers/endpoints.js";
import { useAppStore } from "./app";
import requests from '@/helpers/requests.js';

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
            storeApp.itemsLoading = true;
            try {
                await axios
                    .post(url.endpoints.search, request ? request : requests.bodyServices(lang, storeApp.currency))
                    .then((response) => {
                        this.services = response.data.Entities;
                        storeApp.items = storeApp.items.filter(el => el.data.Type !== 3);
                        storeApp.itemsLoading = false;
                        storeApp.mergeItems(response.data.Entities);
                        storeApp.sortItems();
                    });
            }
            catch (error) {
                console.log(error);
                storeApp.itemsLoading = false;
            }
        }
    }
})