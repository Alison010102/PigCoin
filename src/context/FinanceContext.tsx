import React, { createContext, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Goal, FinanceContextData, Installment } from '../types';

const FinanceContext = createContext<FinanceContextData>({} as FinanceContextData);

interface FinanceProviderProps {
    children: ReactNode;
}

export const FinanceProvider: React.FC<FinanceProviderProps> = ({ children }) => {
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    const [goals, setGoals] = React.useState<Goal[]>([]);

    React.useEffect(() => {
        loadData();
    }, []);

    React.useEffect(() => {
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

    const createGoal = (name: string, totalValue: number, type: 'grid' | 'fixed', installmentValue?: number) => {
        let installments: Installment[] = [];
        let currentValue = 0;

        if (type === 'grid') {
            const n = Math.floor(Math.sqrt(2 * totalValue));

            installments = Array.from({ length: n }, (_, i) => ({
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
        } else if (type === 'fixed' && installmentValue && installmentValue > 0) {
            const count = Math.floor(totalValue / installmentValue);
            installments = Array.from({ length: count }, (_, i) => ({
                number: i + 1,
                value: installmentValue,
                paid: false,
            }));

            const remaining = totalValue % installmentValue;
            if (remaining > 0.01) { // Lidar com imprecisões de float
                installments.push({
                    number: count + 1,
                    value: Number(remaining.toFixed(2)),
                    paid: false,
                });
            }
        }

        const newGoal: Goal = {
            id: Date.now().toString(),
            name,
            totalValue,
            currentValue,
            type,
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
                        return { ...inst, paid: !inst.paid };
                    }
                    return inst;
                });

                const newCurrentValue = updatedInstallments
                    .filter(i => i.paid)
                    .reduce((sum, i) => sum + i.value, 0);

                return {
                    ...goal,
                    installments: updatedInstallments,
                    currentValue: newCurrentValue
                };
            }
            return goal;
        }));
    };

    const addProgress = (goalId: string, value: number) => {
        setGoals(prev => prev.map(goal => {
            if (goal.id === goalId) {
                const newCurrentValue = Math.min(goal.currentValue + value, goal.totalValue);

                const nextNumber = goal.installments.length + 1;
                const newInstallment: Installment = {
                    number: nextNumber,
                    value: value,
                    paid: true
                };

                return {
                    ...goal,
                    currentValue: newCurrentValue,
                    installments: [...goal.installments, newInstallment]
                };
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
                addProgress,
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
