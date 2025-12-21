import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/Home';
import { ChartsScreen } from '../screens/Charts';
import { GoalsScreen } from '../screens/Goals';
import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: COLORS.surface,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.lightGray,
                    elevation: 10,
                    height: 80,
                    paddingBottom: 25,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: COLORS.secondary,
                tabBarInactiveTintColor: COLORS.textDim,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Início',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="wallet" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Charts"
                component={ChartsScreen}
                options={{
                    tabBarLabel: 'Gráficos',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="bar-chart" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Goals"
                component={GoalsScreen}
                options={{
                    tabBarLabel: 'Metas',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="flag" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};
