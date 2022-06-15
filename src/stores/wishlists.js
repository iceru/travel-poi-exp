import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import { useAppStore } from "./app";
import url from '@/helpers/endpoints'

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

        searchInject() {
            const app = useAppStore();
            let products = [];

            this.wishlists.map((item) => {
                products.push(item.Id)
            });

            const favourites = {
                Favourites: products,
            };

            const formData = [
                { name: "type", value: "SearchInjection" },
                { name: "data", value: JSON.stringify(favourites) },
                { name: "exl_dn", value: 'TestDistributor' },
                { name: "exl_bs", value: 'TestDistributor' },
                { name: "exl_lng", value: 'en-US' },
                { name: "exl_cur", value: app.currency },
                {
                    name: "options",
                    value: JSON.stringify({ OpenInNewWindow: true }),
                },
            ];

            const form = document.createElement("form");
            form.action = url.endpoints.injection;
            form.method = "POST";

            formData.forEach(function (item) {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = item.name;
                input.value = item.value;

                form.appendChild(input);
            });

            document.body.appendChild(form);

            form.submit();

            document.body.removeChild(form);
        }
    }
})