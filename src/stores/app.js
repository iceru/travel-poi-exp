import { defineStore } from "pinia";

export const useAppStore = defineStore('app', {
    state: () => ({
        items: [],
        wishlists: [],
        wishlistsModal: false,
        itemsLoading: false,
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
            if (this.wishlists.length > 0) {
                if (this.wishlists.filter(e => e.Id === item.Id).length == 0) this.wishlists.push(item)
            } else {
                this.wishlists.push(item);
            }
            const app = useAppStore();
            const selectedItem = app.items.find((el) => el.data.Id === item.Id);
            if(selectedItem) {
                selectedItem.data.Wishlist = true;
            }
        },
        removeWishlist(item) {
            this.wishlists = this.wishlists.filter(e => e.Id !== item.Id);
            const app = useAppStore();
            const selectedItem = app.items.find((el) => el.data.Id === item.Id);
            if(selectedItem) {
                selectedItem.data.Wishlist = false;
            }
        },
        toggleWishlists() {
            this.wishlistsModal = !this.wishlistsModal;
        },
        closeWishlists() {
            this.wishlistsModal = false
        }
    }
})