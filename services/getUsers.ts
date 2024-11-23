import { axiosInstance } from "@/lib/axiosInstance";
import config from "@/lib/config";

export const getUsers = async () => {
  try {
    const response = await axiosInstance.get(`${config.apiUrl}/auth/users`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};
