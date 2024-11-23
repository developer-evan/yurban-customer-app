import { View, Text, SafeAreaView} from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

const AuthLayout = () => {
  return (
    <SafeAreaView style={{flex:1, marginTop:Constants.statusBarHeight}}>
    {/* <SafeAreaView style={{flex:1, marginTop:StatusBar.currentHeight}}> */}
    
      <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
            title: "Login",
            headerBackVisible: false,
            headerStyle: {
              // backgroundColor: Colors.light.tint,
            },
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
            title: "Register",
            headerBackVisible: false,
            // headerRight: () => (
            //   <Link href="/(auth)/sign-in">
            //     <Text
            //       style={{
            //         color: Colors.light.tint,
            //         fontSize: 18,
            //         marginRight: 10,
            //       }}
            //     >
            //       Sign In
            //     </Text>
            //   </Link>
            // ),
          }}
        />
      </Stack>
      {/* <StatusBar backgroundColor="#161622" barStyle="light-content" /> */}
      </SafeAreaView>
  );
};

export default AuthLayout;
