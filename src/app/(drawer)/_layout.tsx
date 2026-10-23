import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { CustomDrawerContent } from '@/components/CustomDrawerContent';
import { COLORS } from '@/constants/theme';

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: COLORS.background,
          width: 300,
        },
        swipeEdgeWidth: 80,
      }}>
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Daily Grocery',
          title: 'Daily Grocery',
        }}
      />
      <Drawer.Screen
        name="help"
        options={{
          drawerLabel: 'Order Info & Help',
          title: 'Order Info & Help',
        }}
      />
    </Drawer>
  );
}
