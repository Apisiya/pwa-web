const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pricePerWaterUnit: { type: Number, required: true },
  pricePerElectricityUnit: { type: Number, required: true },
  units: {
    water: [
      {
        date: { type: String, required: true },
        units: { type: Number, required: true },
      },
    ],
    electricity: [
      {
        date: { type: String, required: true },
        units: { type: Number, required: true },
      },
      ,
    ],
  },
});

userSchema.methods.addElectricity = function (electricity) {
  const updatedElectricity = [...this.units.electricity];
  const date = new Date().getDate();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  const strDate =
    date.toString() + "/" + month.toString() + "/" + year.toString();
  const alreadyHaveIndex = updatedElectricity.findIndex(
    (item) => item.date.toString() === strDate
  );
  if (alreadyHaveIndex === -1) {
    updatedElectricity.push({
      date: strDate,
      units: electricity,
    });
  } else {
    updatedElectricity[alreadyHaveIndex].units = electricity;
  }

  this.units.electricity = updatedElectricity;
  return this.save();
};

userSchema.methods.addWater = function (water) {
  const updatedWater = [...this.units.water];
  const date = new Date().getDate();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  const strDate =
    date.toString() + "/" + month.toString() + "/" + year.toString();
  const alreadyHaveIndex = updatedWater.findIndex(
    (item) => item.date.toString() === strDate
  );
  if (alreadyHaveIndex === -1) {
    updatedWater.push({
      date: strDate,
      units: water,
    });
  } else {
    updatedWater[alreadyHaveIndex].units = water;
  }
  this.units.water = updatedWater;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
