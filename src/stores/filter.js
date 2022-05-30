import { defineStore } from "pinia";
import url from "@/helpers/endpoints.js";
import { useServicesStore } from "./services";
import { useAppStore } from "./app";
import { usePoiStore } from "./poi";
import { useExperiencesStore } from "./experiences";
import axios from "axios";

export const useFilterStore = defineStore('filter', {
    state: () => ({
        isOpen: false,
    }),
    getters: {
        getIsOpen(state) {
            return state.isOpen
        }
    },
    actions: {
        openFilter() {
            this.isOpen = true
        },
        closeFilter() {
            this.isOpen = false
        },
        async getLocations() {
            try {
                await axios.post(url.endpoints.getLocations, url.bodyLocations).then((response) => {
                    console.log(response);
                })
            } catch(error) {
                console.log(error);
            }
        },
        setFilter(values) {
            const storeServices = useServicesStore();
            const storePoi = usePoiStore();
            const storeExp = useExperiencesStore();
            const app = useAppStore();

            if (values.minRange !== 0) {
                if (values.minRange === 0) {
                    url.bodyServices.Filter.Bookability.RateRange = {};
                } else {
                    url.bodyServices.Filter.Bookability.RateRange = {
                        Min: values.minRange,
                        Max: values.maxRange,
                    };
                }
            }

            if (values.date) {
                url.bodyServices.Availability.Window.StartDate = values.date;
            }

            if (values.pax) {
                url.bodyServices.Filter.Bookability.GuestsCapability = values.pax;
            }

            if (values.duration) {
                url.bodyServices.Filter.Bookability.NightsCapability = values.duration;
            }
            if (!values.categories.includes('poi') ) {
                app.items = app.items.filter(el => el.data.Type !== 6);
                values.categories.filter(el => el !== 'poi');
            } else if(app.items.filter(el => el.data.Type === 6).length === 0) {
                app.mergeItems(storePoi.poi)
            }

            if (!values.categories.includes('exp')) {
                app.items = app.items.filter(el => el.data.Type !== 5);
                values.categories.filter(el => el !== 'exp');
            } else if (app.items.filter(el => el.data.Type === 5).length === 0) {
                app.mergeItems(storeExp.experiences);
            }
            const datas = ['poi', 'exp']
            const requestCategories = values.categories.filter(el => !datas.includes(el));

            url.bodyServices.Filter.TagCriteria = {
                IndustryCategoryGroups: requestCategories,
            };

            if (app.sort) {
                url.bodyServices.Sorting = [
                    {
                        By: `${app.sort.split("-")[0]}`,
                        Direction: `${app.sort.split("-")[1]}`,
                    },
                ];
            }
            if (values.keywords) {
                url.bodyServices.Filter.Names = [values.keywords];
            } else {
                delete url.bodyServices.Filter.Names;
            }

            storeServices.fetchServices(url.bodyServices);
            app.itemsLoading = true;
            this.closeFilter();
        }
    }
})