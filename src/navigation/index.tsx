import React, { useState } from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/Home';
import { ChartsScreen } from '../screens/Charts';
import { GoalsScreen } from '../screens/Goals';
import { StatisticsScreen } from '../screens/Statistics';
import { COLORS } from '../constants/colors';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { useFinance } from '../context/FinanceContext';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
    const { addTransaction } = useFinance();
    const [modalVisible, setModalVisible] = useState(false);
    const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');

    const handleAddIncome = () => {
        setTransactionType('income');
        setModalVisible(true);
    };

    const handleAddExpense = () => {
        setTransactionType('expense');
        setModalVisible(true);
    };

    return (
        <>
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
                            <Ionicons name="pie-chart" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Placeholder"
                    component={View}
                    options={{
                        tabBarLabel: '',
                        tabBarIcon: () => <View style={{ width: 60 }} />,
                    }}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                        },
                    }}
                />

                <Tab.Screen
                    name="Statistics"
                    component={StatisticsScreen}
                    options={{
                        tabBarLabel: 'Estatísticas',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="trending-up" size={size} color={color} />
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

            <FloatingActionButton
                onAddIncome={handleAddIncome}
                onAddExpense={handleAddExpense}
            />

            <AddTransactionModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onAdd={(name: string, value: number, type: 'income' | 'expense') => {
                    addTransaction(name, value, type);
                    setModalVisible(false);
                }}
                initialType={transactionType}
            />
        </>
    );
};


