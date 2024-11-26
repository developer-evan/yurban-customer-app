import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LogOut, MapPinned, User } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { getUserProfile } from "@/services/getProfile";
import { Colors } from "@/constants/Colors";

const Profile = () => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
  });

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "user_id",
        "username",
        "session_token",
        "email",
      ]);
      console.log("User logged out successfully.");
      router.push("/(auth)" as any);
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load profile</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Image
            source={{ uri: user?.user?.profilePicture }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.name}>
              {user?.user?.firstName} {user?.user?.lastName}
            </Text>
            <Text style={styles.role}>
              {user?.user?.role || "Not available"}
            </Text>
          </View>
        </View>
        <View
          style={{
            // borderBottomWidth: 1,
            // borderBottomColor: "#f1f1f1",
            marginBottom: 8,
            paddingBottom: 5,
          }}
        >
          <Text
            style={{
              color: Colors.light.tint,
            }}
          >
            Email
          </Text>

          <View style={styles.detailContainer}>
            <MaterialIcons name="email" size={24} color="#6c757d" />
            <Text style={styles.detailText}>{user?.user?.email}</Text>
          </View>
        </View>
        <View
          style={{
            // borderBottomWidth: 1,
            // borderBottomColor: "#f1f1f1",
            marginBottom: 8,
            paddingBottom: 5,
          }}
        >
          <Text
            style={{
              color: Colors.light.tint,
            }}
          >
            Phone:
          </Text>

          <View style={styles.detailContainer}>
            <FontAwesome name="phone" size={24} color="#6c757d" />
            <Text style={styles.detailText}>
              {user?.user?.phoneNumber || "Not available"}
            </Text>
          </View>
        </View>

        <View
          style={{
            // borderBottomWidth: 1,
            // borderBottomColor: "#f1f1f1",
            marginBottom: 8,
            paddingBottom: 5,
          }}
        >
          <Text
            style={{
              color: Colors.light.tint,
            }}
          >
            County
          </Text>
          <View style={styles.detailContainer}>
            <MapPinned size={24} color="#6c757d" />
            <Text style={styles.detailText}>
              {user?.user?.county || "Not available"}
            </Text>
          </View>
        </View>
        <View
          style={{
            // borderBottomWidth: 1,
            // borderBottomColor: "#f1f1f1",
            marginBottom: 8,
            paddingBottom: 5,
          }}
        >
          <Text
            style={{
              color: Colors.light.tint,
            }}
          >
            Sub-County
          </Text>
          <View style={styles.detailContainer}>
            <MapPinned size={24} color="#6c757d" />
            <Text style={styles.detailText}>
              {user?.user?.subCounty || "Not available"}
            </Text>
          </View>
        </View>

        <View
          style={{
            // borderBottomWidth: 1,
            // borderBottomColor: "#f1f1f1",
            marginBottom: 8,
            paddingBottom: 5,
          }}
        >
          <Text
            style={{
              color: Colors.light.tint,
            }}
          >
            Gender
          </Text>
          <View style={styles.detailContainer}>
            <User size={24} color="#6c757d" />
            <Text style={styles.detailText}>
              {user?.user?.gender || "Not available"}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={24} color="white" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 2,
    borderColor: Colors.light.tint,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.tint,
  },
  role: {
    fontSize: 16,
    color: "#6c757d",
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.tint,
    padding: 10,
    borderRadius: 25,
    marginTop: 20,
    width: "100%",
    justifyContent: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.light.tint,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#d9534f",
  },
});
