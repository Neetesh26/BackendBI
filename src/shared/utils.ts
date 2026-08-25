import dotenv from 'dotenv';

dotenv.config();

export const EnvironmentTypes = {
    DEV: 'development',
    PROD: 'production',
    TEST: 'test',
} as const;

export type EnvironmentType =
    typeof EnvironmentTypes[keyof typeof EnvironmentTypes];


const isNull = (value: unknown): value is null => value === null;

const isUndefined = (value: unknown): value is undefined =>
    value === undefined;

const isEmptyString = (value: unknown): boolean =>
    typeof value === 'string' && value.trim() === '';

const isEmpty = (value: unknown): boolean =>
    isNull(value) || isUndefined(value) || isEmptyString(value);



export const getEnv = (key: string): string => {
    const value = process.env[key];

    if (isEmpty(value)) {
        throw new Error(` Environment variable "${key}" is not defined`);
    }

    return value as string;
};



export const getNumberEnv = (key: string): number => {
    const value = getEnv(key);
    const num = Number(value);

    if (Number.isNaN(num)) {
        throw new Error(` Environment variable "${key}" must be a number`);
    }

    return num;
};




export const AppConfig = {
    NODE_ENV: getEnv('NODE_ENV') as EnvironmentType,
    PORT: getNumberEnv('PORT'),
    MONGO_URI: process.env.MONGO_URI || 'mongodb://root:secret@127.0.0.1:27017/ecom?authSource=admin',
    JWT_SECRET: getEnv('JWT_SECRET'),
};
