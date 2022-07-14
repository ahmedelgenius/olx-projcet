const joi = require("joi");

const profile = {
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
const updatePassword = {
  body: joi
    .object()
    .required()
    .keys({
      oldPassword: joi
        .string()
        .required()
        .pattern(new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20}/)),
      newPassword: joi
        .string()
        .required()
        .pattern(new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20}/)),
      cPassword: joi.string().valid(joi.ref("newPassword")).required(),
    }),
};

const updateProfile = {
  body: joi.object().required().keys({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().required(),
  }),
  params: joi
    .object()
    .required()
    .keys({
      id: joi.string().min(24).max(24).required(),
    }),
};

module.exports = { profile, updatePassword, updateProfile };
