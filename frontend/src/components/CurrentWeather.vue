<template>
    <div id="current-weather">
        <div class="icon">
            <img :src="weatherIconUrl" v-if="weatherIconUrl" style="width: 100px; height: 100px;">
        </div>
        <div class="location">{{ location }}</div>
        <div class="weather">{{ weather }}</div>
        <div class="temperature">현재 온도: {{ temperature }}℃</div>
        <forecast></forecast>
    </div>
</template>
  
<script>
import Forecast from '../components/Forecast';
export default {
    name: 'current-weather',
    components: {
        Forecast,
    },
    data() {
        return {
            location: '',
            weather: '',
            temperature: 0,
            weatherIconCode: '',
            lat: 37.566535,
            lng: 126.977969,
            apiKey: 'YOUR_OPENWEATHERMAP_API_KEY'
        };
    },
    computed: {
        weatherIconUrl() {
            return this.weatherIconCode ? `http://openweathermap.org/img/w/${this.weatherIconCode}.png` : '';
        }
    },
    created() {
        this.$bus.$on('sendCordinate', this.setCordinate);
    },
    methods: {
        setCordinate(cordinate) {
            this.lat = cordinate.getLat();
            this.lng = cordinate.getLng();

            this.axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lng}&appid=67c78818c6afe50f6425fa397c98a955&lang=kr`)
                .then((response) => {
                    let data = response.data;
                    this.location = data.name;
                    this.weather = data.weather[0].description;
                    this.temperature = (data.main.temp - 273.15).toFixed(1);
                    this.weatherIconCode = data.weather[0].icon;
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }
};
</script>

<style scoped>
#current-weather {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #1976d2;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin: 5px;
    height: 590px; 
}

/* 각각의 텍스트 스타일 수정 */
.location {
    font-size: 36px;
    color: #fdfdfd;
    margin-bottom: 10px;
}

.weather {
    font-size: 28px;
    font-weight: 400;
    color: #fdfdfd;
    margin-bottom: 10px;
}

.temperature {
    font-size: 48px;
    font-weight: 400;
    color: #fdfdfd;
    margin-bottom: 20px;
}

div {
    margin: 10px 5px 0 5px;
}
</style>
