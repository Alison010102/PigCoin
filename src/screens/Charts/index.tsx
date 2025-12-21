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

    const pieData = Object.entries(expensesByName)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value], index) => ({
            name,
            value,
            color: [COLORS.primary, COLORS.primaryDark, COLORS.accent, COLORS.secondary, '#95A5A6'][index],
            legendFontColor: COLORS.text,
            legendFontSize: 12,
        }));
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    });

    const expensesByDay = last7Days.map(day => {
        const dayExpenses = expenses.filter(t =>
            new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) === day
        );
        return dayExpenses.reduce((sum, t) => sum + t.value, 0);
    });

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

                {pieData.length > 0 && (
                    <View style={styles.chartCard}>
                        <Text style={styles.chartTitle}>Distribuição de Despesas</Text>
                        <PieChart
                            data={pieData}
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

                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Despesas - Últimos 7 Dias</Text>
                    <BarChart
                        data={{
                            labels: last7Days,
                            datasets: [{ data: expensesByDay.length > 0 ? expensesByDay : [0] }],
                        }}
                        width={screenWidth - 60}
                        height={220}
                        yAxisLabel="R$ "
                        yAxisSuffix=""
                        chartConfig={{
                            ...chartConfig,
                            color: (opacity = 1) => `rgba(244, 201, 93, ${opacity})`,
                        }}
                        style={styles.chart}
                        fromZero
                    />
                </View>
            </ScrollView>
        </View>
    );
};
