import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface TemperatureTagProps {
  temperature: 'hot' | 'warm' | 'cold';
  color: string;
}

export default function TemperatureTag({
  temperature,
  color,
}: TemperatureTagProps) {
  return (
    <View
      style={[
        styles.temperatureTag,
        { backgroundColor: `${color}15`, borderColor: `${color}30` },
      ]}
    >
      <Text style={[styles.temperatureText, { color }]}>
        {temperature.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  temperatureTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  temperatureText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});
