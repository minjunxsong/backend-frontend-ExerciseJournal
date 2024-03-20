<template>
    <div class="launchpad">
      <div class="grid">
        <router-link to="/about" class="router-link">
          <button class="button">
            <SvgIcon type="mdi" :path="path2" class="icon" />
            <span class="label"><h2>운동일지</h2></span>
          </button>
        </router-link>
        <router-link to="/home" class="router-link">
          <button class="button">
            <SvgIcon type="mdi" :path="path" class="icon" />
            <span class="label"><h2>지도</h2></span>
          </button>
        </router-link>
        <!-- 추가적으로 필요한 버튼들을 이곳에 추가하세요 -->
      </div>
    </div>
  </template>
  
  <script>
  import SvgIcon from '@jamescoyle/vue-icon';
  import { mdiMapOutline } from '@mdi/js';
  import { mdiApplicationEditOutline } from '@mdi/js';
  
  export default {
    name: "MyComponent",
    components: {
      SvgIcon
    },
    data() {
      return {
        path: mdiMapOutline,
        path2: mdiApplicationEditOutline,
        buttons: [
          { label: 'Button 1' },
          { label: 'Button 2' },
          // 추가적으로 필요한 버튼들을 이곳에 추가하세요
        ]
      };
    },
    methods: {
      launch(label) {
        console.log(`Button '${label}' clicked!`);
        // 버튼을 클릭할 때 할 작업을 여기에 추가하세요
      }
    }
  };
  </script>
  
  <style scoped>
  .launchpad {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    margin-left:200px;

  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    justify-content: center;
    align-items: center;
  }
  
  .router-link {
    display: flex;
    justify-content: center;
  }
  
  .button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 500px;
    height: 500px;
   
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    border: none;
    padding: 0;
    position: relative;
    overflow: hidden;
  }
  
  .button:hover {
    background-color: #2980b9;
  }
  
  .icon {
    width: 5000px;
    height: 500px;
    fill: #fff;
  }
  
  .label {
    margin-top: 5px;
    font-size: 14px;
    font-weight: bold;
  }
  </style>
  