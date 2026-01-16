import React from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Animated,
    TouchableWithoutFeedback,
    Dimensions,
    Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedRN, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import { COLORS } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

interface FloatingActionButtonProps {
    onAddExpense: () => void;
    onAddIncome: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    onAddExpense,
    onAddIncome,
}) => {
    const expanded = useSharedValue(0);
    const [isOpen, setIsOpen] = React.useState(false);

    const toggleMenu = () => {
        if (expanded.value === 0) {
            expanded.value = withSpring(1);
            setIsOpen(true);
        } else {
            expanded.value = withSpring(0);
            setIsOpen(false);
        }
    };

    const mainButtonStyle = useAnimatedStyle(() => {
        const rotation = interpolate(expanded.value, [0, 1], [0, 45]);
        return {
            transform: [{ rotate: `${rotation}deg` }],
        };
    });

    const overlayStyle = useAnimatedStyle(() => {
        const opacity = interpolate(expanded.value, [0, 1], [0, 1]);
        const pointerEvents = expanded.value > 0 ? 'auto' : 'none';
        return {
            opacity,
            display: expanded.value > 0 ? 'flex' : 'none',
        };
    });

    const expenseButtonStyle = useAnimatedStyle(() => {
        const translateY = interpolate(expanded.value, [0, 1], [0, -100]);
        const translateX = interpolate(expanded.value, [0, 1], [0, -60]);
        const scale = interpolate(expanded.value, [0, 1], [0, 1]);
        return {
            transform: [{ translateY }, { translateX }, { scale }],
            opacity: expanded.value,
        };
    });

    const incomeButtonStyle = useAnimatedStyle(() => {
        const translateY = interpolate(expanded.value, [0, 1], [0, -100]);
        const translateX = interpolate(expanded.value, [0, 1], [0, 60]);
        const scale = interpolate(expanded.value, [0, 1], [0, 1]);
        return {
            transform: [{ translateY }, { translateX }, { scale }],
            opacity: expanded.value,
        };
    });

    return (
        <View style={styles.container}>
            {/* Overlay */}
            <TouchableWithoutFeedback onPress={toggleMenu}>
                <AnimatedRN.View
                    style={[styles.overlay, overlayStyle]}
                />
            </TouchableWithoutFeedback>

            {/* Sub-buttons */}
            <AnimatedRN.View style={[styles.subButtonContainer, expenseButtonStyle]}>
                <Text style={styles.label}>Despesa</Text>
                <TouchableOpacity
                    style={[styles.subButton, { backgroundColor: COLORS.danger }]}
                    onPress={() => {
                        toggleMenu();
                        onAddExpense();
                    }}
                >
                    <Ionicons name="arrow-down-outline" size={24} color={COLORS.white} />
                </TouchableOpacity>
            </AnimatedRN.View>

            <AnimatedRN.View style={[styles.subButtonContainer, incomeButtonStyle]}>
                <Text style={styles.label}>Receita</Text>
                <TouchableOpacity
                    style={[styles.subButton, { backgroundColor: COLORS.accent }]}
                    onPress={() => {
                        toggleMenu();
                        onAddIncome();
                    }}
                >
                    <Ionicons name="arrow-up-outline" size={24} color={COLORS.white} />
                </TouchableOpacity>
            </AnimatedRN.View>

            {/* Main Button */}
            <TouchableOpacity
                style={styles.mainButton}
                onPress={toggleMenu}
                activeOpacity={0.8}
            >
                <AnimatedRN.View style={mainButtonStyle}>
                    <Ionicons name="add" size={32} color={COLORS.white} />
                </AnimatedRN.View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 30, // Posiciona o botão um pouco mais para cima para destacar na tab bar
        left: width / 2 - 30,
        zIndex: 9999,
        elevation: 15,
    },
    overlay: {
        position: 'absolute',
        bottom: -height, // Garante que cubra tudo para baixo também
        left: -width / 2 + 30,
        width: width,
        height: height * 2,
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: -1,
    },
    mainButton: {
        backgroundColor: COLORS.secondary,
        width: 64, // Um pouco maior para destaque
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },

    subButtonContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
    },
    subButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    label: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
});
