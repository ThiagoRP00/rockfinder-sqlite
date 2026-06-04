import { MetalMania_400Regular, useFonts } from "@expo-google-fonts/metal-mania";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function TabsLayout() {
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
      <Tabs screenOptions={{
        tabBarActiveTintColor: "#E50914",
        tabBarInactiveTintColor: "#B3B3B3",
        tabBarStyle: { backgroundColor: "#1A1A1A", height: 80 },

      }}>
        <Tabs.Screen name="index"
          options={{
            headerShown: false,
            tabBarLabel: "Pesquisar",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="search-sharp"
                size={size}
                color={color}
              />
            ),
          }} />
        <Tabs.Screen name="addEvent"
          options={{
            headerShown: false,
            tabBarLabel: "Adicionar Evento",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="add-sharp"
                size={size}
                color={color}
              />
            ),
          }} />
      </Tabs>
    </React.Fragment>
  );
}

