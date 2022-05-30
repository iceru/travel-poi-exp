import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import VueGoogleMaps from "@fawmi/vue-google-maps";
import { BootstrapIconsPlugin } from "bootstrap-icons-vue";
import { createPinia } from "pinia";
import VueLazyLoad from 'vue3-lazyload';
import { createI18n } from 'vue-i18n'
const messages = {
  en: {
    message: {
      hello: 'hello world'
    }
  },
  ja: {
    message: {
      hello: 'こんにちは、世界'
    }
  }
}

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'id', 
  messages, 
})

const app = createApp(App);

app.use(router);
app.use(i18n);
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
