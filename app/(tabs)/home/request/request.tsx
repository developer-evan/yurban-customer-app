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
      <Text style={styles.title}>Request a Ride</Text>

      {/* Driver Dropdown */}
      {isDriversLoading ? (
        <ActivityIndicator size="small" color={Colors.light.tint} />
      ) : availableDrivers.length === 0 ? (
        <Text style={styles.noDriversText}>
          No drivers are currently online.
        </Text>
      ) : (
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
  );
};

export default Request;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  noDriversText: {
    fontSize: 16,
    color: "#888",
    marginBottom: 15,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.light.tint,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

const pickerStyles = {
  inputIOS: {
    height: 50,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: "black",
  },
  inputAndroid: {
    height: 50,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: "black",
  },
};
