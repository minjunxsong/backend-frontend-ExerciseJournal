<template>
  <v-app>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-card class="pa-6">
            <v-form v-model="valid">
              <v-text-field v-model="id" :rules="idRules" :counter="10" label="이름" required></v-text-field>
              <v-text-field v-model="password" :rules="pwRules" :counter="10" label="비밀번호" required type="password"></v-text-field>
              <v-row justify="center">
                <v-col cols="6">
                  <v-btn color="primary" block @click="btnClick('login')">로그인하기</v-btn>
                </v-col>
                <v-col cols="6">
                  <v-btn color="secondary" block @click="btnClick('join')">회원가입</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      valid: false,
      id: '',
      password: '',
      token: '',
      urlinfo: 'http://localhost:8000',
      result: '',
      idRules: [
        v => !!v || '이름을 입력해주세요',
        v => (v && v.length <= 15) || '15자 이하로 입력해주세요',
      ],
      pwRules: [
        v => !!v || '비밀번호를 입력해주세요',
        v => (v && v.length >= 8) || '8자 이상 입력해주세요',
      ],
    };
  },
  methods: {
    btnClick(action) {
      if (action === 'join') {
        // 회원가입 버튼을 클릭한 경우
        this.$router.push('/join'); // 회원가입 페이지로 이동
      }
      if (this.id.length > 0 && this.password.length > 0) {
        if (action === 'login') {
          // 로그인 버튼을 클릭한 경우
          axios
        .post(this.urlinfo + '/login', {
          userName: this.id,
          password: this.password,
        })
        .then(res => {
          localStorage.setItem('userName', res.data.userName); // 로그인 성공 시 사용자 이름을 로컬 스토리지에 저장
          this.userName = res.data.userName; // 로그인 성공 시 사용자 이름 업데이트
          alert(res.data.userName + '님 환영합니다.');
          this.$router.push('/'); // 홈으로 이동
        })
        .catch(err => {
          alert('에러 발생: ' + err);
        });
        }
        this.id = '';
        this.password = '';
        this.result = '';
      }
      
    },
    logout() {
      localStorage.removeItem('userName'); // 로그아웃 시 로컬 스토리지에서 사용자 정보 제거
      this.userName = ''; // userName 초기화
      this.$router.push('/login'); // 로그인 페이지로 이동
      },
  },
};
</script>

<style>
/* 추가적인 스타일링을 여기에 작성할 수 있습니다. */
</style>