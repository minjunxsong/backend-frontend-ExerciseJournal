<template>
  <div id="app">
    <v-layout row justify-center>

      <div class="image-container">
        <div class="exercise-image" @click="insertWordIntoLatitude('벤치프레스')">
          <img :src="bench_image" class="clickable-image">
          <span class="exercise-name">벤치프레스</span>
        </div>
        <div class="exercise-image" @click="insertWordIntoLatitude('스쿼트')">
          <img :src="squat_image" class="clickable-image">
          <span class="exercise-name">스쿼트</span>
        </div>
        <div class="exercise-image" @click="insertWordIntoLatitude('데드리프트')">
          <img :src="dead_image" class="clickable-image">
          <span class="exercise-name">데드리프트</span>
        </div>
      </div>

      <v-dialog v-model="dialog" persistent max-width="500px" content-class="custom-dialog">
        <v-card class="dialog-card">
          <v-card-title>
            <span class="headline">{{ dialogTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field label="ID" v-model="deviceInfo.deviceId" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="사용자" v-model="deviceInfo.name" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="운동 이름" v-model="deviceInfo.latitude" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="운동 무게" v-model="deviceInfo.longitude" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="총 횟수" v-model="deviceInfo.description" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="날짜" v-model="deviceInfo.register_date" required></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="btnClick($event)">취소</v-btn>
            <v-btn color="blue darken-1" text @click="btnClick($event)">확인</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-data-table :headers="headers" :items="items" class="elevation-1">
      <template v-slot:item="row">
        <tr>
          <td>{{ row.item.deviceId }}</td>
          <td>{{ row.item.name }}</td>
          <td>{{ row.item.latitude }}</td>
          <td>{{ row.item.longitude }}</td>
          <td>{{ row.item.description }}</td>
          <td>{{ row.item.register_date }}</td>
          <td class="text-xs-right">
            <v-btn color="primary" @click.native="updateContact(row.item)">수정</v-btn>
            <v-btn color="error" @click.native="deleteContact(row.item)">삭제</v-btn>
          </td>
        </tr>
      </template>


    </v-data-table>
  </div>
</template>

<script>
import axios from 'axios'


export default {
  data() {
    return {
      loggedInUser: '', // 로그인한 사용자 이름 저장
      squat_image: require('@/assets/스쿼트.jpeg'),
      bench_image: require('@/assets/벤치프레스.jpeg'),
      dead_image: require('@/assets/데드리프트.jpeg'),
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
      dialog: false,
      dialogTitle: null,

      headers: [
        { text: 'ID', align: 'left', value: 'deviceId' },
        { text: '이름', align: 'left', value: 'name' },
        { text: '운동 이름', align: 'left', value: 'latitude' },
        { text: '무게', align: 'left', value: 'longitude' },
        { text: '횟수', align: 'left', value: 'description' },
        { text: '날짜', align: 'left', value: 'register_date' },
        { text: '관리', align: 'left', value: '' },
      ],
      items: []
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

  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    },

 
    openDialog() {
      this.dialog = true;
      this.dialogTitle = `${this.deviceInfo.latitude} 선택`;
      // 여기서 추가적인 로직을 수행하거나, 선택한 이미지 정보를 설정할 수 있어
    },

    addContact() {
      this.dialog = true;
      this.dialogTitle = "추가";
      this.deviceInfo.register_date = Date.now();

    },
    updateContact(data) {
      this.dialog = true;
      this.dialogTitle = "수정";
      this.deviceInfo.deviceId = data.deviceId;
      this.deviceInfo.name = data.name;
      this.deviceInfo.latitude = data.latitude;
      this.deviceInfo.longitude = data.longitude;
      this.deviceInfo.description = data.description;
      this.deviceInfo.register_date = data.register_date;
    },
    deleteContact(data) {
      this.dialog = true;
      this.dialogTitle = "삭제";
      this.deviceInfo.deviceId = data.deviceId;
      this.deviceInfo.name = data.name;
      this.deviceInfo.latitude = data.latitude;
      this.deviceInfo.longitude = data.longitude;
      this.deviceInfo.description = data.description;
      this.deviceInfo.register_date = data.register_date;

      this.deviceInfo._id = data._id;
      // 이제 _id를 사용하여 삭제하도록 설정합니다.

      console.log('deleteContact : ' + data._id);
    },

    sendEvent(data) {
      this.$bus.$emit('deviceSelected', data);
      //  console.log('deleteContact : ' + data);
    },
    insertWordIntoLatitude(word) {
      this.deviceInfo.latitude = word;

      // 로그인한 사용자 정보를 가져와서 deviceId나 다른 필드에 채워넣기
      const storedUserName = localStorage.getItem('userName');
      if (storedUserName) {
        this.deviceInfo.deviceId = storedUserName;
        // 다른 사용자 정보도 필요한 경우 여기서 설정하세요.
      }

      // 다이얼로그 열기
      this.openDialog();
    },


    btnClick($event) {
      this.dialog = false;
      if ($event.target.innerHTML == '확인') {
        // 다이얼로그 제목이 선택된 운동 이름인 경우에만 로컬 스토리지의 userName 값을 deviceId에 설정
        if (this.dialogTitle === `${this.deviceInfo.latitude} 선택`) {
          if (this.loggedInUser) {
            this.deviceInfo.deviceId = this.loggedInUser;
          }
          axios.post(this.urlinfo, {
            deviceId: this.deviceInfo.deviceId,
            name: this.deviceInfo.name,
            latitude: this.deviceInfo.latitude,
            longitude: this.deviceInfo.longitude,
            description: this.deviceInfo.description,
            register_date: this.deviceInfo.register_date
          })
            .then(() => {
              axios.get(this.urlinfo)
                .then((res) => {
                  this.items = res.data.filter(item => item.deviceId === this.loggedInUser);
                  alert("추가 성공");
                })
                .catch((err) => {
                  alert('에러 발생: ' + err);
                });
            })
            .catch((err) => {
              alert('에러 발생: ' + err);
            });

        }
        else if (this.dialogTitle == "수정") {
          //alert("입력된 정보 : " + "이메일 : " + this.contactInfo.email + " 패스워드 : " + this.contactInfo.password);
          axios.put(this.urlinfo + '/' + this.deviceInfo.deviceId, {
            deviceId: this.deviceInfo.deviceId,
            name: this.deviceInfo.name,
            latitude: this.deviceInfo.latitude,
            longitude: this.deviceInfo.longitude,
            description: this.deviceInfo.description,
            register_date: this.deviceInfo.register_date
          })
            .then(() => {
              axios.get(this.urlinfo)
                .then((res) => {
                  this.items = res.data.filter(item => item.deviceId === this.loggedInUser);
                  alert("업데이트 성공");
                })
                .catch((err) => {
                  alert('에러 발생: ' + err);
                });
            })
            .catch((err) => {
              alert('에러 발생: ' + err);
            });

        }
        else if (this.dialogTitle == "삭제") {
          // 백엔드에서 실제로 어떤 필드를 사용하는지에 따라 URL 구성이 달라질 수 있습니다.
          console.log(this.deviceInfo._id);
          axios.delete(this.urlinfo + '/' + this.deviceInfo._id)
            .then(() => {
              console.log(this.deviceInfo._id);
              axios.get(this.urlinfo)
                .then((res) => {
                  this.items = res.data.filter(item => item.deviceId === this.loggedInUser);
                  alert("삭제 성공");
                })
                .catch((err) => {
                  alert('삭제 후 데이터 가져오는 중 에러 발생: ' + err);
                });
            })
            .catch((err) => {
              alert('에러 발생: ' + err);
            });
        }
      }
      this.deviceInfo._id = null;
      this.deviceInfo.deviceId = null;
      this.deviceInfo.name = null;
      this.deviceInfo.latitude = null;
      this.deviceInfo.longitude = null;
      this.deviceInfo.description = null;
      this.deviceInfo.register_date = null;
    },

  }
}
</script>
<style scoped>
.custom-dialog {
  border-radius: 20px; /* 모서리를 둥글게 만듭니다. */
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.5); /* 그림자 효과 추가 */
  margin: 0 auto; /* 가운데 정렬 */
}

/* 다이얼로그 카드 커스텀 스타일 */
.dialog-card {
  background-color: #f9f9f9; /* 카드 배경색 설정 */
  border-radius: 30px; /* 카드 모서리를 둥글게 만듭니다. */
  padding: 0px; /* 카드 안쪽 여백 설정 */
  width: 500px; /* 다이얼로그 카드 너비 설정 */
  max-width: 100%; /* 최대 너비 설정 */
  margin: 0 auto; /* 가운데 정렬 */
}

.image-container {
  
  display: flex;
  justify-content: space-around;
  margin: 20px;
  /* 이미지 아래 여백 추가 */
}

.exercise-image {
  text-align: center;
  position: relative;
  border-radius: 10px; /* 모서리 둥글게 설정 */
  overflow: hidden; /* 내용이 넘치는 경우를 대비해 오버플로우 제어 */
  margin-bottom: 0px; /* 이미지 아래 여백 추가 */
}

.exercise-image img {
  width: 100%;
  height: auto;
  display: block;
  margin-bottom: 5px;
  border-radius: 10px; /* 초기 둥근 모양을 위한 border-radius 추가 */
}

.exercise-name {
  position: absolute;
  /* 텍스트를 이미지 상단에 배치하기 위해 절대 위치로 설정합니다. */
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.593);
  /* 텍스트 배경색 및 투명도 설정 */
  padding: 5px;
  border-radius: 50px;
  font-weight: bold;
}

/* 이미지 간 간격 설정 */
.image-container img {
  margin-right: 10px;
  /* 원하는 간격으로 설정하세요 */
  width: 500px;
  /* 이미지 너비 */
  height: 490px;
  /* 이미지 높이 */
}

div {
  margin: 0 5px 0 5px;
}

table {
  width: 100%;
  border: 1px solid #ddd;
  border-collapse: collapse;
  margin-top: 20px;
  font-family: Arial, sans-serif;
}

th,
td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  color: #333;
  font-weight: bold;
  border-bottom: 2px solid #ddd;
  /* 헤더 아래 테두리 추가 */
}

tr {
  background-color: #f9f9f9;
  /* 전체 행 배경색 통일 */
}

tr:hover {
  background-color: #f2f2f2;
}

.text-xs-right {
  text-align: right;
}

/* 버튼 스타일 */
.v-btn {
  margin-right: 10px; /* 버튼 간격 설정 */
  font-weight: bold; /* 버튼 글꼴 굵게 설정 */
}
.v-text-field {
  margin-bottom: 15px; /* 입력 필드 간격 설정 */
}
.image-container img {
  margin-right: 10px; /* 이미지 간 간격 설정 */
  width: 460px; /* 이미지 너비 설정 */
  height: 490px; /* 이미지 높이 설정 */
}
/* 호버 효과 및 클릭 가능한 이미지 스타일 */
.clickable-image {
  transition: transform 0.3s ease; /* 호버 시 변화를 부드럽게 만듭니다. */
}

.exercise-image:hover .clickable-image {
  transform: scale(1.1); /* 호버 시 이미지를 확대합니다. */
  cursor: pointer; /* 호버 시 마우스 커서를 포인터로 변경합니다. */
}
</style>

