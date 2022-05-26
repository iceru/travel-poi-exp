import { defineStore } from "pinia";

export const useAppStore = defineStore('app', {
    state: () => ({
        items: [],
        wishlists: [],
    }),
    getters: {
        getItems(state) {
            return state.items
        },
    },
    actions: {
        mergeItems(datas) {
            datas.map((item) => {
                this.items.push({
                    data: item,
                    position: {
                        lat: item.Geocodes && item.Geocodes[0].Geocode.Latitude,
                        lng: item.Geocodes && item.Geocodes[0].Geocode.Longitude,
                    },
                });
            });
        },
        addToWishlists(item) {
            this.wishlists.push(item);
        }
    }
})