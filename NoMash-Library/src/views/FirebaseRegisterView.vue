<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h1>Create an Account</h1>
          </div>
          <div class="card-body">
            <form @submit.prevent="register">
              <div class="mb-3">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Email" 
                  v-model="email"
                  required
                />
              </div>
              <div class="mb-3">
                <input 
                  type="password" 
                  class="form-control" 
                  placeholder="Password" 
                  v-model="password"
                  required
                />
              </div>
              <div class="d-grid">
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  @click="register"
                >
                  Save to Firebase
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "vue-router"

const email = ref("")
const password = ref("")
const router = useRouter()
const auth = getAuth()

const register = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      console.log("Firebase Register Successful!")
      router.push("/FireLogin")
    })
    .catch((error) => {
      console.log(error.code);
    })
};
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header h1 {
  margin: 0;
  font-size: 1.5rem;
  text-align: center;
}
</style>