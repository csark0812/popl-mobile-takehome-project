import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

interface DetailBottomActionsProps {
  onEditLead: () => void;
  onDeleteLead: () => void;
}

export default function DetailBottomActions({
  onEditLead,
  onDeleteLead,
}: DetailBottomActionsProps) {
  const theme = useTheme();

  return (
    <View style={styles.buttonsContainer}>
      <Button
        mode="contained"
        onPress={onEditLead}
        icon="pencil"
        style={[styles.button, styles.editButton]}
        buttonColor={theme.colors.primary}
        textColor={theme.colors.onPrimary}
      >
        Edit Lead
      </Button>
      <Button
        mode="outlined"
        onPress={onDeleteLead}
        icon="delete"
        style={[styles.button, styles.deleteButton]}
        textColor={theme.colors.error}
        buttonColor="transparent"
      >
        Delete Lead
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    gap: 12,
  },
  button: {
    borderRadius: 8,
  },
  editButton: {
    // Additional styling for edit button if needed
  },
  deleteButton: {
    borderColor: 'rgba(211, 47, 47, 0.5)', // Light red border
  },
});
