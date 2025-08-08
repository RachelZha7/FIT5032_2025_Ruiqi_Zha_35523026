<template>
  <div class="container">
    <h1>Count Book API</h1>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      Loading authors data...
    </div>
    
    <!-- 错误信息 -->
    <div v-if="error" class="error">
      {{ error }}
    </div>
    
    <!-- API响应数据 -->
    <div v-if="apiResponse" class="api-response">
      <h2>API Response:</h2>
      <pre>{{ JSON.stringify(apiResponse, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// 直接导入JSON文件
import authorsData from '@/assets/json/authors.json'

const authors = ref([])
const loading = ref(false)
const error = ref(null)
const apiResponse = ref(null)

const authorsCount = ref(0)
const totalBooks = ref(0)

const calculateStats = () => {
  authorsCount.value = authors.value.length
  totalBooks.value = authors.value.reduce((total, author) => {
    return total + author.famousWorks.length
  }, 0)
}

const getApiData = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 使用导入的JSON数据而不是fetch
    authors.value = authorsData
    
    calculateStats()
    
    // 模拟API响应格式
    apiResponse.value = {
      success: true,
      data: {
        authorsCount: authorsCount.value,
        totalBooks: totalBooks.value,
        authors: authors.value.map(author => ({
          name: author.name,
          bookCount: author.famousWorks.length,
        }))
      },
      timestamp: new Date().toISOString()
    }
    
  } catch (err) {
    error.value = `Error loading authors data: ${err.message}`
    console.error('Error loading authors data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getApiData()
})

defineExpose({
  getApiData
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.loading {
  text-align: center;
  color: #007bff;
  font-size: 1.2rem;
  margin: 20px 0;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 5px;
  margin: 20px 0;
}

.api-response {
  margin-top: 20px;
}

.api-response h2 {
  color: #333;
  margin-bottom: 15px;
}

pre {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 5px;
  padding: 15px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.4;
}
</style>