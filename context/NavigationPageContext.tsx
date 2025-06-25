import React, { createContext, ReactNode, useContext, useState } from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';

interface NavigationPageContextType {
  headerHeight: number;
  setHeaderHeight: (height: number) => void;
  stickyHeaderHeight: number;
  setStickyHeaderHeight: (height: number) => void;
  headerSharedValue: SharedValue<number>;
  scrollHeader: (value: number) => void;
  alwaysShow: boolean;
  setAlwaysShow: (show: boolean) => void;
  options?: any;
  route?: any;
  navigation?: any;
}

const NavigationPageContext = createContext<
  NavigationPageContextType | undefined
>(undefined);

export const NavigationPageProvider = ({
  children,
  options,
  route,
  navigation,
}: {
  children: ReactNode;
  options?: any;
  route?: any;
  navigation?: any;
}) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [stickyHeaderHeight, setStickyHeaderHeight] = useState(0);
  const [alwaysShow, setAlwaysShow] = useState(false);
  const headerSharedValue = useSharedValue(0);
  const scrollHeader = (value: number) => {
    headerSharedValue.value = value;
  };

  const contextValue: NavigationPageContextType = {
    headerHeight,
    setHeaderHeight,
    stickyHeaderHeight,
    setStickyHeaderHeight,
    headerSharedValue,
    scrollHeader,
    alwaysShow,
    setAlwaysShow,
    options,
    route,
    navigation,
  } as any;

  return (
    <NavigationPageContext.Provider value={contextValue}>
      {children}
    </NavigationPageContext.Provider>
  );
};

export const useNavigationPageContext = () => {
  const context = useContext(NavigationPageContext);
  if (!context) {
    throw new Error(
      'useNavigationPageContext must be used within a NavigationPageProvider',
    );
  }
  return context;
};
