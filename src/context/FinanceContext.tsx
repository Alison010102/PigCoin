import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Goal, FinanceContextData, Installment } from '../types';

const FinanceContext = createContext<FinanceContextData>({} as FinanceContextData);

interface FinanceProviderProps {
    children: ReactNode;
}

export const FinanceProvider: React.FC<FinanceProviderProps> = ({ children }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        saveData();
    }, [transactions, goals]);

    const loadData = async () => {
        try {
            const transactionsData = await AsyncStorage.getItem('@pigcoin_transactions');
            const goalsData = await AsyncStorage.getItem('@pigcoin_goals');

            if (transactionsData) {
                const parsed = JSON.parse(transactionsData);
                const transactionsWithDates = parsed.map((t: any) => ({
                    ...t,
                    date: new Date(t.date)
                }));
                setTransactions(transactionsWithDates);
            }

            if (goalsData) {
                const parsed = JSON.parse(goalsData);
                const goalsWithDates = parsed.map((g: any) => ({
                    ...g,
                    createdAt: new Date(g.createdAt)
                }));
                setGoals(goalsWithDates);
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    };

    const saveData = async () => {
        try {
            await AsyncStorage.setItem('@pigcoin_transactions', JSON.stringify(transactions));
            await AsyncStorage.setItem('@pigcoin_goals', JSON.stringify(goals));
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
        }
    };

    const addTransaction = (name: string, value: number, type: 'expense' | 'income') => {
        const newTransaction: Transaction = {
            id: Date.now().toString(),
            name,
            value,
            type,
            date: new Date(),
        };
        setTransactions(prev => [newTransaction, ...prev]);
    };

    const removeTransaction = (id: string) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    const getTotalBalance = () => {
        return transactions.reduce((total, transaction) => {
            return transaction.type === 'income'
                ? total + transaction.value
                : total - transaction.value;
        }, 0);
    };

    const createGoal = (name: string, totalValue: number) => {
        const n = Math.floor(Math.sqrt(2 * totalValue));

        const installments: Installment[] = Array.from({ length: n }, (_, i) => ({
            number: i + 1,
            value: i + 1,
            paid: false,
        }));

        const currentSum = (n * (n + 1)) / 2;
        if (currentSum < totalValue) {
            installments.push({
                number: n + 1,
                value: totalValue - currentSum,
                paid: false,
            });
        }

        const newGoal: Goal = {
            id: Date.now().toString(),
            name,
            totalValue,
            installments,
            createdAt: new Date(),
        };

        setGoals(prev => [newGoal, ...prev]);
    };

    const toggleInstallment = (goalId: string, installmentNumber: number, value: number) => {
        setGoals(prev => prev.map(goal => {
            if (goal.id === goalId) {
                const updatedInstallments = goal.installments.map(inst => {
                    if (inst.number === installmentNumber) {
                        return { ...inst, paid: !inst.paid, value };
                    }
                    return inst;
                });
                return { ...goal, installments: updatedInstallments };
            }
            return goal;
        }));
    };

    const deleteGoal = (goalId: string) => {
        setGoals(prev => prev.filter(g => g.id !== goalId));
    };

    return (
        <FinanceContext.Provider
            value={{
                transactions,
                goals,
                addTransaction,
                removeTransaction,
                getTotalBalance,
                createGoal,
                toggleInstallment,
                deleteGoal,
            }}
        >
            {children}
        </FinanceContext.Provider>
    );
};

export const useFinance = () => {
    const context = useContext(FinanceContext);
    if (!context) {
        throw new Error('useFinance deve ser usado dentro de um FinanceProvider');
    }
    return context;
};
