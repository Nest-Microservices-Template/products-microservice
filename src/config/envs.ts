import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;

  DB_HOST: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_PORT: number;

  KAFKA_SERVER: string[];
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),

    DB_HOST: joi.string().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_DATABASE: joi.string().required(),
    DB_PORT: joi.number().required(),

    KAFKA_SERVER: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  KAFKA_SERVER: process.env.KAFKA_SERVER?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,

  kafkaBroker: envVars.KAFKA_SERVER,
};
