import { defineStore } from "pinia";
export const useAppStore = defineStore('app', {
    state: () => ({
        items: [],
        sortedItems: [],
        wishlists: [],
        wishlistsModal: false,
        itemsLoading: false,
        currentPage: 1,
        maxPerPage: 10,
        sort: 'Name-Ascending',
        lang: 'enUS',
        currency: 'GBP',
    }),
    getters: {
        getItems(state) {
            return state.items
        },
        totalItems(state) {
            return state.sortedItems.length;
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
            if (selectedItem) {
                selectedItem.data.Wishlist = true;
            }
        },
        removeWishlist(item) {
            this.wishlists = this.wishlists.filter(e => e.Id !== item.Id);
            const app = useAppStore();
            const selectedItem = app.items.find((el) => el.data.Id === item.Id);
            if (selectedItem) {
                selectedItem.data.Wishlist = false;
            }
        },
        toggleWishlists() {
            this.wishlistsModal = !this.wishlistsModal;
        },
        closeWishlists() {
            this.wishlistsModal = false
        },
        sortItems() {
            const listItems = this.items.filter((el) => el.data.Type !== 5);
            let sorted = listItems;
            if (this.sort == "Name-Ascending") {
                sorted = listItems.sort((a, b) =>
                    a.data?.Name?.localeCompare(b.data?.Name)
                );
            }

            if (this.sort == "Name-Descending") {
                sorted = listItems.sort((a, b) =>
                    b.data?.Name?.localeCompare(a.data?.Name)
                );
            }

            if (this.sort == "Price-Ascending") {
                sorted = listItems.sort((a, b) =>
                    a.data?.Availability?.Calendar.LowesRate?.localeCompare(
                        b.data?.Availability?.Calendar?.LowesRate
                    )
                );
            }
            if (this.sort == "Price-Descending") {
                sorted = listItems.sort((a, b) =>
                    b.data?.Availability?.Calendar.LowesRate?.localeCompare(
                        a.data?.Availability?.Calendar?.LowesRate
                    )
                );
            }
            this.sortedItems = sorted.slice(0, this.currentPage * this.maxPerPage);
        },
        
        loadMore() {
            this.currentPage += 1;
            this.sortItems();
        },
    }
})