import usersSchema from "../models/usersSchema";

export const createUser = async (data: any) => {
  return await usersSchema.create(data);
};

export const findByCondition = async (obj: Record<string, string | number>) => {
  // console.log("obje isss--->",obj);
  
  return await usersSchema.findOne(obj);
};

export const findMany = async (obj: Record<string, string | number>) => {
  return await usersSchema.find(obj);
};

export const updateOne = async (
  condition: Record<string, string | number>,
  data: Record<string, string | number>
) => {
  return await usersSchema.findOneAndUpdate(
    condition,
    data,
    { new: true }
  );
};

export const updateById = async (
  id: string,
  data: Record<string, string | number>
) => {
  return await usersSchema.findByIdAndUpdate(
    id,
    data,
    { new: true }
  );
};

export const deleteOne = async (
  condition: Record<string, string | number>
) => {
  return await usersSchema.findOneAndDelete(condition);
};

export const deleteUserById = async (ids: string | number) => {
  return await usersSchema.findByIdAndDelete(ids);
};
