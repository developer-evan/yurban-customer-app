import { axiosInstance } from "@/lib/axiosInstance";
import config from "@/lib/config";

export const updateRideStatus = async (rideId: string, status: "accept" | "reject") => {
  try {
    const response = await axiosInstance.patch(
      `${config.apiUrl}/rides/${rideId}`,
      { status },      
    );
    return response.data;
  } catch (error:any) {
    console.error("Error updating ride status:", error);
    throw new Error(error.response?.data?.message || "Failed to update ride status");
  }
};
