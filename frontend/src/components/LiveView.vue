<template>
    <div class="container">
        <div class="weather-content">
            <div :class="['weather-box', { 'clear-sky': isClearSky, 'cloudy': isCloudy, 'mist': isMist, 'rain': isRain,'manycloudy':isManyCloudy }]">

                <!-- 날씨 정보 -->
                <div class="location">
                    <h3>{{ weather && weather.name }}의 현재 날씨</h3>
                </div>
                <div class="temperature">
                    <h3>온도: {{ weather?.main.temp }}°C</h3>
                </div>
                <div class="description">
                    <h2>날씨: {{ weather?.weather[0].description }}</h2>
                </div>
            </div>
            <!-- 날씨 아이콘 -->
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            weather: null,
        };
    },
    computed: {
        isClearSky() {
            return this.weather && this.weather.weather[0].description === '맑음';
        },
        isCloudy() {
            return this.weather && this.weather.weather[0].description === '튼구름';
        },
        isMist() {
            return this.weather && this.weather.weather[0].description === '온흐림';
        },
        isRain() {
            return this.weather && this.weather.weather[0].description === '비';
        },
        isManyCloudy() {
            return this.weather && this.weather.weather[0].description === '구름조금';
        },
    },
    methods: {
        getCurrentLocation() {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log("현재 위치", lat, lon);
                this.getWeatherByCurrentLocation(lat, lon);
            });
        },
        async getWeatherByCurrentLocation(lat, lon) {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=658d847ef1d28e72e047ab0c5a476d54&units=metric&lang=kr`;
            const response = await fetch(url);
            const data = await response.json();
            this.weather = data;
        },
    },
    mounted() {
        this.getCurrentLocation();
    },
};
</script>
  
<style scoped>
.weather-box {
    border-radius: 10px;
    padding: 225px;
    /* 예시로 20px로 변경 */
    text-align: center;
    background-size: cover;
}

.location h2 {
    font-size: 24px;
    margin-bottom: 10px;
}

.temperature h3 {
    font-size: 20px;
    margin-bottom: 10px;
}

.description p {
    font-size: 16px;
}

.clear-sky {
    background-image: url('https://source.unsplash.com/v9bnfMCyKbg/1600x900');
    /* 맑음일 때 배경 이미지 스타일 */
}

.cloudy {
    background-image: url('http://source.unsplash.com/78wDBw9ajUk/1600x900');
    /* 흐림일 때 배경 이미지 스타일 */
}
.manycloudy {
    background-image: url('http://source.unsplash.com/78wDBw9ajUk/1600x900');
    /* 흐림일 때 배경 이미지 스타일 */
}


.mist {
    background-image: url('https://source.unsplash.com/v9bnfMCyKbg/1600x900');
    /* 안개일 때 배경 이미지 스타일 */
}

.rain {
    background-image: url('https://source.unsplash.com/v9bnfMCyKbg/1600x900');
    /* 비일 때 배경 이미지 스타일 */
}
.weather-content {
    margin-top: 10px; /* 적절한 간격 설정 */
    text-align: center;
}
</style>