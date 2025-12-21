import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Goal } from '../../types';
import { styles } from './styles';

interface GoalCardProps {
    goal: Goal;
    onToggleInstallment: (installmentNumber: number, value: number) => void;
    onDelete: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
    goal,
    onToggleInstallment,
    onDelete,
}) => {
    const paidInstallments = goal.installments.filter(i => i.paid).length;
    const totalInstallments = goal.installments.length;
    const paidAmount = goal.installments
        .filter(i => i.paid)
        .reduce((sum, i) => sum + i.value, 0);
    const progress = (paidAmount / goal.totalValue) * 100;
    const isCompleted = progress >= 100;

    const handleToggle = (number: number, value: number) => {
        const wasCompleted = isCompleted;
        onToggleInstallment(number, value);

        if (!wasCompleted && (paidAmount + value) >= goal.totalValue && !goal.installments.find(i => i.number === number)?.paid) {
            Alert.alert(
                '🎉 PARABÉNS!',
                `Você concluiu o desafio "${goal.name}"! Continue economizando! 🐷`,
                [{ text: 'Uhul!' }]
            );
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Excluir Desafio',
            `Deseja excluir o desafio "${goal.name}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: onDelete,
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <Text style={styles.goalValue}>
                        Alvo: R$ {goal.totalValue.toFixed(2)}
                    </Text>
                </View>
                <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={22} color={COLORS.danger} />
                </TouchableOpacity>
            </View>

            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${Math.min(progress, 100)}%` },
                        ]}
                    />
                </View>
                <View style={styles.progressRow}>
                    <Text style={styles.progressText}>
                        {paidInstallments}/{totalInstallments} itens pagos
                    </Text>
                    <Text style={styles.progressPercentage}>
                        {progress.toFixed(1)}%
                    </Text>
                </View>
                <Text style={styles.progressAmount}>
                    Acumulado: R$ {paidAmount.toFixed(2)}
                </Text>
            </View>

            <Text style={styles.installmentsTitle}>Grid do Desafio (R$):</Text>
            <ScrollView
                style={styles.installmentsScroll}
                contentContainerStyle={styles.installmentsGrid}
                nestedScrollEnabled
            >
                {goal.installments.map((installment) => {
                    return (
                        <TouchableOpacity
                            key={installment.number}
                            style={[
                                styles.installment,
                                installment.paid && styles.installmentPaid,
                            ]}
                            onPress={() =>
                                handleToggle(installment.number, installment.value)
                            }
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.installmentNumber,
                                    installment.paid && styles.installmentNumberPaid,
                                ]}
                            >
                                {installment.value}
                            </Text>
                            {installment.paid && (
                                <View style={styles.checkmark}>
                                    <Ionicons name="checkmark" size={10} color={COLORS.white} />
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={styles.legend}>
                {progress >= 100 ? (
                    <View style={styles.celebrationContainer}>
                        <Ionicons name="trophy" size={20} color={COLORS.primary} />
                        <Text style={styles.celebrationText}>
                            Parabéns! Você concluiu este desafio! 🥳
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.legendText}>
                        💡 Toque nos valores acima para marcar como "pago"
                    </Text>
                )}
            </View>
        </View>
    );
};
