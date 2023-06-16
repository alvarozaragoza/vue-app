import { createApp } from 'vue'
import { createPinia } from "pinia";
import { router } from './router'
import App from './App.vue'
import { Router } from 'express';

createApp(App)
.use(createPinia())
.use(router)
.mount('#app')
