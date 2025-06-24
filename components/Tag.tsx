import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

interface TagProps {
  label: string;
  onPress?: () => void;
}

const Tag: React.FC<TagProps> = ({ label, onPress }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Surface style={styles.container} elevation={0}>
      <Text style={styles.text} onPress={onPress}>
        {label}
      </Text>
    </Surface>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.outlineVariant,
      borderWidth: 0.5,
      borderRadius: 100,
      alignSelf: 'flex-start',
      flexShrink: 0, // Prevent tags from shrinking
    },
    text: {
      fontSize: 10,
      marginHorizontal: 8,
      marginVertical: 6,
      color: theme.colors.onSurfaceVariant,
      textTransform: 'uppercase',
    },
  });

export default Tag;
