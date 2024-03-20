const mongoose = require('mongoose');

var UserSchema = mongoose.Schema({   
  userName: {type: String, require:true},  //사용자 아이디
  email: { type: String, require: true},   //사용자 이메일
  password: { type: String, require: true} //사용자 비밀먼호
});

module.exports = mongoose.model('User', UserSchema); //소문자화 후 복수형으로 바꾸어 contacts 컬렉션이 됨
