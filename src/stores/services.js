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
        async fetchServices() {
            try {
                await axios
                    .post(url.endpoints.search, url.bodyServices)
                    .then((response) => {
                        this.services = response.data.Entities;
                        const app = useAppStore();
                        app.mergeItems(response.data.Entities);
                    });
            }
            catch (error) {
                console.log(error);
            }
        }
    }
})