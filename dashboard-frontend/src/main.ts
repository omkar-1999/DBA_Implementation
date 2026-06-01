import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style.css'
import './style.css'
import { createPinia } from 'pinia'

import axios from 'axios'

axios.defaults.withCredentials = true

const app = createApp(App)

const pinia = createPinia()

app.use(pinia) // ✅ VERY IMPORTANT
app.use(router)

app.mount('#app')
