import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'

// import bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { ThemeService } from '@primevue/themes'

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
})

//createApp(App).mount('#app')
app.mount('#app');