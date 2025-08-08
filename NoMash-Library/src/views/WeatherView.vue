<template>
  <div class="container">
    <div class="header">
      <h1>WEATHER APP</h1>
      <div class="search-bar">
        <input  
          type="text"  
          v-model="city" 
          placeholder="Enter city name" 
          class="search-input"
          @keyup.enter="searchByCity"
        /> 
        <button @click="searchByCity" class="search-button"> 
          Search 
        </button> 
        <br> 
        <br> 
        Please implement "Search Weather by City". 
      </div> 
    </div> 

    <!-- 错误信息显示 -->
    <div v-if="error" style="color: red; text-align: center; margin: 20px 0;">
      {{ error }}
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" style="text-align: center; margin: 20px 0;">
      正在获取天气数据...
    </div>

    <!--The <main> tag in HTML is used to specify the main content of a document  
    More info about main, check https://www.w3schools.com/tags/tag_main.asp-->    
    <main> 
      <!--If there are no data returned, then skip rendering the information-->   
      <div v-if="weatherData"> 
        <!--Display the weather data attribute returned from API 
        Example of API data: https://openweathermap.org/current-->    
        <h2> 
          {{ weatherData.name }}, {{ weatherData.sys.country }} 
        </h2> 
        <div> 
          <!--The image source of of the weather icon will be coming from a function called iconUrl 
              which will be shared in script later-->   
          <img :src="iconUrl" alt="Weather Icon" /> 
          <p>{{ temperature }} °C</p> 
        </div> 
        <!-- weather[0] means the current weather, the way we need to obtain data depends on how 
        the API JSON data looks--> 
        <span>{{ weatherData.weather[0].description }}</span> 
      </div> 
    </main> 
  </div>
</template>

<script> 
   // The info section in 10.1.1 provided detailed information about this package  
   import axios from "axios"; 
  
   const apikey = "bb77b707d2524bef43826ff4f456b166"; // Follow 10.1.2 to obtain your API key
    
   export default { 
     name: "App", 
     data() { 
       return { 
         city: "", 
         weatherData: null, 
         hourlyForecast: [], 
         dailyForecast: [], 
         error: "",
         loading: false,
       }; 
     }, 
     //computed is a property that is used to define a property that  
     //is dependent on other data properties.  
     //If we using a more easy to understand words to understand the concept:  
     //the derived value such as temperature automatically update when the relevant value change. 
     computed: { 
       //There are multiple way to obtain the data in Celsius format. 
       //Calculation by yourself like below after data is retireved or via API parameters 
        
       //Example of adding additional units requirement, if you choose this, remember to change section 3.1 
       // https://api.openweathermap.org/data/2.5/weather?lat=XXX&lon=-XXX.15&appid={API key}&units=metric 
       temperature() { 
         return this.weatherData 
           ? Math.floor(this.weatherData.main.temp - 273) 
           : null; 
       }, 
       //Get the current weather icon using the API link 
       iconUrl() { 
         return this.weatherData 
           ? `https://openweathermap.org/img/w/${this.weatherData.weather[0].icon}.png` 
           : null; 
       }, 
     }, 
     //There are two steps involved in this,  
     //step 1: identify current location  
     //step 2: after identify, get the weather data straight based on the current location. 
     mounted() { 
       this.fetchCurrentLocationWeather(); 
     }, 
     methods: { 
       //Async in a easy to understand way means the method will run in backend thread,  
       //And it won't occupy the main thread, so the user experience is still smooth 
       async fetchCurrentLocationWeather() { 
         //The navigator.geolocation object is part of the Web API provided by modern web browsers 
         //Please note this function is not belongs to Vue or openweather. 
         if (navigator.geolocation) { 
           this.loading = true;
           this.error = "";
           
           navigator.geolocation.getCurrentPosition(async (position) => { 
             const { latitude, longitude } = position.coords; 
             console.log("获取到位置:", latitude, longitude); // 调试信息
             //API link to obtain the current weather based on the current location browser identified  
             const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`; 
             //await means wait for the fetchWeatherData method to complete before proceeding 
             await this.fetchWeatherData(url); 
           }, (error) => {
             console.error("地理位置错误:", error);
             this.error = "无法获取您的位置信息，请允许位置访问权限";
             this.loading = false;
           }); 
         } else {
           this.error = "此浏览器不支持地理位置功能";
         }
       }, 
       
       // 添加按城市搜索天气的方法
       async searchByCity() {
         if (!this.city.trim()) {
           return;
         }
         
         this.loading = true;
         this.error = "";
         
         const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${apikey}`;
         await this.fetchWeatherData(url);
       },
       
       async fetchWeatherData(url) { 
         try { 
           console.log("调用API:", url); // 调试信息
           const response = await axios.get(url); 
           //Returned data from API is stored as JSON file in weatherData 
           this.weatherData = response.data; 
           this.error = "";
           console.log("API响应:", response.data); // 调试信息
         } catch (error) { 
           console.error("Error fetching weather data:", error); 
           if (error.response && error.response.status === 401) {
             this.error = "API密钥无效";
           } else {
             this.error = "获取天气数据失败";
           }
           this.weatherData = null;
         } finally {
           this.loading = false;
         }
       } 
     } 
   } 
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #333;
  margin-bottom: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.search-input {
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
  width: 250px;
}

.search-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #0056b3;
}

main {
  text-align: center;
}

main div {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
</style>