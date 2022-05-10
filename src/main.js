import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import VueGoogleMaps from "@fawmi/vue-google-maps";

const app = createApp(App);

app.use(router);
app.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAYiScOPlZxHuI_fUGc2n5ZaUMYH9wiPnw",
  },
});
app.use(VueAxios, axios);

app.mount("#app");
