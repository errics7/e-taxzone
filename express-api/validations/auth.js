const Joi = require('joi')

module.exports = function (req) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })

  return schema.validate(req, {
    abortEarly: false
  })
}
