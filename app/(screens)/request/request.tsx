import {
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import { requestRide } from "@/services/requestRide";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { getUsers } from "@/services/getUsers";
import { Colors } from "@/constants/Colors";

const Request = () => {
  const queryClient = useQueryClient();

  // Form state
  const [form, setForm] = useState({
    driverId: "",
    pickupLocation: "",
    passengerNumber: "",
    dropoffLocation: "",
  });

  // Fetch drivers
  const { data: users, isLoading: isDriversLoading } = useQuery({
    queryKey: ["driver"],
    queryFn: getUsers,
  });

  // Mutation setup
  const mutation = useMutation({
    mutationFn: async () => {
      console.log("Submitting form:", form);
      return requestRide(form); // Pass form data to requestRide
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ride"] });
      ToastAndroid.show("Ride requested successfully", ToastAndroid.LONG);
      router.push("/(tabs)/my-rides");
    },
    onError: (error) => {
      ToastAndroid.show("Failed to request ride", ToastAndroid.LONG);
      console.error("Failed to request ride:", error);
    },
  });

  // Form submission handler
  const handleSubmit = () => {
    // Validate all fields
    if (
      !form.driverId ||
      !form.pickupLocation.trim() ||
      !form.passengerNumber.trim() ||
      !form.dropoffLocation.trim()
    ) {
      ToastAndroid.show("Please fill in all fields", ToastAndroid.SHORT);
      console.error("Form validation failed:", form);
      return;
    }

    // Validate numeric input
    if (isNaN(Number(form.passengerNumber)) || +form.passengerNumber <= 0) {
      ToastAndroid.show(
        "Passenger number must be a valid number",
        ToastAndroid.SHORT
      );
      return;
    }

    mutation.mutate(); // Trigger mutation
  };

  // Filter and map driver data
  const availableDrivers =
    users?.filter(
      (user: { role: string; status: string }) =>
        user.role === "Driver" && user.status === "Online"
    ) || [];

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Request a Ride</Text> */}

      {/* Driver Dropdown */}
      {/* card  */}

      <View
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 12,
          padding: 20,
          width: "100%",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        {isDriversLoading ? (
          <ActivityIndicator size="small" color={Colors.light.tint} />
        ) : availableDrivers.length === 0 ? (
          <Text style={styles.noDriversText}>
            No drivers are currently online.
          </Text>
        ) : (
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(value) => setForm({ ...form, driverId: value })}
              items={availableDrivers.map(
                (driver: { firstName: any; lastName: any; _id: any }) => ({
                  label: `${driver.firstName} ${driver.lastName}`,
                  value: driver._id,
                })
              )}
              placeholder={{
                label: "Select a driver",
                value: null,
              }}
              style={pickerStyles}
              value={form.driverId}
            />
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Pickup Location"
          value={form.pickupLocation}
          onChangeText={(text) => setForm({ ...form, pickupLocation: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Passenger Number"
          keyboardType="numeric"
          value={form.passengerNumber}
          onChangeText={(text) => setForm({ ...form, passengerNumber: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Dropoff Location"
          value={form.dropoffLocation}
          onChangeText={(text) => setForm({ ...form, dropoffLocation: text })}
        />

        <TouchableOpacity
          style={[styles.button, mutation.isPending && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={mutation.isPending}
        >
          <Text style={styles.buttonText}>
            {mutation.isPending ? "Submitting..." : "Submit"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Request;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // alignItems: "center",
    backgroundColor: "#fff", // Light neutral background
  },
  title: {
    fontSize: 16,
    // fontWeight: "600",
    color: Colors.light.tint,
    marginBottom: 5,
    textAlign: "left",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#FFF",
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Adds shadow on Android
  },
  noDriversText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
  },
  pickerContainer: {
    width: "100%",
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    color: "#333",
    borderRadius: 10,
    justifyContent: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 15,
    marginBottom: 15,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.light.tint,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#BDBDBD", // Muted gray for disabled state
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
});

const pickerStyles = {
  inputIOS: {
    color: "#333",
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    // backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputAndroid: {
    color: "#333",
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    // backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
};
