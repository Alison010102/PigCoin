import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
    },
    iconContainer: {
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.secondary,
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: COLORS.textDim,
    },
    rightContent: {
        alignItems: 'flex-end',
        gap: 8,
    },
    value: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    deleteButton: {
        padding: 4,
    },
});
