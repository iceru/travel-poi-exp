import axios from "axios";
import { defineStore } from "pinia";
import url from "@/helpers/endpoints.js";
import requests from '@/helpers/requests.js';
import { useAppStore } from "./app";
import { useServicesStore } from "./services";

export const useExperiencesStore = defineStore('experiences', {
    state: () => ({
        experiences: [],
    }),
    getters: {
        getExperiences(state) {
            return state.experiences
        }
    },
    actions: {
        async fetchExperiences() {
            const storeApp = useAppStore();
            const lang = storeApp.lang.splice(2, 0, '-');

            try {
                await axios
                    .post(url.endpoints.search, requests.body(5, "TestDistributor", lang))
                    .then((response) => {
                        this.experiences = response.data.Entities;
                        const app = useAppStore();
                        const services = useServicesStore();

                        services.fetchServices();
                        app.mergeItems(response.data.Entities);
                    });
            }
            catch (error) {
                console.log(error);
            }
        }
    }
})