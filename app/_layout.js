import { MetalMania_400Regular, useFonts } from "@expo-google-fonts/metal-mania";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded, error] = useFonts({
    MetalMania_400Regular,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <React.Fragment>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="event/[id]"
          options={{
            title: "Detalhes do Evento",
            headerStyle: {
              backgroundColor: "#1A1A1A",
            },
            headerTitleStyle: {
              fontFamily: 'MetalMania_400Regular',
              fontSize: 25,
            },
            headerTintColor: "#FFF",
            headerTitleAlign: "center",
          }}
        />
      </Stack>
    </React.Fragment>
  );
}