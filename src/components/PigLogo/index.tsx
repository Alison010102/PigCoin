import React from 'react';
import { Image, View } from 'react-native';
import { styles } from './styles';

interface PigLogoProps {
    size?: number;
}

export const PigLogo: React.FC<PigLogoProps> = ({ size = 100 }) => {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Image
                source={require('../../images/logo-c.png')}
                style={{ width: size, height: size }}
                resizeMode="contain"
            />
        </View>
    );
};
