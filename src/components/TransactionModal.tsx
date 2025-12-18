import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TextInput,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

interface TransactionModalProps {
    visible: boolean;
    onClose: () => void;
    onDeposit: (amount: number) => void;
    onWithdraw: (amount: number) => void;
    goalTitle: string;
    currentAmount: number;
}

const { width } = Dimensions.get('window');

export const TransactionModal: React.FC<TransactionModalProps> = ({
    visible,
    onClose,
    onDeposit,
    onWithdraw,
    goalTitle,
    currentAmount,
}) => {
    const [amount, setAmount] = useState('');
    const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');

    const scale = useSharedValue(0);

    React.useEffect(() => {
        if (visible) {
            scale.value = withSpring(1, {
                damping: 15,
                stiffness: 150,
            });
        } else {
            scale.value = withTiming(0, { duration: 200 });
        }
    }, [visible]);

    const animatedModalStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
            opacity: interpolate(scale.value, [0, 1], [0, 1]),
        };
    });

    const handleConfirm = () => {
        const numAmount = parseFloat(amount.replace(',', '.'));
        if (isNaN(numAmount) || numAmount <= 0) {
            alert('Digite um valor válido!');
            return;
        }

        if (activeTab === 'deposit') {
            onDeposit(numAmount);
        } else {
            if (numAmount > currentAmount) {
                alert('Saldo insuficiente!');
                return;
            }
            onWithdraw(numAmount);
        }
        setAmount('');
        onClose();
    };

    const quickAmounts = [50, 100, 200, 500, 1000];

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <Animated.View style={[styles.modalContainer, animatedModalStyle]}>
                    <LinearGradient
                        colors={['#ffffff', '#f8f9fa']}
                        style={styles.modalContent}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{goalTitle}</Text>
                            <Text style={styles.modalSubtitle}>
                                Saldo atual: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentAmount)}
                            </Text>
                        </View>

                        <View style={styles.tabContainer}>
                            <TouchableOpacity
                                style={[styles.tab, activeTab === 'deposit' && styles.activeTab]}
                                onPress={() => setActiveTab('deposit')}
                            >
                                <LinearGradient
                                    colors={activeTab === 'deposit' ? [colors.palette[6], colors.palette[8]] : ['transparent', 'transparent']}
                                    style={styles.tabGradient}
                                >
                                    <Text style={[styles.tabText, activeTab === 'deposit' && styles.activeTabText]}>
                                        💰 Depositar
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.tab, activeTab === 'withdraw' && styles.activeTab]}
                                onPress={() => setActiveTab('withdraw')}
                            >
                                <LinearGradient
                                    colors={activeTab === 'withdraw' ? ['#FF8A8A', '#FF6B6B'] : ['transparent', 'transparent']}
                                    style={styles.tabGradient}
                                >
                                    <Text style={[styles.tabText, activeTab === 'withdraw' && styles.activeTabText]}>
                                        💸 Retirar
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputSection}>
                            <Text style={styles.inputLabel}>Valor (R$)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0,00"
                                placeholderTextColor="#999"
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="decimal-pad"
                            />
                        </View>

                        <View style={styles.quickAmountsContainer}>
                            <Text style={styles.quickAmountsLabel}>Valores rápidos:</Text>
                            <View style={styles.quickAmountsGrid}>
                                {quickAmounts.map((quickAmount) => (
                                    <TouchableOpacity
                                        key={quickAmount}
                                        style={styles.quickAmountButton}
                                        onPress={() => setAmount(quickAmount.toString())}
                                    >
                                        <Text style={styles.quickAmountText}>
                                            R$ {quickAmount}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={onClose}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.confirmButton]}
                                onPress={handleConfirm}
                            >
                                <LinearGradient
                                    colors={activeTab === 'deposit' ? [colors.palette[6], colors.palette[8]] : ['#FF8A8A', '#FF6B6B']}
                                    style={styles.confirmGradient}
                                >
                                    <Text style={styles.confirmButtonText}>Confirmar</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width * 0.9,
        maxWidth: 400,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    modalContent: {
        padding: 24,
    },
    modalHeader: {
        marginBottom: 24,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#666',
    },
    tabContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    tab: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    activeTab: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    tabGradient: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    activeTabText: {
        color: 'white',
    },
    inputSection: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        padding: 16,
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'center',
    },
    quickAmountsContainer: {
        marginBottom: 24,
    },
    quickAmountsLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 12,
    },
    quickAmountsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    quickAmountButton: {
        backgroundColor: '#F5F7FA',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    quickAmountText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.palette[8],
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    cancelButton: {
        backgroundColor: '#F5F7FA',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
    },
    confirmButton: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    confirmGradient: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});
