import { defineStore } from "pinia";
import url from "@/helpers/endpoints.js";
import { useServicesStore } from "./services";

export const useFilterStore = defineStore('filter', {
    state: () => ({
        isOpen: false
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
        setFilter(values) {
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

            // if (values.category === "all") {
            //     delete url.bodyServices.Filter.TagCriteria;
            // } else {
            //     url.bodyServices.Filter.TagCriteria = {
            //         IndustryCategoryGroups: [values.category],
            //     };
            // }

            if (values.keywords) {
                url.bodyServices.Filter.Names = [values.keywords];
            } else {
                delete url.bodyServices.Filter.Names;
            }

            const storeServices = useServicesStore();

            storeServices.fetchServices(url.bodyServices);
            this.closeFilter();
        }
    }
})