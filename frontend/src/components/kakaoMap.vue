<template>
    <div class="map-container">
        <h2></h2>
        <div class="map-wrap">
            <div class="map" id="map" style="width: 700px; height: 600px;"></div>
            <div id="menu_wrap" class="bg_white">
                <div class="places_list">
                    <div id="result"></div> <!-- 이 부분을 추가해 주세요 -->
                    <!-- 검색 창을 상단에 고정시킵니다. -->
                    <div class="search_box">
                        <form @submit.prevent="searchPlaces">
                            <div class="input-group">
                                <input type="text" v-model="keyword" placeholder="키워드를 입력하세요." />
                                <button type="submit">검색</button>
                            </div>
                        </form>
                    </div>
                    <hr />
                    <ul id="placesList"></ul>
                    <div id="pagination"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "KakaoMap",
    data() {
        return {
            map: null,
            markers: [],
            infowindow: null,
            keyword: "대전 헬스장 ",
            ps: null,
        };
    },
    mounted() {
        this.loadKakaoMap();
    },
    methods: {
        loadKakaoMap() {
            if (!window.kakao) {
                const script = document.createElement("script");
                script.src =
                    "//dapi.kakao.com/v2/maps/sdk.js?appkey=30c6062ca0ae3c9d837194139c92d0b6&libraries=services&autoload=false";
                script.onload = () => {
                    window.kakao.maps.load(() => {
                        this.initMap();
                    });
                };
                document.head.appendChild(script);
            } else {
                window.kakao.maps.load(() => {
                    this.initMap();
                });
            }
        },
        initMap() {
            const container = document.getElementById("map");
            const options = {
                center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
                level: 3,
            };
            this.map = new window.kakao.maps.Map(container, options);

            // 이벤트 핸들러를 등록하는 부분
            this.map.addListener('dragend', () => {


                this.$bus.$emit('sendCordinate', this.map.getCenter());
            });

            this.ps = new window.kakao.maps.services.Places();
            this.infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });

            const mapCenter = this.map.getCenter();
            this.$bus.$emit('sendCordinate', mapCenter);

            this.searchPlaces();
        },

        searchPlaces() {
            if (!this.keyword.trim()) {
                alert("키워드를 입력해주세요!");
                return;
            }

            this.ps.keywordSearch(this.keyword, this.placesSearchCB);
        },
        placesSearchCB(data, status, pagination) {
            if (status === window.kakao.maps.services.Status.OK) {
                this.displayPlaces(data);
                this.displayPagination(pagination);

                // 검색 결과가 OK일 때, 첫 번째 장소로 지도 이동
                const firstPlace = data[0];
                const position = new window.kakao.maps.LatLng(firstPlace.y, firstPlace.x);
                this.map.panTo(position); // 해당 위치로 지도 이동

                // 이동한 위치의 좌표를 버스를 통해 전달
                this.$bus.$emit('sendCordinate', position);
            } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                alert("검색 결과가 존재하지 않습니다.");
            } else if (status === window.kakao.maps.services.Status.ERROR) {
                alert("검색 결과 중 오류가 발생했습니다.");
            }
        },

        displayPlaces(places) {
            const listEl = document.getElementById("placesList"),
                bounds = new window.kakao.maps.LatLngBounds();

            this.removeAllChildNodes(listEl);
            this.removeMarker();

            places.forEach((place, index) => {
                const placePosition = new window.kakao.maps.LatLng(place.y, place.x);

                const itemEl = this.getListItem(index, place);
                const marker = this.addMarker(placePosition, index, place.place_name);
                this.bindMarkerEvents(marker, place.place_name);
                bounds.extend(placePosition);


                listEl.appendChild(itemEl);
            });

            this.map.setBounds(bounds);
        },
        addMarker(position, idx, title) {
            const imageSrc =
                "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png";
            const imageSize = new window.kakao.maps.Size(36, 37);
            const imgOptions = {
                spriteSize: new window.kakao.maps.Size(36, 691),
                spriteOrigin: new window.kakao.maps.Point(0, idx * 46 + 10),
                offset: new window.kakao.maps.Point(13, 37),
            };

            const markerImage = new window.kakao.maps.MarkerImage(
                imageSrc,
                imageSize,
                imgOptions
            );

            const marker = new window.kakao.maps.Marker({
                position,
                image: markerImage,
            });

            marker.setMap(this.map);
            this.markers.push(marker);

            return marker;
        },
        bindMarkerEvents(marker, place_name) {
            const infowindow = this.infowindow;

            marker.addListener("mouseover", () => {
                infowindow.setContent('<div style="padding:5px;z-index:1;">' + place_name + '</div>');
                infowindow.open(this.map, marker);
            });

            marker.addListener("mouseout", () => {
                infowindow.close();
            });
        },
        getListItem(index, place) {
            const el = document.createElement("li");
            let itemStr = `<span class="markerbg marker_${index + 1}"></span>
            <div class="info">
                <h5>${place.place_name}</h5>`;

            if (place.road_address_name) {
                itemStr += `<span>${place.road_address_name}</span>
                <span class="jibun gray">${place.address_name}</span>`;
            } else {
                itemStr += `<span>${place.address_name}</span>`;
            }

            itemStr += `<span class="tel">${place.phone}</span>
            </div>`;

            el.innerHTML = itemStr;
            el.className = "item";

            el.addEventListener('click', () => {
                // 클릭한 위치의 좌표
                const position = new window.kakao.maps.LatLng(place.y, place.x);

                // 해당 위치의 마커를 찾아서 지도 이동
                this.markers.forEach(marker => {
                    const markerPosition = marker.getPosition();
                    if (markerPosition.equals(position)) {
                        this.map.panTo(position);
                        this.infowindow.setContent(`<div style="padding:5px;z-index:1;">${place.place_name}</div>`);
                        this.infowindow.open(this.map, marker);
                    }
                });
            });

            return el;
        },

        removeMarker() {
            this.markers.forEach((marker) => {
                marker.setMap(null);
            });
            this.markers = [];
        },
        removeAllChildNodes(el) {
            while (el.hasChildNodes()) {
                el.removeChild(el.lastChild);
            }
        },
        displayPagination(pagination) {
            const paginationEl = document.getElementById("pagination");
            let fragment = document.createDocumentFragment();

            while (paginationEl.hasChildNodes()) {
                paginationEl.removeChild(paginationEl.lastChild);
            }

            paginationEl.appendChild(fragment);
        },
    },
};
</script>
  
<style>
.search_box {
    position: sticky;
    top: 0;
    background-color: #fff;
    z-index: 2;
    padding: 10px;
}

.input-group {
    display: flex;
    align-items: center;
}

.input-group input[type="text"] {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 10px;
    font-size: 14px;
}

.input-group button[type="submit"] {
    padding: 8px 8px;
    border: 1px solid #007BFF;
    background-color: #007BFF;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

}

.input-group button[type="submit"]:hover {
    background-color: #0056b3;
}

/* 검색 목록 디자인 */
.places_list ul {
    padding: 0;
    list-style: none;
}

.places_list .item {
    position: relative;
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
}

.places_list .item h5 {
    margin: 0;
    font-size: 16px;
    color: #333;
    margin-bottom: 5px;
}

.places_list .item span {
    font-size: 14px;
    color: #666;
    display: block;
    line-height: 1.5;
}

.map_wrap,
.map_wrap * {
    margin: 0;
    padding: 0;
    font-family: 'Malgun Gothic', dotum, '돋움', sans-serif;
    font-size: 12px;

}

.map_wrap a,
.map_wrap a:hover,
.map_wrap a:active {
    color: #000;
    text-decoration: none;
}

.map_wrap {
    display: flex;
    flex-direction: column;
    padding: 20px;
    position: relative;
    width: 100%;
    height: 500px
}

.map-container {
    display: flex;
    justify-content: space-between;
}

#placesList .item .info {
    background-color: rgba(255, 255, 255, 0.12) !important;
    border-color: rgba(255, 255, 255, 0.12) !important;
}

#menu_wrap {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 250px;
    margin: 22px 0 100px 10px;
    padding: 5px;
    overflow-y: auto;
    background: rgba(255, 255, 255, 0.7);
    z-index: 1;
    font-size: 12px;
    border-radius: 10px;
}

.bg_white {
    background: #fff;
}

#menu_wrap hr {
    display: block;
    height: 1px;
    border: 0;
    border-top: 2px solid #5F5F5F;
    margin: 3px 0;
}

#menu_wrap .option {
    text-align: center;
}

#menu_wrap .option p {
    margin: 10px 0;
}

#menu_wrap .option button {
    margin-left: 5px;
}

#placesList li {
    list-style: none;

}

.places_list {
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: hidden;
    /* 내용이 넘치는 경우를 방지하기 위해 오버플로우를 숨김 */
}

#placesList .item {
    position: relative;
    border-bottom: 1px solid #888;
    overflow: hidden;
    cursor: pointer;
    min-height: 65px;
    transition: transform 0.3s ease-in-out;
}

#placesList .item:hover {
    transform: translateY(-5px);
}

#placesList .item span {
    display: block;
    margin-top: 4px;
}

#placesList .item h5,
#placesList .item .info {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

#placesList .item .info {
    padding: 10px 0 10px 55px;
}

#placesList .info .gray {
    color: #8a8a8a;
}

#placesList .info .jibun {
    padding-left: 26px;
    background: url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_jibun.png) no-repeat;
}

#placesList .info .tel {
    color: #009900;
}

#placesList .item .markerbg {
    float: left;
    position: absolute;
    width: 36px;
    height: 37px;
    margin: 10px 0 0 10px;
    background: url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png) no-repeat;
}

#placesList .item .marker_1 {
    background-position: 0 -10px;
}

#placesList .item .marker_2 {
    background-position: 0 -56px;
}

#placesList .item .marker_3 {
    background-position: 0 -102px
}

#placesList .item .marker_4 {
    background-position: 0 -148px;
}

#placesList .item .marker_5 {
    background-position: 0 -194px;
}

#placesList .item .marker_6 {
    background-position: 0 -240px;
}

#placesList .item .marker_7 {
    background-position: 0 -286px;
}

#placesList .item .marker_8 {
    background-position: 0 -332px;
}

#placesList .item .marker_9 {
    background-position: 0 -378px;
}

#placesList .item .marker_10 {
    background-position: 0 -423px;
}

#placesList .item .marker_11 {
    background-position: 0 -470px;
}

#placesList .item .marker_12 {
    background-position: 0 -516px;
}

#placesList .item .marker_13 {
    background-position: 0 -562px;
}

#placesList .item .marker_14 {
    background-position: 0 -608px;
}

#placesList .item .marker_15 {
    background-position: 0 -654px;
}

#pagination {
    margin: 10px auto;
    text-align: center;
}

#pagination a {
    display: inline-block;
    margin-right: 10px;
}

#pagination .on {
    font-weight: bold;
    cursor: default;
    color: #777;
}</style>