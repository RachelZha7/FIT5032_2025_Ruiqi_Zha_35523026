<template>
  <div class="container mt-4">
    <h1 class="mb-4">📚 Get All Books API</h1>
    
    <!-- Loading State -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Fetching books from database...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      <h4 class="alert-heading">Error!</h4>
      <p>{{ error }}</p>
    </div>

    <!-- Success State -->
    <div v-else class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">📊 API Response - All Books</h5>
          </div>
          <div class="card-body">
            <h6 class="card-subtitle mb-3 text-muted">
              Total Books Found: {{ apiResponse.totalBooks }}
            </h6>
            
            <!-- JSON Display -->
            <div class="bg-light p-3 rounded">
              <h6>JSON Response:</h6>
              <pre class="json-display">{{ JSON.stringify(apiResponse, null, 2) }}</pre>
            </div>

            <!-- Formatted Table View -->
            <div class="mt-4">
              <h6>📋 Formatted View:</h6>
              <div v-if="apiResponse.books && apiResponse.books.length > 0" class="table-responsive">
                <table class="table table-striped table-hover">
                  <thead class="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Book Name</th>
                      <th>ISBN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="book in apiResponse.books" :key="book.id">
                      <td>{{ book.id }}</td>
                      <td>{{ book.name }}</td>
                      <td>{{ book.isbn }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="alert alert-info">
                <i class="bi bi-info-circle"></i> No books found in the database.
              </div>
            </div>

            <!-- Refresh Button -->
            <div class="mt-3">
              <button @click="fetchAllBooks" class="btn btn-outline-primary" :disabled="loading">
                <i class="bi bi-arrow-clockwise"></i> Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Debug Information -->
    <div class="mt-4">
      <div class="card border-secondary">
        <div class="card-header bg-secondary text-white">
          <h6 class="mb-0">🔧 Debug Information</h6>
        </div>
        <div class="card-body">
          <small class="text-muted">
            <strong>Timestamp:</strong> {{ apiResponse.timestamp }}<br>
            <strong>Status:</strong> {{ apiResponse.success ? 'Success' : 'Failed' }}<br>
            <strong>Database:</strong> Firestore<br>
            <strong>Collection:</strong> books
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase/init.js'
import { collection, getDocs } from 'firebase/firestore'

// Reactive data
const loading = ref(true)
const error = ref(null)
const apiResponse = ref({
  success: false,
  totalBooks: 0,
  books: [],
  timestamp: null
})

// Fetch all books from Firestore
const fetchAllBooks = async () => {
  loading.value = true
  error.value = null
  
  try {
    console.log('Fetching all books from Firestore...')
    
    // Get all documents from the 'books' collection
    const querySnapshot = await getDocs(collection(db, 'books'))
    const booksArray = []
    
    querySnapshot.forEach((doc) => {
      booksArray.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    // Create API response format
    apiResponse.value = {
      success: true,
      totalBooks: booksArray.length,
      books: booksArray,
      timestamp: new Date().toISOString(),
      message: `Successfully retrieved ${booksArray.length} books from database`
    }
    
    console.log('Books fetched successfully:', apiResponse.value)
    
  } catch (err) {
    console.error('Error fetching books:', err)
    error.value = `Failed to fetch books: ${err.message}`
    apiResponse.value = {
      success: false,
      totalBooks: 0,
      books: [],
      timestamp: new Date().toISOString(),
      error: err.message
    }
  } finally {
    loading.value = false
  }
}

// Fetch data when component mounts
onMounted(() => {
  fetchAllBooks()
})
</script>

<style scoped>
.json-display {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  max-height: 400px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.table th {
  font-weight: 600;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

@media (max-width: 768px) {
  .json-display {
    font-size: 0.75rem;
  }
}
</style>