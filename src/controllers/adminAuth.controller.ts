import { Request, Response } from "express";
import asyncWrapper from "../middleware/asyncWrapper";
import { adminLoginServices, createProducts, updateProductService } from "../services/adminAuth.service";
import NotFoundHandler from "../errors/NotFoundHandler";
import { HttpMessage, HttpStatus } from "../constants";
import { uploadToImageKit } from "../services/storage.service";


export const adminLogin = asyncWrapper(
  async (req: Request, res: Response) => {
  const { phone } = req.body;
  const user = await adminLoginServices(phone)
  if (!user) {
    throw new NotFoundHandler(HttpMessage.NOT_FOUND, HttpStatus.NOT_FOUND)
  }
  return res.status(HttpStatus.OK).json({
    message: HttpMessage.OK,
    user: user
  });
}
)

export const addProductController = asyncWrapper(
  async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];

    const uploadedImages = await Promise.all(
      files.map((file) =>
        uploadToImageKit(file.buffer, file.originalname)
      )
    );
    // console.log(" req body product--->",req.body);
    
    const product = await createProducts({
      productName: req.body.productName,
      description: req.body.description,
      category: req.body.category,

      price: {
        currency: req.body.currency || "INR",
        amount: Number(req.body.amount),
      },

      sizes: Array.isArray(req.body.sizes)
        ? req.body.sizes
        : [req.body.sizes],

      colors: req.body.colors,

      images: uploadedImages.map((img: any) => img.url),
    });

    return res.status(HttpStatus.CREATED).json({
      message: HttpMessage.CREATED,
      data: product,
    });
  }
);


export const updateProductController = asyncWrapper(
  async (req: Request, res: Response) => {

    const { productId } = req.params;
    // console.log("product id",productId);
    
    const updatedProduct = await updateProductService(
      productId,
      req.body,
      req.files as Express.Multer.File[]
    );

    return res.status(HttpStatus.OK).json({
      message: HttpMessage.OK,
      data: updatedProduct,
    });
  }
);

