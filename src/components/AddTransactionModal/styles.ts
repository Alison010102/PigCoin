import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(31, 78, 95, 0.4)',
    },
    container: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        maxHeight: '80%',
        paddingBottom: 20,
        elevation: 20,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.secondary,
    },
    content: {
        padding: 24,
    },
    typeContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    typeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        backgroundColor: COLORS.surface,
        borderColor: COLORS.lightGray,
    },
    typeButtonActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.background,
    },
    typeText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.secondary,
    },
    typeTextActive: {
        color: COLORS.secondary,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.secondary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.background,
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        color: COLORS.secondary,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
    },
    addButton: {
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 32,
        backgroundColor: COLORS.primary,
    },
    addButtonText: {
        color: COLORS.secondary,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
