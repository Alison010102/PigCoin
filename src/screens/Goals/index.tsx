import React from 'react';
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
    ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { GoalCard } from '../../components/GoalCard';
import { useFinance } from '../../context/FinanceContext';
import { COLORS } from '../../constants/colors';
import { styles } from './styles';

export const GoalsScreen = () => {
    const { goals, createGoal, toggleInstallment, deleteGoal } = useFinance();
    const [modalVisible, setModalVisible] = React.useState(false);
    const [goalName, setGoalName] = React.useState('');
    const [goalValue, setGoalValue] = React.useState('');
    const [installmentValue, setInstallmentValue] = React.useState('');
    const [goalType, setGoalType] = React.useState<'grid' | 'fixed'>('grid');

    const handleCreateGoal = () => {
        if (!goalName.trim() || !goalValue.trim() || (goalType === 'fixed' && !installmentValue.trim())) {
            Alert.alert('Erro', 'Preencha todos os campos da meta');
            return;
        }

        const value = parseFloat(goalValue.replace(',', '.'));
        const instValue = installmentValue ? parseFloat(installmentValue.replace(',', '.')) : 0;

        if (isNaN(value) || value <= 0 || (goalType === 'fixed' && (isNaN(instValue) || instValue <= 0))) {
            Alert.alert('Erro', 'Insira valores válidos');
            return;
        }

        createGoal(goalName.trim(), value, goalType, instValue);
        setGoalName('');
        setGoalValue('');
        setInstallmentValue('');
        setGoalType('grid');
        setModalVisible(false);
    };

    const handleCancel = () => {
        setGoalName('');
        setGoalValue('');
        setInstallmentValue('');
        setGoalType('grid');
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            <View style={styles.header}>
                <Text style={styles.title}>🎯 Metas</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Ionicons name="add" size={28} color={COLORS.secondary} />
                </TouchableOpacity>
            </View>

            {goals.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>🏆</Text>
                    <Text style={styles.emptyText}>Crie seu primeiro desafio!</Text>
                    <Text style={styles.emptySubtext}>
                        Escolha entre o Grid Progressivo ou Meta Fixa.
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
                                <Ionicons name="close" size={28} color={COLORS.secondary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Tipo de Meta</Text>
                                <View style={styles.typeContainer}>
                                    <TouchableOpacity
                                        style={[styles.typeButton, goalType === 'grid' && styles.typeButtonActive]}
                                        onPress={() => setGoalType('grid')}
                                    >
                                        <Ionicons name="grid" size={24} color={goalType === 'grid' ? COLORS.secondary : COLORS.textDim} />
                                        <Text style={[styles.typeButtonText, goalType === 'grid' && styles.typeButtonTextActive]}>Meta Grid</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.typeButton, goalType === 'fixed' && styles.typeButtonActive]}
                                        onPress={() => setGoalType('fixed')}
                                    >
                                        <Ionicons name="flag" size={24} color={goalType === 'fixed' ? COLORS.secondary : COLORS.textDim} />
                                        <Text style={[styles.typeButtonText, goalType === 'fixed' && styles.typeButtonTextActive]}>Meta Fixa</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>O que quer conquistar?</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ex: Reserva, Carro, Viagem..."
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
                                    {goalType === 'grid'
                                        ? 'O PigCoin criará um grid de valores incrementais até atingir este valor.'
                                        : 'Define um valor alvo fixo para você ir guardando aos poucos.'}
                                </Text>
                            </View>

                            {goalType === 'fixed' && (
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Valor por Carrinho/Box (R$)</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="ex: 100"
                                        placeholderTextColor={COLORS.textDim}
                                        value={installmentValue}
                                        onChangeText={setInstallmentValue}
                                        keyboardType="decimal-pad"
                                    />
                                    <Text style={styles.hint}>
                                        O PigCoin criará vários quadradinhos com este valor fixo.
                                    </Text>
                                </View>
                            )}

                            <TouchableOpacity
                                style={styles.createButton}
                                onPress={handleCreateGoal}
                            >
                                <Text style={styles.createButtonText}>Iniciar Desafio</Text>
                            </TouchableOpacity>
                        </ScrollView>

                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};
