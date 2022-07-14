const joi = require("joi");

const signup = {
  body: joi
    .object()
    .required()
    .keys({
      firstName: joi
        .string()
        .required()
        .pattern(new RegExp(/[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,20}$/))
        .messages({
          "any-required": "plz send firstname",
        }),
      lastName: joi
        .string()
        .required()
        .pattern(new RegExp(/[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,20}$/))
        .messages({
          "any-required": "plz send firstname",
        }),
      password: joi
        .string()
        .required()
        .pattern(new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20}/)),
      cPassword: joi.string().valid(joi.ref("password")).required(),
      email: joi.string().email().required(),
    }),
};

const confirmEmail = {
  params: joi.object().required().keys({
    token: joi.string().required(),
  }),
};

const signin = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required(),
      password: joi
        .string()
        .required()
        .pattern(new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20}/)),
    }),
};

const forgetPassword = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required(),
      newPassword: joi
        .string()
        .required()
        .pattern(new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20}/)),
      cPassword: joi.string().valid(joi.ref("newPssword")),
      code: joi.number().required(),
    }),
};

module.exports = {
  signup,
  confirmEmail,
  signin,
  forgetPassword,
};
