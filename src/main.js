import "./assets/main.css";
import "vue-toastification/dist/index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { createApp } from "vue";
import App from "./App.vue";
import "bootstrap";
import Toast from "vue-toastification";

const app = createApp(App);

app.use(Toast);

app.mount("#app");
