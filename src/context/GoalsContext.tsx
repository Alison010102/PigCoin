import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Goal } from '../types';

interface GoalsContextData {
    goals: Goal[];
    addGoal: (title: string, targetAmount: number) => Promise<void>;
    updateGoalAmount: (id: string, amount: number) => Promise<void>;
    deleteGoal: (id: string) => Promise<void>;
    calculateTotal: () => { totalCurrent: number; totalTarget: number };
}

const GoalsContext = createContext<GoalsContextData>({} as GoalsContextData);

export const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [goals, setGoals] = useState<Goal[]>([]);

    useEffect(() => {
        loadGoals();
    }, []);

    const loadGoals = async () => {
        try {
            const storedGoals = await AsyncStorage.getItem('@PigCoin:goals');
            if (storedGoals) {
                setGoals(JSON.parse(storedGoals));
            }
        } catch (e) {
            console.error("Failed to load goals", e);
        }
    };

    const saveGoals = async (newGoals: Goal[]) => {
        try {
            await AsyncStorage.setItem('@PigCoin:goals', JSON.stringify(newGoals));
            setGoals(newGoals);
        } catch (e) {
            console.error("Failed to save goals", e);
        }
    };

    const addGoal = async (title: string, targetAmount: number) => {
        const newGoal: Goal = {
            id: Date.now().toString(),
            title,
            targetAmount,
            currentAmount: 0,
        };
        const newGoals = [...goals, newGoal];
        await saveGoals(newGoals);
    };

    const updateGoalAmount = async (id: string, amount: number) => {
        const newGoals = goals.map(goal => {
            if (goal.id === id) {
                const newAmount = goal.currentAmount + amount;
                return { ...goal, currentAmount: newAmount < 0 ? 0 : newAmount };
            }
            return goal;
        });
        await saveGoals(newGoals);
    };

    const deleteGoal = async (id: string) => {
        const newGoals = goals.filter(goal => goal.id !== id);
        await saveGoals(newGoals);
    };

    const calculateTotal = () => {
        const totalCurrent = goals.reduce((acc, goal) => acc + goal.currentAmount, 0);
        const totalTarget = goals.reduce((acc, goal) => acc + goal.targetAmount, 0);
        return { totalCurrent, totalTarget };
    };

    return (
        <GoalsContext.Provider value={{ goals, addGoal, updateGoalAmount, deleteGoal, calculateTotal }}>
            {children}
        </GoalsContext.Provider>
    );
};

export const useGoals = () => useContext(GoalsContext);
