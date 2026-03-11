const Scenario = require("../../../models/scenario.model");
const Worksheet = require("../../../models/worksheet.model");
const VirtualTour = require("../../../models/gs_virtualtour.model");
const responseHandler = require("../../../response/index");
const Joi = require("joi");
const moment = require("moment-timezone");
moment.locale("id");


// ✅ READ ALL Scenarios
const getAllScenarios = async (req, res) => {
  try {
    const scenarios = await Scenario.findAll({
      where: { created_by: req.user.id },
    });

    return responseHandler.success(scenarios, res);
  } catch (err) {
    return responseHandler.internalServerError(err.message, res);
  }
};


// ✅ READ SINGLE Scenario
const getScenarioById = async (req, res) => {
  try {
    const scenario = await Scenario.findByPk(req.params.id);
    if (!scenario) return responseHandler.notFound(null, res);
    return responseHandler.success(scenario, res);
  } catch (err) {
    return responseHandler.internalServerError(err.message, res);
  }
};

// ✅ UPDATE Scenario
const updateScenario = async (req, res) => {
  const schema = Joi.object({
    nama: Joi.string().min(3).max(100),
    code: Joi.string().min(4).max(10),
    deskripsi: Joi.string().min(1).max(1000),
  });

  const { error } = schema.validate(req.body);
  if (error) return responseHandler.errorParams(error.message, res);

  try {
    const scenario = await Scenario.findByPk(req.params.id);
    if (!scenario) return responseHandler.notFound(null, res);

    await scenario.update(req.body);
    await Logs.create({ user: req.user.id, action: `Updated scenario ${req.params.id}` });
    return responseHandler.successWithCustomMsg("Skenario berhasil diperbarui", scenario, res);
  } catch (err) {
    return responseHandler.internalServerError(err.message, res);
  }
};

// ✅ DELETE Scenario
const deleteScenario = async (req, res) => {
  try {
    const scenario = await Scenario.findByPk(req.params.id);
    if (!scenario) return responseHandler.notFound(null, res);

    await scenario.destroy();
    await Logs.create({ user: req.user.id, action: `Deleted scenario ${req.params.id}` });
    return responseHandler.successWithCustomMsg("Skenario berhasil dihapus", null, res);
  } catch (err) {
    return responseHandler.internalServerError(err.message, res);
  }
};

module.exports = {
  getAllScenarios,
  getScenarioById,
  updateScenario,
  deleteScenario,
};
