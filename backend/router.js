module.exports = (app) => {
  const devices = require('./device.controller.js');
  const users = require('./user.controller.js');


  app.get('/devices', devices.findAll); //모든 운동일지 정보를 조회
  app.get('/devices/:_id', devices.findOne); // 고유의 id 값을 조회
  app.post('/devices', devices.create); //새로운 운동일지 등록
  app.put('/devices/:deviceId', devices.update); //선택한 운동일지 수정
  app.delete('/devices/:_id', devices.delete); //선택한 운동일지 삭제


  app.get('/users', users.findAll); //모든 회원정보 조회
  app.get('/users/:userName', users.findOne); //특정 회원 정보 조회
  app.post('/users', users.create); //새로운 회원 가입
  app.put('/users/:userName', users.update); //회원 정보 수정
  app.delete('/users/:userName', users.delete); //회원 정보 삭제
  app.post('/login', users.login);    // 로그인


};
