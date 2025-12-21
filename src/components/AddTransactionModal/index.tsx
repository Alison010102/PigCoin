import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { styles } from './styles';

interface AddTransactionModalProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (name: string, value: number, type: 'expense' | 'income') => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
    visible,
    onClose,
    onAdd,
}) => {
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [type, setType] = useState<'expense' | 'income'>('expense');

    const handleAdd = () => {
        if (!name.trim() || !value.trim()) {
            return;
        }

        const numValue = parseFloat(value.replace(',', '.'));
        if (isNaN(numValue) || numValue <= 0) {
            return;
        }

        onAdd(name.trim(), numValue, type);
        setName('');
        setValue('');
        setType('expense');
        onClose();
    };

    const handleCancel = () => {
        setName('');
        setValue('');
        setType('expense');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={handleCancel}
                />
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Nova Transação</Text>
                        <TouchableOpacity onPress={handleCancel}>
                            <Ionicons name="close" size={28} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        <View style={styles.typeContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.typeButton,
                                    type === 'expense' && styles.typeButtonActive,
                                    { borderColor: COLORS.primaryDark },
                                ]}
                                onPress={() => setType('expense')}
                            >
                                <Ionicons
                                    name="arrow-down-circle"
                                    size={24}
                                    color={type === 'expense' ? COLORS.white : COLORS.primaryDark}
                                />
                                <Text
                                    style={[
                                        styles.typeText,
                                        type === 'expense' && styles.typeTextActive,
                                    ]}
                                >
                                    Despesa
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.typeButton,
                                    type === 'income' && styles.typeButtonActive,
                                    { borderColor: COLORS.accent },
                                ]}
                                onPress={() => setType('income')}
                            >
                                <Ionicons
                                    name="arrow-up-circle"
                                    size={24}
                                    color={type === 'income' ? COLORS.white : COLORS.accent}
                                />
                                <Text
                                    style={[
                                        styles.typeText,
                                        type === 'income' && styles.typeTextActive,
                                    ]}
                                >
                                    Receita
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Nome</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: Luz, Aluguel, Compras..."
                                placeholderTextColor={COLORS.textDim}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Valor (R$)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0,00"
                                placeholderTextColor={COLORS.textDim}
                                value={value}
                                onChangeText={setValue}
                                keyboardType="decimal-pad"
                            />
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.addButton,
                                { backgroundColor: type === 'expense' ? COLORS.primaryDark : COLORS.accent },
                            ]}
                            onPress={handleAdd}
                        >
                            <Text style={styles.addButtonText}>Adicionar</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};
