import { createApp, watch } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import VueGoogleMaps from "@fawmi/vue-google-maps";
import { BootstrapIconsPlugin } from "bootstrap-icons-vue";
import { createPinia } from "pinia";
import VueLazyLoad from 'vue3-lazyload';
import { createI18n } from 'vue-i18n'
import { useAppStore } from "./stores/app";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const messages = {
  enUS: {
    t: {
      wishlists: 'Wishlists',
      filter: "Filter"
    }
  },
  zhCN: {
    t: {
      wishlists: '名单',
      filter: '筛选'
    }
  }
}

const i18n = createI18n({
  locale: 'enUS',
  fallbackLocale: 'zhCN',
  messages,
})

const toastOptions = {
  pauseOnHover: false
}

const pinia = createPinia();

if (localStorage.getItem('state')) {
  pinia.state.value = JSON.parse(localStorage.getItem('state'))
}

watch(
  pinia.state, (state) => {
    localStorage.setItem('state', JSON.stringify(state))
  },
  { deep: true }
);

const app = createApp(App);

app.use(router);
app.use(i18n);
app.use(Toast, toastOptions);
app.use(BootstrapIconsPlugin);
app.use(createPinia());
app.use(VueLazyLoad);
app.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAYiScOPlZxHuI_fUGc2n5ZaUMYH9wiPnw",
  },
});
app.use(VueAxios, axios);

app.mount("#app");


const storeApp = useAppStore();

storeApp.$subscribe((_, state) => {
  i18n.global.locale = state.lang;
});