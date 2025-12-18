export interface Goal {
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    icon?: string; // Emoji or icon name
}

export type RootStackParamList = {
    Home: undefined;
};
