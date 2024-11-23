import { router, Tabs } from "expo-router";
import React from "react";
import { Platform, View, Image, TouchableOpacity } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getUserProfile } from "@/services/getProfile";
import { useQuery } from "@tanstack/react-query";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
  });

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {
            // Use a solid background on Android to prevent rendering issues
            // backgroundColor: Colors[colorScheme ?? "light"].background,
            // marginHorizontal: 10,
            // borderRadius: 25,
            // marginBottom: 10,
            // padding: 5,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: true,
          title: "Home",
          headerRight: () => (
            // <IconSymbol size={28} name="house.fill" color="#000" />
            <TouchableOpacity
              onPress={() => {
                router.push("/(tabs)/profile/profile");
              }}
            >
              <Image
                source={{ uri: user?.user?.profilePicture }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  marginRight: 20,
                  borderColor: "#fff",
                  borderWidth: 2,
                }}
              />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-rides"
        options={{
          headerShown: true,
          title: "My Rides",
          headerRight: () => (
            // <IconSymbol size={28} name="house.fill" color="#000" />
            <TouchableOpacity
              onPress={() => {
                router.push("/(tabs)/profile/profile");
              }}
            >
              <Image
                source={{ uri: user?.user?.profilePicture }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  marginRight: 20,
                  borderColor: "#fff",
                  borderWidth: 2,
                }}
              />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="car.fill" color={color} />
          ),
        }}
      />
      {/* profile  */}
      <Tabs.Screen
        name="profile/profile"
        options={{
          headerShown: true,
          title: "Profile",
          headerRight: () => (
            // <IconSymbol size={28} name="house.fill" color="#000" />
            <TouchableOpacity
              onPress={() => {
                router.push("/(tabs)/profile/profile");
              }}
            >
              <Image
                source={{ uri: user?.user?.profilePicture }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  marginRight: 20,
                  borderColor: "#fff",
                  borderWidth: 2,
                }}
              />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color }) => (
            // <IconSymbol size={28} name="person" color={color} />
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
