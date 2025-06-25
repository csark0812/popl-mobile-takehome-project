import { render } from '@testing-library/react-native';
import React from 'react';
import {
  NavigationPageProvider,
  useNavigationPageContext,
} from '../context/NavigationPageContext';

describe('Context', () => {
  it('renders NavigationPageProvider and provides context', () => {
    let contextValue: any = null;
    function Consumer() {
      contextValue = useNavigationPageContext();
      return <></>;
    }
    render(
      <NavigationPageProvider>
        <Consumer />
      </NavigationPageProvider>,
    );
    expect(contextValue).toBeDefined();
    expect(contextValue.setHeaderHeight).toBeInstanceOf(Function);
    expect(contextValue.headerHeight).toBe(0);
  });
  it('updates context values', () => {
    let contextValue: any = null;
    function Consumer() {
      contextValue = useNavigationPageContext();
      return <></>;
    }
    render(
      <NavigationPageProvider>
        <Consumer />
      </NavigationPageProvider>,
    );
    const { act } = require('@testing-library/react-native');
    act(() => {
      contextValue.setHeaderHeight(42);
    });
    expect(contextValue.headerHeight).toBe(42);
  });
});
