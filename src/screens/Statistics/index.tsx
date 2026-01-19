import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useFinance } from '../../context/FinanceContext';
import { COLORS } from '../../constants/colors';
import { styles } from './styles';

const screenWidth = Dimensions.get('window').width;

type FilterType = '1D' | '7D' | '1M' | '1A';

export const StatisticsScreen = () => {
    const { transactions } = useFinance();
    const [filter, setFilter] = useState<FilterType>('7D');

    const filteredData = useMemo(() => {
        const now = new Date();
        let startDate = new Date();

        switch (filter) {
            case '1D':
                startDate.setHours(0, 0, 0, 0);
                break;
            case '7D':
                startDate.setDate(now.getDate() - 7);
                break;
            case '1M':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case '1A':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
        }

        const filtered = transactions.filter(t => new Date(t.date) >= startDate);
        const expenses = filtered.filter(t => t.type === 'expense');
        const incomes = filtered.filter(t => t.type === 'income');

        const totalExpenses = expenses.reduce((sum, t) => sum + t.value, 0);
        const totalIncomes = incomes.reduce((sum, t) => sum + t.value, 0);

        // Prepare chart data based on filter
        let labels: string[] = [];
        let dataPoints: number[] = [];

        if (filter === '1D') {
            labels = ['00h', '04h', '08h', '12h', '16h', '20h', 'Agora'];
            dataPoints = [0, 4, 8, 12, 16, 20, 24].map((hour) => {
                return expenses
                    .filter(t => {
                        const tHour = new Date(t.date).getHours();
                        return tHour <= hour && tHour > (hour - 4);
                    })
                    .reduce((sum, t) => sum + t.value, 0);
            });
        } else if (filter === '7D') {
            labels = Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return d.toLocaleDateString('pt-BR', { day: '2-digit' });
            });
            dataPoints = labels.map(label => {
                return expenses
                    .filter(t => new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit' }) === label)
                    .reduce((sum, t) => sum + t.value, 0);
            });
        } else if (filter === '1M') {
            // Group by every 5 days for 1M to avoid clutter
            labels = ['1-5', '6-10', '11-15', '16-20', '21-25', '26-30'];
            dataPoints = labels.map((_, i) => {
                const start = i * 5;
                const end = (i + 1) * 5;
                return expenses
                    .filter(t => {
                        const day = new Date(t.date).getDate();
                        return day > start && day <= end;
                    })
                    .reduce((sum, t) => sum + t.value, 0);
            });
        } else if (filter === '1A') {
            labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            dataPoints = labels.map((_, i) => {
                return expenses
                    .filter(t => new Date(t.date).getMonth() === i)
                    .reduce((sum, t) => sum + t.value, 0);
            });
        }

        return {
            totalExpenses,
            totalIncomes,
            labels,
            dataPoints: dataPoints.length > 0 ? dataPoints : [0],
        };
    }, [transactions, filter]);

    const chartConfig = {
        backgroundColor: COLORS.secondary,
        backgroundGradientFrom: COLORS.secondary,
        backgroundGradientTo: '#2C5E6F',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(244, 201, 93, ${opacity})`, // Primary color for the line
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: COLORS.primary,
        },
    };

    if (transactions.length === 0) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
                <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>📈 Sem estatísticas</Text>
                    <Text style={styles.emptyText}>
                        Adicione transações para ver sua evolução financeira
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
                <Text style={styles.title}>📈 Estatísticas</Text>

                <View style={styles.filterContainer}>
                    {(['1D', '7D', '1M', '1A'] as FilterType[]).map((f) => (
                        <TouchableOpacity
                            key={f}
                            style={[
                                styles.filterButton,
                                filter === f && styles.activeFilterButton,
                            ]}
                            onPress={() => setFilter(f)}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    filter === f && styles.activeFilterText,
                                ]}
                            >
                                {f}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Fluxo de Despesas</Text>
                    <LineChart
                        data={{
                            labels: filteredData.labels,
                            datasets: [
                                {
                                    data: filteredData.dataPoints,
                                    color: (opacity = 1) => `rgba(244, 201, 93, ${opacity})`,
                                    strokeWidth: 3,
                                },
                            ],
                        }}
                        width={screenWidth - 60}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chart}
                        withDots={filter === '1D' || filter === '7D'}
                        withInnerLines={false}
                        withOuterLines={false}
                        withVerticalLines={false}
                        withHorizontalLines={true}
                        formatYLabel={(value) => `R$ ${value}`}
                    />
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Total Gasto</Text>
                        <Text style={[styles.statValue, { color: COLORS.danger }]}>
                            R$ {filteredData.totalExpenses.toFixed(2)}
                        </Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Total Ganho</Text>
                        <Text style={[styles.statValue, { color: COLORS.accent }]}>
                            R$ {filteredData.totalIncomes.toFixed(2)}
                        </Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Média Diária</Text>
                        <Text style={styles.statValue}>
                            R$ {(filteredData.totalExpenses / (filter === '1D' ? 1 : filter === '7D' ? 7 : 30)).toFixed(2)}
                        </Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Economia</Text>
                        <Text style={styles.statValue}>
                            {filteredData.totalIncomes > 0
                                ? (((filteredData.totalIncomes - filteredData.totalExpenses) / filteredData.totalIncomes) * 100).toFixed(1)
                                : 0}%
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};
