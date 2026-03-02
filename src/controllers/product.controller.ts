import { HttpStatus } from "../constants";
import asyncWrapper from "../middleware/asyncWrapper";
import getAllProducts from "../services/product.service";
import { Request, Response } from "express";

const getAllProductController = asyncWrapper(async (_req : Request, res : Response) => {
  const products = await getAllProducts();
  
 return res.status(HttpStatus.OK).json({ products });
});

export default getAllProductController;