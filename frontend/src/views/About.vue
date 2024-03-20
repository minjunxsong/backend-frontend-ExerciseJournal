<template>
  <div class="about" style="margin-bottom: 50px;">
    <h1>일지를 기록하고 싶은 운동을 클릭 하세요.</h1>
    <DeviceTable/>
    <chartData/>
<LiveView/>
  </div>
</template>
<script>
import DeviceTable from '../components/DeviceTable';
import chartData from '../components/DataChart2';

export default {
  name: 'App',
  components: {
  
    DeviceTable,
    chartData,
 
  
  },
  data: () => ({
    //
  }),
  methods:{
    dateUpdate(date){
        alert(date);
    }
  }
 
}
</script>

