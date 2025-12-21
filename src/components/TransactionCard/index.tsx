import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Transaction } from '../../types';
import { styles } from './styles';

interface TransactionCardProps {
    transaction: Transaction;
    onRemove: (id: string) => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onRemove }) => {
    const handleRemove = () => {
        Alert.alert(
            'Remover transação',
            `Deseja remover "${transaction.name}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: () => onRemove(transaction.id),
                },
            ]
        );
    };

    const isIncome = transaction.type === 'income';
    const valueColor = isIncome ? COLORS.accent : COLORS.primaryDark;
    const icon = isIncome ? 'arrow-up-circle' : 'arrow-down-circle';

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={28} color={valueColor} />
            </View>

            <View style={styles.content}>
                <Text style={styles.name}>{transaction.name}</Text>
                <Text style={styles.date}>
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                </Text>
            </View>

            <View style={styles.rightContent}>
                <Text style={[styles.value, { color: valueColor }]}>
                    {isIncome ? '+' : '-'} R$ {transaction.value.toFixed(2)}
                </Text>
                <TouchableOpacity onPress={handleRemove} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={20} color={COLORS.primaryDark} />
                </TouchableOpacity>
            </View>
        </View>
    );
};
