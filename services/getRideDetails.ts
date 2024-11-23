import { axiosInstance } from "@/lib/axiosInstance";
import config from "@/lib/config";

export const getRideDetails = async (id: string) => {
  try {
    const response = await axiosInstance.get(`${config.apiUrl}/rides/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching driver rides:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch rides");
  }
};
