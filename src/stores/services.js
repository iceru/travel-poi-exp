import axios from "axios";
import { defineStore } from "pinia";
import url from "@/helpers/endpoints.js";

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
                });
            }
            catch(error) {
                console.log(error);
            }
        }
    }
})