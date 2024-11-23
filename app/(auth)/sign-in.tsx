import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Text,
  Alert,
  TouchableOpacity,
  ToastAndroid,
  Image,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
// import Toast, { ToastContainer } from "react-native-root-toast";
import { axiosInstance } from "@/lib/axiosInstance";
import config from "@/lib/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decodeAuthToken } from "@/lib/decodeToken";

// const API_URL = "http://192.168.100.114:8000/api/auth/login";

export default function App() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!phoneNumber || !pin) {
      // Alert.alert("Error", "Please enter both phone number and pin.");
      ToastAndroid.show(
        "Please enter both phone number and pin.",
        ToastAndroid.SHORT
      );

      return;
    }

    try {
      const response = await axiosInstance.post(`${config.apiUrl}/auth/login`, {
        phoneNumber,
        pin,
      });

      const { message, token, role } = response.data;
      console.log("response", response.data);
      await AsyncStorage.setItem("session_token", token);
      decodeAuthToken(token);

      // Check if the role is 'Driver'
      if (role === "Customer") {
        // Redirect to the driver dashboard or next screen
        // Alert.alert("Login Success", "Welcome Driver!", [
        //   { text: "OK", onPress: () => console.log("Driver logged in") },
        // ]);
        ToastAndroid.show("Welcome Customer!", ToastAndroid.SHORT);

        router.push("/(tabs)/home");
        // Save token or navigate to the next screen if necessary
      } else {
        // Alert.alert("Error", "Only drivers can log in.");
        ToastAndroid.show("Only customers can log in.", ToastAndroid.SHORT);
      }
    } catch (error) {
      // Alert.alert("Error", "Invalid credentials or server issue.");
      // console.error(error);
      ToastAndroid.show(
        "Invalid credentials or server issue.",
        ToastAndroid.SHORT
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/yurbann.png")}
        style={{
          width: 90,
          height: 90,
          marginBottom: 20,
          // borderRadius: "100%",
          // alignSelf: "center",
          // backgroundColor: "#f8f9fa",
          // padding: 20,
        }}
      />

      <View style={styles.title}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            // marginBottom: 20,
            textAlign: "left",
          }}
        >
          Login
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#888",
            textAlign: "left",
          }}
        >
          Sign in to your account
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="PIN"
        keyboardType="numeric"
        secureTextEntry
        value={pin}
        onChangeText={setPin}
      />
      {/* forget passweord  */}
      <Text
        style={{
          fontSize: 14,
          color: Colors.light.tint,
          textAlign: "right",
          marginBottom: 20,
        }}
      >
        Forget Password?
      </Text>

      {/* <Button title="Login" onPress={handleLogin} /> */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <Text style={styles.footer}>
        Don't have an account?{" "}
        <Text
          style={styles.link}
          onPress={() => router.push("/(auth)/sign-up")}
        >
          Sign Up
        </Text>
      </Text>

      {/* <Text style={styles.footer}>Only drivers can login.</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
  },
  footer: {
    marginTop: 20,
    fontSize: 14,
    color: "#888",
  },
  button: {
    // backgroundColor: Colors.light.tint,
    // padding: 12,
    // borderRadius: 10,
    // width: "100%",
    // alignItems: "center",
    // backgroundColor: "#007AFF",
    width: "100%",
    paddingVertical: 15,
    backgroundColor: Colors.light.tint,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    color: Colors.light.tint,
  },
});
