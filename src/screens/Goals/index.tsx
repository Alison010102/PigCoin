import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GoalCard } from '../../components/GoalCard';
import { useFinance } from '../../context/FinanceContext';
import { COLORS } from '../../constants/colors';
import { styles } from './styles';

export const GoalsScreen = () => {
    const { goals, createGoal, toggleInstallment, deleteGoal } = useFinance();
    const [modalVisible, setModalVisible] = useState(false);
    const [goalName, setGoalName] = useState('');
    const [goalValue, setGoalValue] = useState('');

    const handleCreateGoal = () => {
        if (!goalName.trim() || !goalValue.trim()) {
            Alert.alert('Erro', 'Preencha o nome e o valor da meta');
            return;
        }

        const value = parseFloat(goalValue.replace(',', '.'));

        if (isNaN(value) || value <= 0) {
            Alert.alert('Erro', 'Insira um valor válido');
            return;
        }

        createGoal(goalName.trim(), value);
        setGoalName('');
        setGoalValue('');
        setModalVisible(false);
    };

    const handleCancel = () => {
        setGoalName('');
        setGoalValue('');
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

            <View style={styles.header}>
                <Text style={styles.title}>🎯 Metas</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Ionicons name="add" size={28} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            {goals.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>🏆</Text>
                    <Text style={styles.emptyText}>Crie seu primeiro desafio!</Text>
                    <Text style={styles.emptySubtext}>
                        Defina um valor e complete o grid numerado.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={goals}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <GoalCard
                            goal={item}
                            onToggleInstallment={(installmentNumber, value) =>
                                toggleInstallment(item.id, installmentNumber, value)
                            }
                            onDelete={() => deleteGoal(item.id)}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={handleCancel}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <TouchableOpacity
                        style={styles.backdrop}
                        activeOpacity={1}
                        onPress={handleCancel}
                    />
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Novo Desafio</Text>
                            <TouchableOpacity onPress={handleCancel}>
                                <Ionicons name="close" size={28} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalContent}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>O que quer conquistar?</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ex: Luz, Aluguel, Viagem..."
                                    placeholderTextColor={COLORS.textDim}
                                    value={goalName}
                                    onChangeText={setGoalName}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Valor do Desafio (R$)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="ex: 20000"
                                    placeholderTextColor={COLORS.textDim}
                                    value={goalValue}
                                    onChangeText={setGoalValue}
                                    keyboardType="decimal-pad"
                                />
                                <Text style={styles.hint}>
                                    O PigCoin criará automaticamente um grid de
                                    valores incrementais até atingir este valor.
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.createButton}
                                onPress={handleCreateGoal}
                            >
                                <Text style={styles.createButtonText}>Iniciar Desafio</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};
