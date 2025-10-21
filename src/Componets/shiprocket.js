// shiprocket.js
import axios from "axios";

// Shiprocket credentials
const SHIPROCKET_EMAIL = "dhivakarp305@gmail.com";
const SHIPROCKET_PASSWORD = "Dhiva@3005";
const BASE_URL = "https://apiv2.shiprocket.in/v1/external";

// Function to get auth token
export const getShiprocketToken = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: SHIPROCKET_EMAIL,
      password: SHIPROCKET_PASSWORD,
    });
    return response.data.token; // Save this token to make further requests
  } catch (error) {
    console.error("Shiprocket login error:", error);
    return null;
  }
};

// Function to create shipment
export const createShipment = async (token, shipmentData) => {
  try {
    const response = await axios.post(`${BASE_URL}/courier/assign/awb`, shipmentData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating shipment:", error.response?.data || error);
    return null;
  }
};
