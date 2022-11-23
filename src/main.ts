import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus';

import App from './App.vue'
import router from './router'
import './assets/main.css'
import mitt from 'mitt';
import aegis from '@/utils/aegis';
import 'element-plus/dist/index.css';

const app = createApp(App)
const bus = mitt();

app.use(createPinia())
app.use(router)
app.use(ElementPlus);

app.provide('$bus', bus);
app.provide('$aegis', aegis);

app.mount('#app')
