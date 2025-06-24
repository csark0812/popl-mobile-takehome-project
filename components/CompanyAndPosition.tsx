import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, IconButton, List } from 'react-native-paper';

interface CompanyAndPositionProps {
  company?: string | null;
  title?: string | null;
}

export default function CompanyAndPosition({
  company,
  title,
}: CompanyAndPositionProps) {
  const [isCompanyExpanded, setIsCompanyExpanded] = useState(false);
  const [isTitleExpanded, setIsTitleExpanded] = useState(false);

  if (!company && !title) return null;

  const isCompanyLong = (company?.length || 0) > 40;
  const isTitleLong = (title?.length || 0) > 40;

  return (
    <View>
      {company && (
        <List.Item
          title="Company"
          description={company}
          left={(props) => (
            <List.Icon {...props} icon="domain" style={styles.leftIcon} />
          )}
          right={() =>
            isCompanyLong ? (
              <IconButton
                icon={isCompanyExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                style={styles.rightIcon}
                onPress={() => setIsCompanyExpanded(!isCompanyExpanded)}
              />
            ) : null
          }
          style={styles.listItem}
          titleStyle={styles.listTitle}
          descriptionStyle={styles.listDescription}
          descriptionNumberOfLines={
            isCompanyExpanded ? 9 : isCompanyLong ? 2 : undefined
          }
          onPress={
            isCompanyLong
              ? () => setIsCompanyExpanded(!isCompanyExpanded)
              : undefined
          }
        />
      )}
      {title && (
        <>
          {company && <Divider style={styles.divider} />}
          <List.Item
            title="Position"
            description={title}
            left={(props) => (
              <List.Icon
                {...props}
                icon="badge-account"
                style={styles.leftIcon}
              />
            )}
            right={() =>
              isTitleLong ? (
                <IconButton
                  icon={isTitleExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  style={styles.rightIcon}
                  onPress={() => setIsTitleExpanded(!isTitleExpanded)}
                />
              ) : null
            }
            style={styles.listItem}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
            descriptionNumberOfLines={
              isTitleExpanded ? 9 : isTitleLong ? 2 : undefined
            }
            onPress={
              isTitleLong
                ? () => setIsTitleExpanded(!isTitleExpanded)
                : undefined
            }
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: 0,
    paddingVertical: 4,
    paddingLeft: 0,
    paddingRight: 0,
  },
  listTitle: {
    fontSize: 13,
    opacity: 0.7,
  },
  listDescription: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    marginVertical: 4,
  },
  leftIcon: {
    margin: 0,
    alignSelf: 'flex-start',
    paddingTop: 6,
  },
  rightIcon: {
    margin: 0,
    alignSelf: 'flex-start',
    paddingTop: 2,
  },
});
