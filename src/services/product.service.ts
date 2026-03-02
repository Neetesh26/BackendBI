// import { ProductModel } from "../models/productSchema";
import { findMany } from "../repository/product.repository";
import redis from "./redisIo.service";

const getAllProducts = async () => {
    // find all products from the database and return them
    // add redis before fetching from the database

    const cachedProducts = await redis.get("products");
    if (cachedProducts) {
        console.log("fetching from cache");
        
        return JSON.parse(cachedProducts);
    }
    
    console.log("fetching from db");
    const products = await findMany({});

    redis.set("products", JSON.stringify(products), "EX", 3600);
    return products;
}
export default getAllProducts;