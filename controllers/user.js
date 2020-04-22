const User = require("../models/user");
const { validationResult } = require("express-validator");
exports.getIndex = (req, res, next) => {
  // ค่าน้ำจดทุกวันที่ 8
  // ค่าไฟจดทุกวันที่ 23
  const waterData = [...req.user.units.water];
  const waterDataDate = waterData.map((data) => data.date);
  const waterDataUnits = waterData.map((data) => data.units);
  let waterCalculate = [];
  let tempCountW = 0;
  waterData.forEach((data, index) => {
    if (data.date.split("/")[0] === "8" && index != 0) {
      const differenceUnit = data.units - waterData[index - tempCountW].units;
      const price = req.user.pricePerWaterUnit * differenceUnit;
      waterCalculate.push({
        date: data.date,
        differenceUnit: differenceUnit,
        price: price,
      });
      tempCountW = 0;
    }
    tempCountW += 1;
  });

  const electricityData = [...req.user.units.electricity];
  const electricityDataDate = electricityData.map((data) => data.date);
  const electricityDataUnits = electricityData.map((data) => data.units);
  let electricityCalculate = [];
  let tempCountEl = 0;
  electricityData.forEach((data, index) => {
    if (data.date.split("/")[0] === "23" && index != 0) {
      const differenceUnit =
        data.units - electricityData[index - tempCountEl].units;
      const price = req.user.pricePerElectricityUnit * differenceUnit;
      electricityCalculate.push({
        date: data.date,
        differenceUnit: differenceUnit,
        price: price,
      });
      tempCountEl = 0;
    }
    tempCountEl += 1;
  });

  const pricePerWaterUnit = req.user.pricePerWaterUnit;
  const pricePerElectricityUnit = req.user.pricePerElectricityUnit;
  //Date
  monthTemp = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  res.render("user/index", {
    waterDataDate: waterDataDate,
    waterDataUnits: waterDataUnits,
    waterCalculate: waterCalculate,

    electricityDataDate: electricityDataDate,
    electricityDataUnits: electricityDataUnits,
    electricityCalculate: electricityCalculate,

    pricePerWaterUnit: pricePerWaterUnit,
    pricePerElectricityUnit: pricePerElectricityUnit,

    userId: req.user._id,

    date: new Date().getDate(),
    month: monthTemp[new Date().getMonth() - 1],
    year: new Date().getFullYear(),
  });
};

exports.getUnitWater = (req, res, next) => {
  console.log(req.user.units.water.slice(-1)[0]);
  let value;
  if(req.user.units.water.slice(-1)[0]){
    value = req.user.units.water.slice(-1)[0].units
  }
  else{
    value = 0
  }
  res.render("user/inputUnitWater", {
    errorMessage: "",
    value: value,
    validationErrors: [],
  });
};
exports.getUnitElectricity = (req, res, next) => {
  let value;
  if(req.user.units.electricity.slice(-1)[0]){
    value = req.user.units.electricity.slice(-1)[0].units
  }
  else{
    value = 0
  }
  res.render("user/inputUnitElectricity", {
    errorMessage: "",
    value: value,
    validationErrors: [],
  });
};

exports.postUnitWater = (req, res, next) => {
  const unitWater = req.body.unitWater;
  const user = req.user;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("user/inputUnitWater", {
      errorMessage: errors.array()[0].msg,
      value: req.user.units.water.slice(-1)[0].units,
      validationErrors: errors.array(),
    });
  }
  return user
    .addWater(unitWater)
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};
exports.postUnitElectricity = (req, res, next) => {
  const unitElectricity = req.body.unitElectricity;
  const user = req.user;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("user/inputUnitElectricity", {
      errorMessage: errors.array()[0].msg,
      value: req.user.units.electricity.slice(-1)[0].units,
      validationErrors: errors.array(),
    });
  }
  return user
    .addElectricity(unitElectricity)
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};
