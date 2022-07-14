const Joi = require("joi");

const addProduct = {
  body: Joi.object().required().keys({
    title: Joi.string().required(),
    desc: Joi.string().required(),
    price: Joi.number().required(),
  }),
};
const likeProduct = {
  params: Joi.object()
    .required()
    .keys({
      id: Joi.string().min(24).max(24),
    }),
};

const addComment = {
  body: Joi.object().required().keys({
    commentBody: Joi.string().required(),
  }),
  params: Joi.object()
    .required()
    .keys({
      id: Joi.string().min(24).max(24),
    }),
};
const replyComment = {
  body: Joi.object().required().keys({
    commentBody: Joi.string().required(),
  }),
  params: Joi.object()
    .required()
    .keys({
      id: Joi.string().min(24).max(24),
      commentID: Joi.string().min(24).max(24),
    }),
};
module.exports = {
  addProduct,
  likeProduct,
  addComment,
  replyComment,
};
