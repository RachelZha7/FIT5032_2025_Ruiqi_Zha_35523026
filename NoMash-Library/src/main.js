import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)

app.mount('#app')

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIji1gZwyBhNLRM9GsJC49MNf7pAdjpOQ",
  authDomain: "week7-ruiqi.firebaseapp.com",
  projectId: "week7-ruiqi",
  storageBucket: "week7-ruiqi.firebasestorage.app",
  messagingSenderId: "682307136888",
  appId: "1:682307136888:web:73005452f69f0ae2a2ec8d"
};

// Initialize Firebase
initializeApp(firebaseConfig);