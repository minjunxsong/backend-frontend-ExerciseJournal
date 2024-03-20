<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            <v-app-bar-nav-icon @click.stop="bDrawer = !bDrawer"></v-app-bar-nav-icon>

            <v-toolbar-title :class="userName ? 'welcome-text' : 'login-text'">
                <svg-icon type="mdi" :path="path8"></svg-icon>
                {{ userName ? `${userName} 님 환영합니다.` : '로그인 하십시오.' }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <router-link v-if="!userName" to="/login"><v-btn class="pink"><svg-icon type="mdi"
                        :path="path4"></svg-icon>로그인</v-btn></router-link>
            <v-btn v-else class="pink" @click="logout"><svg-icon type="mdi" :path="path5"></svg-icon>로그아웃</v-btn>
        </v-app-bar>

        <v-navigation-drawer absolute temporary v-model="bDrawer">
            <v-toolbar flat height="100px">

                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-avatar>
                                <img
                                    src="data:image/jpeg;base64,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">
                            </v-list-item-avatar>
                            <v-list-item-title class="title">메뉴</v-list-item-title>
                            <v-list-item-subtitle></v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-toolbar>
            <v-divider></v-divider>
            <v-list class="pt-3">
                <v-list-item v-for="item in items" :key="item.text" :href="item.to">
                    <v-list-item-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>{{ item.text }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-content>

            <router-view></router-view>
        </v-content>
        <v-footer class="custom-footer">
            <div class="text-xs-center">
                <span>{{ formattedDate }}</span>
            </div>

            <v-spacer></v-spacer>
            <v-btn icon @click="insta" class="icon-button" style="background-color: #da39e6;"> <!-- 인스타그램 버튼 색상 설정 -->
                <svg-icon type="mdi" :path="path7" class="icon"></svg-icon>
            </v-btn>
            <v-btn icon @click="youtube" class="icon-button" style="background-color: red;"> <!-- 유튜브 버튼 색상 설정 -->
                <svg-icon type="mdi" :path="path6" class="icon"></svg-icon>
            </v-btn>

            <v-dialog v-model="weatherDialog" max-width="900">
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" color="red" dark><svg-icon type="mdi" :path="path9"></svg-icon>날씨 확인</v-btn>
                </template>
                <v-card class="dialog-card">
                    <LiveView />
                </v-card>
            </v-dialog>
        </v-footer>
    </v-app>
</template>

<script>

import LiveView from './components/LiveView.vue';
import moment from 'moment';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiMapSearchOutline } from '@mdi/js';
import { mdiApplicationEditOutline } from '@mdi/js';
import { mdiApps } from '@mdi/js';
import { mdiLogin } from '@mdi/js';
import { mdiLogout } from '@mdi/js';
import { mdiYoutube } from '@mdi/js';
import { mdiInstagram } from '@mdi/js';
import { mdiAccount } from '@mdi/js';
import { mdiWeatherPartlyCloudy } from '@mdi/js';
import 'moment/locale/ko'; // 한국어 로케일을 불러옵니다.

export default {
    name: 'App',
    components: {
        LiveView,
        SvgIcon
    },

    data() {
        return {
            path1: mdiMapSearchOutline,
            path2: mdiApplicationEditOutline,
            path3: mdiApps,
            path4: mdiLogin,
            path5: mdiLogout,
            path6: mdiYoutube,
            path7: mdiInstagram,
            path8: mdiAccount,
            path9: mdiWeatherPartlyCloudy,
            userName: '',
            bDrawer: false,
            weatherDrawer: false, // 날씨 확인을 위한 drawer 상태 변수 추가
            weatherDialog: false, // 날씨 확인을 위한 dialog 상태 변수 추가
            items: [
                { text: '지도', icon: mdiMapSearchOutline, to: '/home' },
                { text: '운동일지', icon: mdiApplicationEditOutline, to: '/about' },
                { text: 'App', icon: mdiApps, to: '/launchpad' },
            ],
            currentTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
    },
    created() {
        // 로컬 스토리지에서 사용자 이름 가져오기

        this.$socket.on('live', (data) => {
            this.userName = data.userName;
        });
        const storedUserName = localStorage.getItem('userName');

        if (storedUserName) {
            this.userName = storedUserName;
        }


        setInterval(() => {
            this.currentTime = moment().format('YYYY-MM-DD HH:mm:ss'); // 1초마다 현재 시간 업데이트
        }, 1000); // 1초(1000밀리초)마다 실행
    },

    methods: {

        insta() {
            window.location.href = 'https://www.instagram.com/';
        },
        youtube() {
            window.location.href = 'https://www.youtube.com/';
        },

        logout() {
            // 로그아웃 기능
            localStorage.removeItem('userName'); // 로컬 스토리지에서 사용자 정보 삭제
            this.userName = ''; // 사용자 정보 초기화
            window.location.reload(); // 창 새로고침
            // 기타 로그아웃 시 필요한 작업들...
        },
        // "날씨확인" 버튼에 마우스를 갖다 대면 내비게이션 바를 내리도록 하는 메서드
        showWeatherDrawer() {
            this.weatherDrawer = true;
        },
        // 마우스를 버튼 밖으로 움직이면 내비게이션 바를 올리도록 하는 메서드
        hideWeatherDrawer() {
            this.weatherDrawer = false;
        },
    },
    computed: {
        // computed 속성을 추가하여 화면에 표시할 형식으로 날짜를 포맷합니다.
        formattedDate() {
            const moment = require('moment'); // moment.js를 이곳에서 가져옵니다.
            moment.locale('ko'); // 한국어 로케일 설정
            return moment(this.currentTime).format('YYYY년 MMMM Do, a h:mm:ss');
            // 원하는 형식으로 한국어 날짜 포맷 설정
        },
    },
};
</script>
<style scoped>
a {
    text-decoration: none;
    color: white;
}

.dialog-card {
    height: 600px;
    /* 원하는 높이 조절 */
    overflow-y: auto;
    /* 내용이 넘칠 경우 스크롤 표시 */
}

/* LiveView 컨테이너 스타일 */
.live-view-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    /* 원하는 크기로 조절해보세요 */
    padding: 20px;
    /* 여백 조절 가능 */
}

.v-toolbar-title {
    font-size: 18px;
    /* 폰트 사이즈 변경 */
}

/* 다이얼로그 내 LiveView 디자인 수정 */
.v-dialog--width-xl .v-card {
    /* 최대 너비에 따른 크기 설정 */
    width: 100%;
    /* 전체 너비 사용 */
    max-width: none;
    /* 최대 너비 없애기 */
    height: 600px;
    /* 원하는 높이 조절 */
}

.custom-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    background-color: #1976d2;
    color: white;
}

.icon-button {
    /* 버튼 스타일 수정 */
    margin: 0 5px;
}

.icon {
    /* 아이콘 크기와 색상 조정 */
    font-size: 24px;
    color: #fff;
}

.welcome-text,
.login-text {
    display: flex;
    align-items: center;
}

.welcome-text svg,
.login-text svg {
    margin-right: 8px;
    /* 아이콘과 텍스트 사이 여백 설정 */
    filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5));
    /* 그림자 효과 추가 */
}
</style>

