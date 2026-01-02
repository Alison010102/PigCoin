

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
    currentValue: number;
    type: 'grid' | 'fixed';
    installments: Installment[];
    createdAt: Date;
}

export interface FinanceContextData {
    transactions: Transaction[];
    goals: Goal[];
    addTransaction: (name: string, value: number, type: 'expense' | 'income') => void;
    removeTransaction: (id: string) => void;
    getTotalBalance: () => number;
    createGoal: (name: string, totalValue: number, type: 'grid' | 'fixed', installmentValue?: number) => void;
    toggleInstallment: (goalId: string, installmentNumber: number, value: number) => void;
    addProgress: (goalId: string, value: number) => void;
    deleteGoal: (goalId: string) => void;
}
