import React from 'react';
import { useTheme } from 'react-native-paper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

// Common skeleton props configuration
export const useSkeletonProps = () => {
  const theme = useTheme();

  return {
    colorMode: theme.dark ? ('dark' as const) : ('light' as const),
    transition: {
      type: 'timing' as const,
      duration: 1000,
    },
  };
};

// Text skeleton component
export interface SkeletonTextProps {
  height?: number;
  width?: number;
  radius?: number;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  height = 16,
  width = 200,
  radius = 4,
}) => (
  <SkeletonPlaceholder>
    <SkeletonPlaceholder.Item
      height={height}
      width={width}
      borderRadius={radius}
    />
  </SkeletonPlaceholder>
);

// Circle skeleton component (for avatars)
export interface SkeletonCircleProps {
  size?: number;
}

export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
  size = 40,
}) => (
  <SkeletonPlaceholder>
    <SkeletonPlaceholder.Item
      height={size}
      width={size}
      borderRadius={size / 2}
    />
  </SkeletonPlaceholder>
);

// Rectangle skeleton component (for images/cards)
export interface SkeletonRectangleProps {
  height?: number;
  width?: number;
  radius?: number;
}

export const SkeletonRectangle: React.FC<SkeletonRectangleProps> = ({
  height = 100,
  width = 200,
  radius = 8,
}) => (
  <SkeletonPlaceholder>
    <SkeletonPlaceholder.Item
      height={height}
      width={width}
      borderRadius={radius}
    />
  </SkeletonPlaceholder>
);
