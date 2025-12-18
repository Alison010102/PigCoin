import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useGoals } from '../context/GoalsContext';
import { GoalCard } from '../components/GoalCard';
import { DashboardChart } from '../components/DashboardChart';
import { TransactionModal } from '../components/TransactionModal';
import { colors } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

export const HomeScreen: React.FC = () => {
    const { goals, addGoal, deleteGoal, updateGoalAmount, calculateTotal } = useGoals();
    const [newGoalTitle, setNewGoalTitle] = useState('');
    const [newGoalAmount, setNewGoalAmount] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
    const { totalCurrent, totalTarget } = calculateTotal();

    const selectedGoal = goals.find(g => g.id === selectedGoalId);

    const handleCreateGoal = async () => {
        if (!newGoalTitle || !newGoalAmount) {
            Alert.alert('Erro', 'Preencha o nome e o valor do objetivo!');
            return;
        }
        const amount = parseFloat(newGoalAmount.replace(',', '.'));
        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Erro', 'Valor inválido!');
            return;
        }
        await addGoal(newGoalTitle, amount);
        setNewGoalTitle('');
        setNewGoalAmount('');
    };

    const handleCardPress = (goalId: string) => {
        setSelectedGoalId(goalId);
        setModalVisible(true);
    };

    const handleDeposit = (amount: number) => {
        if (selectedGoalId) {
            updateGoalAmount(selectedGoalId, amount);
        }
    };

    const handleWithdraw = (amount: number) => {
        if (selectedGoalId) {
            updateGoalAmount(selectedGoalId, -amount);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={[colors.palette[10], colors.palette[6]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerBackground}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.greeting}>Olá, Investidor! 👋</Text>
                    <Text style={styles.totalLabel}>Patrimônio Total</Text>
                    <Text style={styles.totalValue}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCurrent)}
                    </Text>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.chartSection}>
                    <DashboardChart goals={goals} />
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>💰 Seus Objetivos</Text>
                </View>

                {goals.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>Crie sua primeira caixinha abaixo!</Text>
                    </View>
                ) : (
                    goals.map((goal, index) => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            index={index}
                            onPress={() => handleCardPress(goal.id)}
                            onAdd={() => handleDeposit(50)}
                            onRemove={() => handleWithdraw(50)}
                        />
                    ))
                )}

                <TransactionModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onDeposit={handleDeposit}
                    onWithdraw={handleWithdraw}
                    goalTitle={selectedGoal?.title || ''}
                    currentAmount={selectedGoal?.currentAmount || 0}
                />

                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>✨ Nova Caixinha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome (ex: Casa Própria)"
                        placeholderTextColor="#999"
                        value={newGoalTitle}
                        onChangeText={setNewGoalTitle}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Valor Meta (ex: 200000)"
                        placeholderTextColor="#999"
                        value={newGoalAmount}
                        onChangeText={setNewGoalAmount}
                        keyboardType="numeric"
                    />
                    <TouchableOpacity style={styles.createButton} onPress={handleCreateGoal}>
                        <LinearGradient
                            colors={[colors.palette[8], colors.palette[6]]}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.createButtonText}>CRIAR</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    headerBackground: {
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        alignItems: 'center',
    },
    greeting: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
        marginBottom: 8,
    },
    totalLabel: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        opacity: 0.9,
    },
    totalValue: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold',
        marginTop: 4,
    },
    scrollContainer: {
        marginTop: -30,
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    chartSection: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
        fontSize: 16,
    },
    formCard: {
        marginTop: 10,
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        fontSize: 16,
        color: colors.text,
    },
    createButton: {
        width: '100%',
        shadowColor: colors.palette[6],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    gradientButton: {
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    createButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});
