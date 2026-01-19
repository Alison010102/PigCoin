import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Dimensions,
    StatusBar,
} from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useFinance } from '../../context/FinanceContext';
import { COLORS } from '../../constants/colors';
import { styles } from './styles';

const screenWidth = Dimensions.get('window').width;

export const ChartsScreen = () => {
    const { transactions } = useFinance();

    const expenses = transactions.filter(t => t.type === 'expense');
    const incomes = transactions.filter(t => t.type === 'income');

    const totalExpenses = expenses.reduce((sum, t) => sum + t.value, 0);
    const totalIncomes = incomes.reduce((sum, t) => sum + t.value, 0);
    const expensesByName = expenses.reduce((acc, t) => {
        if (!acc[t.name]) {
            acc[t.name] = 0;
        }
        acc[t.name] += t.value;
        return acc;
    }, {} as Record<string, number>);

    const incomesByName = incomes.reduce((acc, t) => {
        if (!acc[t.name]) {
            acc[t.name] = 0;
        }
        acc[t.name] += t.value;
        return acc;
    }, {} as Record<string, number>);

    const pieDataExpenses = Object.entries(expensesByName)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value], index) => ({
            name,
            value,
            color: [
                '#FF5252', // Red
                '#FF7043', // Deep Orange
                '#FFB74D', // Orange
                '#BA68C8', // Purple
                '#F06292', // Pink
            ][index],
            legendFontColor: COLORS.text,
            legendFontSize: 12,
        }));

    const pieDataIncomes = Object.entries(incomesByName)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value], index) => ({
            name,
            value,
            color: [
                '#66BB6A', // Green
                '#42A5F5', // Blue
                '#26C6DA', // Cyan
                '#26A69A', // Teal
                '#9CCC65', // Light Green
            ][index],
            legendFontColor: COLORS.text,
            legendFontSize: 12,
        }));

    const chartConfig = {
        backgroundColor: COLORS.surface,
        backgroundGradientFrom: COLORS.surface,
        backgroundGradientTo: COLORS.surface,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(31, 78, 95, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(31, 78, 95, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: COLORS.primary,
        },
    };

    if (transactions.length === 0) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
                <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>📊 Sem dados ainda</Text>
                    <Text style={styles.emptyText}>
                        Adicione transações para visualizar os gráficos
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>📊 Seus Gráficos</Text>

                <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Receitas</Text>
                            <Text style={[styles.summaryValue, { color: COLORS.accent }]}>
                                R$ {totalIncomes.toFixed(2)}
                            </Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Despesas</Text>
                            <Text style={[styles.summaryValue, { color: COLORS.danger }]}>
                                R$ {totalExpenses.toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </View>

                {pieDataIncomes.length > 0 && (
                    <View style={styles.chartCard}>
                        <Text style={styles.chartTitle}>Distribuição de Receitas</Text>
                        <PieChart
                            data={pieDataIncomes}
                            width={screenWidth - 60}
                            height={220}
                            chartConfig={chartConfig}
                            accessor="value"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            absolute
                        />
                    </View>
                )}

                {pieDataExpenses.length > 0 && (
                    <View style={styles.chartCard}>
                        <Text style={styles.chartTitle}>Distribuição de Despesas</Text>
                        <PieChart
                            data={pieDataExpenses}
                            width={screenWidth - 60}
                            height={220}
                            chartConfig={chartConfig}
                            accessor="value"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            absolute
                        />
                    </View>
                )}

            </ScrollView>
        </View>
    );
};

