import dotenv from 'dotenv';

dotenv.config();

const isNull = (value: unknown): value is null => value === null;
const isUndefined = (value: unknown): value is undefined => value === undefined;
const isEmptyString = (value: unknown): boolean =>
    typeof value === 'string' && value.trim() === '';

const isEmpty = (value: unknown): boolean =>
    isNull(value) || isUndefined(value) || isEmptyString(value);

export const getEnv = (key: string): string => {
    const value = process.env[key];
    if (isEmpty(value)) {
        throw new Error(` Database environment variable "${key}" is not defined`);
    }
    return value as string;
};

export const DatabaseConfig = {
    MONGO_URI: getEnv('MONGO_URI'),
};

export default DatabaseConfig;
