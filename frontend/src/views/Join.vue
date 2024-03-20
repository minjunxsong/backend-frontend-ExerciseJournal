<template>
    <v-app>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="6">
            <v-card class="pa-6">
              <v-form v-model="valid">
                <v-text-field v-model="name" :rules="nameRules" :counter="10" label="이름" required></v-text-field>
                <v-text-field v-model="id" :rules="idRules" :counter="10" label="이메일" required></v-text-field>
                <v-text-field v-model="password" :rules="pwRules" :counter="10" label="비밀번호" required type="password"></v-text-field>
                <v-row justify="center">
                  <v-col cols="6">
                    <v-btn color="primary" block @click="btnClick('join')">회원가입하기</v-btn>
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
        name: '',
        id: '',
        password: '',
        urlinfo: 'http://localhost:8000',
        nameRules: [
          v => !!v || '이름을 입력해주세요',
          v => v.length <= 15 || '15자리 이하 입력해주세요',
        ],
        idRules: [
          v => !!v || '이메일을 입력해주세요',
          v => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        pwRules: [
          v => !!v || '비밀번호를 입력해주세요',
        ],
      };
    },
    methods: {
      btnClick(action) {
        if (action === 'join') {
          axios.post(this.urlinfo+'/users', {
            userName: this.name,
            email: this.id,
            password: this.password
          })
          .then((res) => {
            alert("회원가입이 성공적으로 완료되었습니다.");
            this.$router.push('/'); // 페이지 이동
          })
          .catch((err) => {
            alert('에러 발생: ' + err); 
          });
        }
        this.name = '';
        this.id = '';
        this.password = '';
      },
    },
  };
  </script>
  
  <style>
  /* 추가적인 스타일링을 여기에 작성할 수 있습니다. */
  </style>
  