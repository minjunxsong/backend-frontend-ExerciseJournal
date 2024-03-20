const User = require('./user.model.js');

// 새로운 연락처 만들기
exports.create = (req, res) => {
 
  console.log(req.body);
  const user = new User({ 
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });
  
   //데이터베이스에 새로운 연락처 저장하기 
   user.save()
   .then(data => { 
     res.status(200).send(data);
   })
   .catch(err => { 
    res.status(400).send()
   });
 
 };

// 로그인

exports.login = (req,res)=>{
  console.log(req.body);

User.findOne({userName: req.body.userName, password: req.body.password})
.then(user => {
 
    if(!user){
      res.status(404).send()
      } 
      else {
        
        $socket.emit('live',{         //새로운 장치 데이터가 업로드되면 소켓을 이용하여 클라이언트에 전달
          userName:req.body.userName,
          
      }); 
        const objToSend = {
          userName: user.userName,
          email: user.email,
      }
    
        //객체를 JSON으로 변환하여 전송
        res.status(200).send(JSON.stringify(objToSend))
      }

  })
};
  

// 모든사용자 검색
exports.findAll = (req,res)=> {
  User.find()
  .then(users => {
      res.send(users);
      console.log(users);
  })
  .catch(err => {
      res.status(500).send({message:err.message});
  });
};

// 특정 사용자 검색
exports.findOne = (req,res) => {
  User.findOne({userName : req.body.userName})
  .then(user => {
      if(!user){
          return res.status(404).send({
              message: req.params.userName + "에 해당되는 사용자가 없습니다."});
      }
      res.send(user);
  }).catch(err => {
      return res.status(500).send({message: req.params.userName + "로 검색 중 에러 발생"});
  });
};

// 업데이트
exports.update = (req,res) => {
  User.findOneAndUpdate( {userName:req.params.userName},
      {
          userName: req.body.userName,
          email: req.body.email,
          password: req.body.password
      },
      {new:true}
      ).then(user => {
          if(!user) {
              return res.status(404).send({ message: req.params.userName+ "에 해당하는 사용자가 발견되지 않았습니다."})
          }
          res.send(user);
      }).catch(err => {
          return res.status(500).send({message:err.message});
      });
};

// 사용자 삭제
exports.delete = (req,res) => {
  User.findOneAndDelete({userName:req.params.userName})
  .then(user => {
      if(!user) {
          return res.status(404).send({message: req.params.userName+"에 해당하는 사용자가 없습니다."})
      }
      res.send({message:"정상적으로"+req.params.userName+" 사용자가 삭제되었습니다."})
  })
  .catch(err => {
      return res.status(500).send({message:err.message});
  });
};








