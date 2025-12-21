// Tipos do PigCoin

export interface Transaction {
    id: string;
    name: string;
    value: number;
    date: Date;
    type: 'expense' | 'income';
}

export interface Installment {
    number: number;
    value: number;
    paid: boolean;
}

export interface Goal {
    id: string;
    name: string;
    totalValue: number;
    installments: Installment[];
    createdAt: Date;
}

export interface FinanceContextData {
    transactions: Transaction[];
    goals: Goal[];
    addTransaction: (name: string, value: number, type: 'expense' | 'income') => void;
    removeTransaction: (id: string) => void;
    getTotalBalance: () => number;
    createGoal: (name: string, totalValue: number) => void;
    toggleInstallment: (goalId: string, installmentNumber: number, value: number) => void;
    deleteGoal: (goalId: string) => void;
}
