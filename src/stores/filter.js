import { defineStore } from "pinia";

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
        }
    }
})