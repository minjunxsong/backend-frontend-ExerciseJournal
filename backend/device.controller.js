const Device = require('./device.model.js');

// 새로운 연락처 만들기
exports.create = (req, res) => {
  const contact = new Device({
    deviceId: req.body.deviceId,
    name: req.body.name,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    description: req.body.description
  });

  //데이터베이스에 새로운 연락처 저장하기 
  contact.save()
    .then(data => { res.send(data); })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};


//모든 연락처 검색
exports.findAll = (req, res) => {
  Device.find()
    .then(contacts => {
      res.send(contacts);
      console.log(contacts)	//test log
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

//특정한 연락처 검색
exports.findOne = (req, res) => {
  Device.find({ _id: req.params._id })
    .then(device => {
      if (!device) {
        return res.status(404).send({
          message: "해당하는 장치를 찾을 수 없습니다."
        });
      }
      res.send(device);
    })
    .catch(err => {
      return res.status(500).send({ message: err.message });
    });
};

//업데이트
exports.update = (req, res) => {
  Device.findOneAndUpdate({ deviceId: req.params.deviceId },
    { deviceId: req.body.deviceId, name: req.body.name, latitude: req.body.latitude, longitude: req.body.longitude, description: req.body.description },
    { new: true }
  )
    .then(contact => {
      if (!contact) {
        return res.status(404).send({
          message: req.params.deviceId +
            "에 해당하는 장치가 발견되지 않았습니다."
        })
      }
      res.send(contact);
    }).catch(err => {
      return res.status(500).send({ message: err.message });
    });
};

//삭제
// 연락처 삭제 (여러 속성 이용)
// 삭제
exports.delete = (req, res) => {
  const { _id } = req.params; // _id 값을 URL 파라미터에서 가져옵니다.

  Device.findOneAndDelete({ _id })
    .then(contact => {
      if (!contact) {
        return res.status(404).send({ message: "해당하는 연락처가 없습니다." });
      }
      res.send({ message: "정상적으로 연락처가 삭제되었습니다." });
    })
    .catch(err => {
      return res.status(500).send({ message: err.message });
    });
};











