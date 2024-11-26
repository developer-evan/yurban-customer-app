import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const StartScreen = () => {
  const router = useRouter();

  // useEffect(() => {
  //   const checkAuthState = async () => {
  //     try {
  //       const accessToken = await AsyncStorage.getItem("session_token");
  //       const userRole = await AsyncStorage.getItem("user_role");
  //       if (accessToken && userRole === "Customer") {
  //         router.replace("/(tabs)/home"); // Redirect to Home if token and role are valid
  //       }
  //       //  else {
  //       //   router.replace("/(auth)"); // Redirect to Sign In if no token or invalid role
  //       // }
  //     } catch (error) {
  //       console.error("Error checking auth state:", error);
  //     }
  //   };
  //   checkAuthState();
  // }, []);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("session_token");
        if (accessToken) {
          // Decode the token to extract user info
          const decodedToken = jwtDecode(accessToken);

          if (decodedToken.role === "Customer") {
            router.replace("/(tabs)/home"); // Redirect to Home if Customer
          } else {
            console.log("Access denied: Not a Customer");
          }
        } else {
          console.log("No token found. Please sign in.");
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
      }
    };

    checkAuthState();
  }, []);

  const handleLogin = () => {
    router.push("/(auth)/sign-in");
  };

  const handleSignUp = () => {
    router.push("/(auth)/sign-up");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {/* Illustration */}
      <Image
        source={require("../../assets/images/yurban.png")} // Replace with your illustration's path
        style={styles.image}
      />

      {/* Welcome Message */}
      <Text style={styles.title}>Welcome to the Yurban Customer App</Text>
      <Text style={styles.subtitle}>
        Book a ride, track your driver, and enjoy the best ride-hailing
        experience.
      </Text>

      {/* Indicator */}
      <View style={styles.indicatorContainer}>
        <View style={[styles.indicator, styles.activeIndicator]} />
        <View style={styles.indicator} />
        <View style={styles.indicator} />
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>Create an account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  image: {
    width: 400,
    height: 250,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  indicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#000",
  },
  loginButton: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: Colors.light.tint,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpButton: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "transparent",
    borderRadius: 25,
    alignItems: "center",
  },
  signUpButtonText: {
    color: Colors.light.tint,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default StartScreen;
