import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withDelay,
} from 'react-native-reanimated';
import { PieChart } from 'react-native-gifted-charts';
import { colors } from '../theme/colors';
import { Goal } from '../types';

interface DashboardChartProps {
    goals: Goal[];
}

export const DashboardChart: React.FC<DashboardChartProps> = ({ goals }) => {
    const total = goals.reduce((acc, goal) => acc + goal.currentAmount, 0);
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.8);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 600 });
        scale.value = withSpring(1, {
            damping: 15,
            stiffness: 100,
        });
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ scale: scale.value }],
        };
    });

    if (total === 0) {
        return (
            <Animated.View style={[styles.container, animatedStyle]}>
                <Text style={styles.emptyText}>Adicione saldo às suas caixinhas para ver o gráfico!</Text>
            </Animated.View>
        );
    }

    const data = goals.map((goal, index) => ({
        value: goal.currentAmount,
        color: colors.palette[index % colors.palette.length],
        text: `${((goal.currentAmount / total) * 100).toFixed(0)}%`,
        shiftTextX: -10,
        shiftTextY: -10,
    }));

    const renderLegend = () => {
        return (
            <View style={styles.legendContainer}>
                {goals.map((goal, index) => {
                    const legendOpacity = useSharedValue(0);
                    const legendTranslateX = useSharedValue(-20);

                    useEffect(() => {
                        legendOpacity.value = withDelay(
                            index * 100,
                            withTiming(1, { duration: 400 })
                        );
                        legendTranslateX.value = withDelay(
                            index * 100,
                            withSpring(0, {
                                damping: 15,
                                stiffness: 100,
                            })
                        );
                    }, []);

                    const legendAnimatedStyle = useAnimatedStyle(() => {
                        return {
                            opacity: legendOpacity.value,
                            transform: [{ translateX: legendTranslateX.value }],
                        };
                    });

                    return (
                        <Animated.View key={goal.id} style={[styles.legendItem, legendAnimatedStyle]}>
                            <View style={[styles.dot, { backgroundColor: colors.palette[index % colors.palette.length] }]} />
                            <Text style={styles.legendText}>{goal.title}: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goal.currentAmount)}</Text>
                        </Animated.View>
                    );
                })}
            </View>
        );
    };

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <Text style={styles.header}>Distribuição</Text>
            <View style={{ alignItems: 'center' }}>
                <PieChart
                    data={data}
                    donut
                    showGradient
                    sectionAutoFocus
                    radius={90}
                    innerRadius={60}
                    innerCircleColor={colors.background}
                    centerLabelComponent={() => {
                        return (
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 22, color: colors.text, fontWeight: 'bold' }}>
                                    {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })}
                                </Text>
                                <Text style={{ fontSize: 14, color: '#666' }}>Total</Text>
                            </View>
                        );
                    }}
                />
            </View>
            {renderLegend()}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 20,
        alignItems: 'center',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    emptyText: {
        color: '#999',
        textAlign: 'center',
        margin: 20,
    },
    legendContainer: {
        marginTop: 20,
        width: '100%',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    legendText: {
        color: colors.text,
        fontSize: 14,
    },
});
