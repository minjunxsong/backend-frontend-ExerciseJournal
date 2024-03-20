const mongoose = require('mongoose');

var DeviceSchema = mongoose.Schema({   //스키마(Schema) 설정
  deviceId: {type: String, require:true},    //사용자 아이디
  name: { type: String, require: true},      //사용자 이름
  latitude: { type: String, require: true},  //운동 이름
  longitude: { type: Number, require: true}, // 무게
  description: { type: Number, require: true}, // 횟수
  register_date: { type: Date, default:Date.now} // 날짜
});

module.exports = mongoose.model('Device', DeviceSchema); //소문자화 후 복수형으로 바꾸어 devices 컬렉션이 됨
