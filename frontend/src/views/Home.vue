<template>
  <div class="home">
    <v-container fluid>
      <v-row>
        <!-- 크기 조정 -->
        <v-col cols="12" md="8">
          <kakaoMap />
        </v-col>
        <v-col cols="12" md="4">
          <!-- CurrentWeather 컴포넌트를 좁게 조정 -->
          <v-row>
            <v-col>
              <CurrentWeather />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import kakaoMap from '../components/kakaoMap';
import CurrentWeather from '../components/CurrentWeather';

export default {
  name: 'App',
  components: {
    CurrentWeather,
    kakaoMap
  },
  data: () => ({
    //
  }),
  methods: {
    dateUpdate(date) {
      alert(date);
    }
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
}

/* 지도 컴포넌트 크기 조정 */
.v-col:nth-child(1) {
  padding-right: 10px;
}

/* CurrentWeather 컴포넌트 크기 조정 */
.v-col:nth-child(2) {
  padding-left: 10px;
}
</style>
