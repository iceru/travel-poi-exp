import axios from "axios";
import { defineStore } from "pinia";
import url from "@/helpers/endpoints.js";

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
            try {
                await axios
                .post(url.endpoints.search, url.body(5, "TestDistributor"))
                .then((response) => {
                  this.experiences = response.data.Entities;
                });
            }
            catch(error) {
                console.log(error);
            }
        }
    }
})