import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

interface LeadDetailCardProps {
  title: string;
  children: React.ReactNode;
}

export default function LeadDetailCard({
  title,
  children,
}: LeadDetailCardProps) {
  const theme = useTheme();

  return (
    <Card
      style={[styles.card, { borderColor: theme.colors.surfaceVariant }]}
      mode="outlined"
    >
      <Card.Content>
        <Text style={[theme.fonts.titleLarge, styles.sectionTitle]}>
          {title}
        </Text>
        {children}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
});
