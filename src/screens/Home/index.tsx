import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PigLogo } from '../../components/PigLogo';
import { TransactionCard } from '../../components/TransactionCard';
import { AddTransactionModal } from '../../components/AddTransactionModal';
import { useFinance } from '../../context/FinanceContext';
import { COLORS } from '../../constants/colors';
import { styles } from './styles';

export const HomeScreen = ({ navigation }: any) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { transactions, addTransaction, removeTransaction, getTotalBalance } =
        useFinance();

    const balance = getTotalBalance();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            <View style={styles.header}>
                <PigLogo size={80} />
                <Text style={styles.appName}>PigCoin</Text>
            </View>

            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Saldo Total</Text>
                <Text style={[styles.balanceValue, { color: balance >= 0 ? COLORS.accent : COLORS.primaryDark }]}>
                    R$ {Math.abs(balance).toFixed(2)}
                </Text>
                {balance < 0 && (
                    <Text style={styles.negativeLabel}>Você está no negativo!</Text>
                )}
            </View>

            <TouchableOpacity
                style={styles.chartsButton}
                onPress={() => navigation.navigate('Charts')}
            >
                <Ionicons name="bar-chart" size={24} color={COLORS.white} />
                <Text style={styles.chartsButtonText}>Ver Gráficos</Text>
            </TouchableOpacity>

            <View style={styles.transactionsContainer}>
                <Text style={styles.sectionTitle}>Transações Recentes</Text>
                {transactions.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="wallet-outline" size={64} color={COLORS.primary} />
                        <Text style={styles.emptyText}>Nenhuma transação ainda</Text>
                        <Text style={styles.emptySubtext}>
                            Ex: 'Depositei 20' ou 'Paguei a Luz'
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={transactions}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TransactionCard
                                transaction={item}
                                onRemove={removeTransaction}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add" size={32} color={COLORS.white} />
            </TouchableOpacity>

            <AddTransactionModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onAdd={addTransaction}
            />
        </View>
    );
};
