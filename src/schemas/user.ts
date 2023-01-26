import { FastifySchema } from "fastify";
import { errorSchemas, fileSchema } from "./common";

const addressSchema = {
  type: "object",
  properties: {
    line1: { type: "string" },
    line2: { type: "string" },
    city: { type: "string" },
    country: { type: "string" },
    postcode: { type: "string" },
  },
};

export const loginSchema: FastifySchema = {
  body: {
    type: "object",
    properties: {
      email: { type: "string" },
      password: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        token: { type: "string" },
        email: { type: "string" },
        name: { type: "string" },
      },
    },
  },
};

const profileSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    mobile: { type: "string" },
    photo: { type: "string" },
    email: { type: "string" },
    address: addressSchema,
  },
};

export const getProfileSchema: FastifySchema = {
  response: {
    200: profileSchema,
  },
};

export const putProfileSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["address", "name", "email", "mobile"],
    properties: {
      address: addressSchema,
      name: {
        type: "object",
        properties: {
          value: {
            type: "string",
          },
        },
      },
      mobile: {
        type: "object",
        properties: {
          value: {
            type: "string",
          },
        },
      },
      photo: fileSchema,
    },
  },
  response: {
    200: profileSchema,
    ...errorSchemas,
  },
};
