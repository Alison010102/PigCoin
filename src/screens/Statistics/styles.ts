import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginBottom: 20,
    },
    filterContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    filterButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeFilterButton: {
        backgroundColor: COLORS.secondary,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textDim,
    },
    activeFilterText: {
        color: COLORS.white,
    },
    chartCard: {
        backgroundColor: COLORS.secondary, // Dark background for financial look
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 16,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 16,
        width: '48%',
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textDim,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.secondary,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.textDim,
        textAlign: 'center',
    },
});
