import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="request/request"
        options={{ headerShown: true, title: "Request Ride" }}
      />
    </Stack>
  );
}
