import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import { useAppStore } from "./app";

const toast = useToast();

export const useWishlistsStore = defineStore('wishlists', {
    state: () => ({
        wishlists: [],
        wishlistsModal: false,
    }),
    getters: {
        getWishlists(state) {
            return state.wishlists
        },
    },
    actions: {
        addToWishlists(item) {
            const app = useAppStore();
            if (this.wishlists.length > 0) {
                if (this.wishlists.filter(e => e.Id === item.Id).length == 0) this.wishlists.push(item)
            } else {
                this.wishlists.push(item);
            }
            const selectedItem = app.items.find((el) => el.data.Id === item.Id);
            if (selectedItem) {
                selectedItem.data.Wishlist = true;
            }
            toast.success('Added to Whishlist!');
        },
        removeWishlist(item) {
            const app = useAppStore();
            this.wishlists = this.wishlists.filter(e => e.Id !== item.Id);
            const selectedItem = app.items.find((el) => el.data.Id === item.Id);
            if (selectedItem) {
                selectedItem.data.Wishlist = false;
            }
            toast.info('Removed from Whislist');
        },
        toggleWishlists() {
            this.wishlistsModal = !this.wishlistsModal;
        },
        closeWishlists() {
            this.wishlistsModal = false
        },
    }
})