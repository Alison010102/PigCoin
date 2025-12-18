import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { Goal } from '../types';


interface GoalCardProps {
    goal: Goal;
    onAdd: () => void;
    onRemove: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onAdd, onRemove }) => {
    const progress = goal.targetAmount > 0 ? goal.currentAmount / goal.targetAmount : 0;
    const clampedProgress = Math.min(Math.max(progress, 0), 1);

    const widthVal = useSharedValue(0);

    useEffect(() => {
        widthVal.value = withTiming(clampedProgress * 100, { duration: 1000 });
    }, [clampedProgress]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: `${widthVal.value}%`,
        };
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <View style={styles.cardContainer}>
            <LinearGradient
                colors={['#ffffff', '#f8f9fa']}
                style={styles.card}
            >
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>{goal.title}</Text>
                        <Text style={styles.subtitle}>Meta: {formatCurrency(goal.targetAmount)}</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        {/* Placeholder icon */}
                        <Text style={{ fontSize: 24 }}>🎯</Text>
                    </View>
                </View>

                <View style={styles.balanceContainer}>
                    <Text style={styles.balanceLabel}>Você tem</Text>
                    <Text style={styles.balanceValue}>{formatCurrency(goal.currentAmount)}</Text>
                </View>

                <View style={styles.progressBarBackground}>
                    <Animated.View style={[styles.progressBarFill, animatedStyle]}>
                        <LinearGradient
                            colors={[colors.palette[4], colors.palette[8]]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={StyleSheet.absoluteFill}
                        />
                    </Animated.View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.percentage}>{(clampedProgress * 100).toFixed(1)}% alcançado</Text>

                    <View style={styles.actions}>
                        <TouchableOpacity style={[styles.button, styles.removeButton]} onPress={onRemove}>
                            <Text style={styles.buttonText}>-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={onAdd}>
                            <Text style={styles.buttonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        marginBottom: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    card: {
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.text,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        marginTop: 4,
    },
    iconContainer: {
        width: 40,
        height: 40,
        backgroundColor: '#f0f8ff',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    balanceContainer: {
        marginBottom: 15,
    },
    balanceLabel: {
        fontSize: 12,
        color: '#666',
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    balanceValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.palette[10], // Darkest green
    },
    progressBarBackground: {
        height: 16,
        backgroundColor: '#EFF3F6',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 15,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    percentage: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.palette[8],
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    addButton: {
        backgroundColor: colors.palette[6],
    },
    removeButton: {
        backgroundColor: '#FF8A8A',
    },
    buttonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        lineHeight: 28,
    },
});
