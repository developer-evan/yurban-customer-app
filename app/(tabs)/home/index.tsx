import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile } from "@/services/getProfile";
import { updateDriverStatus } from "@/services/updateDriverStatus";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

export default function HomeScreen() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      setLoading(false);
    })();
  }, []);

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
  });

  if (loading || userLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location ? location.latitude : 0,
            longitude: location ? location.longitude : 0,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          {location && <Marker coordinate={location} title="Your Location" />}
        </MapView>
      </View>

      <View style={styles.statusContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            {
              backgroundColor: Colors.light.tint,
            },
          ]}
          // onPress={toggleStatus}
          onPress={() => router.push("/(screens)/request/request" as any)}
        >
          <Text style={styles.toggleButtonText}>Request a Ride</Text>
          <ArrowRightCircle
            size={24}
            color="white"
            style={{ position: "absolute", right: 20, top: 10 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  statusContainer: {
    alignItems: "center",
    paddingVertical: 15,
    // backgroundColor: "#1a1a1a",
    // transparent and opacity
    backgroundColor: "rgba(26, 26, 26, 0.7)",
    // position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  statusText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginBottom: 5,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  toggleButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
