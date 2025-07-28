<template>
  <div class="access-denied-container">
    <h2>Access Denied</h2>
    <p>You do not have permission to view this page.</p>
    <router-link to="/login">Please login to continue</router-link>
  </div>
</template>

<style scoped>
.access-denied-container {
  text-align: center;
  margin-top: 50px;
}
</style>