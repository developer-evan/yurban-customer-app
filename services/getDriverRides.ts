import { axiosInstance } from "@/lib/axiosInstance";
import config from "@/lib/config";

export const getDriverRides = async () => {
  try {
    const response = await axiosInstance.get(`${config.apiUrl}/driver/rides`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching driver rides:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch rides");
  }
};
