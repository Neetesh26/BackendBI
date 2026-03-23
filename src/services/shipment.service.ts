import { Shippo } from "shippo";
import { getEnv } from "../config/env";

const shippoClient = new Shippo({
  apiKeyHeader: getEnv("SHIPPO_KEY"),
});

export const createShipmentService = async () => {

  const shipment = await shippoClient.shipments.create({
    addressFrom: {
      name: "My Store",
      street1: "Warehouse Road",
      city: "Delhi",
      state: "DL",
      zip: "110001",
      country: "IN",
    },

    addressTo: {
      name: "Customer",
      street1: "Customer Address",
      city: "Mumbai",
      state: "MH",
      zip: "400001",
      country: "IN",
    },

    parcels: [
  {
    length: "10",
    width: "10",
    height: "5",
    distanceUnit: "cm",
    weight: "1",
    massUnit: "kg",
  },
]
  });

  return shipment;
};