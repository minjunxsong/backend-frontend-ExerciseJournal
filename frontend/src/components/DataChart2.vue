<template>
  <div>
    <div class="chart-container">
      <LineChartGenerator id="my-chart-id" :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId"
        :dataset-id-key="datasetIdKey" :plugins="plugins" :css-classes="cssClasses" :styles="styles" :width="width"
        :height="height"/>
    </div>

    <div class="button-container">
      <button @click="updateChartData('벤치프레스')" class="cute-button">벤치프레스</button>
      <button @click="updateChartData('데드리프트')" class="cute-button">데드리프트</button>
      <button @click="updateChartData('스쿼트')" class="cute-button">스쿼트</button>
    </div>
  </div>
</template>
<script>

import axios from 'axios'
import { Line as LineChartGenerator } from "vue-chartjs/legacy"
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, CategoryScale, PointElement } from 'chart.js'

const API_URL = 'http://localhost:8000/devices'

ChartJS.register(Title,
  Tooltip, Legend, LineElement, LinearScale, CategoryScale, PointElement)

export default {
  name: 'LineChart',
  components: { LineChartGenerator },
  props: {
    chartId: {
      type: String,
      default: 'line-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => { }
    },
    plugins: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loggedInUser: '', // 로그인한 사용자 이름 저장
      urlinfo: 'http://localhost:8000/devices',
      deviceInfo: {
        _id: null,
        deviceId: null,
        name: null,
        latitude: null,
        longitude: null,
        description: null,
        register_date: null
      },
      
      chartData: {

        datasets: [
          {
            label: '벤치프레스',
            backgroundColor: 'f87979',
            data: []
          },
          {
            label: '데드리프트',
            backgroundColor: 'f87979',
            data: []
          },
          {
            label: '스쿼트',
            backgroundColor: 'f87979',
            data: []
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,

      }
    }
  },
  created() {
    const storedUserName = localStorage.getItem('userName');

    if (storedUserName) {
      this.loggedInUser = storedUserName;

      axios.get(this.urlinfo)
        .then((res) => {
          // 저장된 사용자 이름과 일치하는 데이터만 필터링해서 표시합니다.
          this.items = res.data
            .filter(item => item.deviceId === this.loggedInUser)
            .map(item => {
              return {
                _id: item._id,
                deviceId: item.deviceId,
                name: item.name,
                latitude: item.latitude,
                longitude: item.longitude,
                description: item.description,
                register_date: this.formatDate(item.register_date)
              };
            });
        })
        .catch((err) => {
          alert('에러 발생: ' + err); // 에러 발생
        });
    }
  },
  mounted() {
    console.log(this.chartData)
  },
  // 코드 일부분
  methods: {
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  },   
  updateChartData(selectedExercise) {
  // 사용자 이름을 가져옵니다.
  const storedUserName = localStorage.getItem('userName');

  // API를 통해 데이터를 가져옵니다.
  axios.get(API_URL)
    .then((response) => {
      const data = response.data;

      // Filter data based on logged-in user's name
      const userData = data.filter(item => item.deviceId === storedUserName);

      // Filter data further based on selected exercise (latitude)
      const exerciseData = userData.filter(item => item.latitude === selectedExercise);

      // Set labels and data for the selected exercise category
      this.chartData.labels = exerciseData.map(item => {
        const date = new Date(item.register_date);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      });

      this.chartData.datasets = [
        {
          label: selectedExercise,
          backgroundColor: this.getBackgroundColor(selectedExercise),
          borderColor: this.getBorderColor(selectedExercise),
          data: exerciseData.map(item => item.longitude)
        }
      ];
    })
    .catch((err) => {
      alert('에러 발생: ' + err);
    });
},

    getBackgroundColor(selectedExercise) {
      switch (selectedExercise) {
        case '벤치프레스':
          return '#3498db'; // Blue
        case '데드리프트':
          return '#e74c3c'; // Red
        case '스쿼트':
          return '#2ecc71'; // Green
        default:
          return '#3498db'; // Default Blue
      }
    },

    getBorderColor(selectedExercise) {
      switch (selectedExercise) {
        case '벤치프레스':
          return '#2980b9'; // Darker Blue
        case '데드리프트':
          return '#c0392b'; // Darker Red
        case '스쿼트':
          return '#27ae60'; // Darker Green
        default:
          return '#2980b9'; // Default Darker Blue
      }
    }
  }
};
</script>
<style>
.chart-container {
  position: relative;
}

.button-container {
  display: flex;
  justify-content: center;
  background-color: #fff;
  /* 선택에 따라 색상 조정 */
  padding: 10px;
}

.cute-button {
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;
}

.cute-button:hover {
  background-color: #2980b9;
}
</style>