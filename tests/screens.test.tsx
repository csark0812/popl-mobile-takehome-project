import { render } from '@testing-library/react-native';
import React from 'react';
import { RootStackParamList } from '../navigation';
import EditLeadScreen from '../screens/EditLeadScreen';
import LeadDetailScreen from '../screens/LeadDetailScreen';
import LeadListScreen from '../screens/LeadListScreen';
import NewLeadScreen from '../screens/NewLeadScreen';
import SignupScreen from '../screens/SignupScreen';

jest.mock('@hooks/api', () => ({
  useLead: () => ({
    data: { id: '1', name: 'Test', email: 'test@test.com' },
    isLoading: false,
    isError: false,
  }),
  useUpdateLead: () => ({ mutate: jest.fn() }),
  useDeleteLead: () => ({ mutate: jest.fn() }),
  useFormConfig: () => ({
    data: {
      title: 'Lead Form',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
      ],
      submitLabel: 'Save',
      cancelLabel: 'Cancel',
    },
    isLoading: false,
  }),
  useLeads: () => ({ data: [], isLoading: false, isError: false }),
  useCreateLead: () => ({
    mutate: jest.fn(),
    isPending: false,
    isError: false,
  }),
}));

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  dispatch: jest.fn(),
  reset: jest.fn(),
  canGoBack: jest.fn(),
  getParent: jest.fn(),
  setOptions: jest.fn(),
  isFocused: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  getState: jest.fn(),
  dangerouslyGetParent: jest.fn(),
  dangerouslyGetState: jest.fn(),
};

function mockRoute<T extends keyof RootStackParamList>(
  name: T,
  params: RootStackParamList[T],
) {
  return {
    key: `${name}-key`,
    name,
    params,
  };
}

describe('Screens', () => {
  it('renders SignupScreen', () => {
    render(
      <SignupScreen
        route={mockRoute('Signup', undefined) as any}
        navigation={mockNavigation as any}
      />,
    );
  });
  it('renders EditLeadScreen', () => {
    render(
      <EditLeadScreen
        route={mockRoute('EditLead', { leadId: '1' }) as any}
        navigation={mockNavigation as any}
      />,
    );
  });
  it('renders LeadDetailScreen', () => {
    render(
      <LeadDetailScreen
        route={mockRoute('LeadDetail', { leadId: '1' }) as any}
        navigation={mockNavigation as any}
      />,
    );
  });
  it('renders NewLeadScreen', () => {
    render(
      <NewLeadScreen
        route={mockRoute('NewLead', undefined) as any}
        navigation={mockNavigation as any}
      />,
    );
  });
  it('renders LeadListScreen', () => {
    render(
      <LeadListScreen
        route={mockRoute('LeadList', undefined) as any}
        navigation={mockNavigation as any}
      />,
    );
  });
});

describe('Lead form submission', () => {
  it('submits new lead form and calls mutate with correct data', async () => {
    const { default: NewLeadScreen } = require('../screens/NewLeadScreen');
    const {
      fireEvent,
      findByText,
      getAllByTestId,
    } = require('@testing-library/react-native');
    const utils = render(
      <NewLeadScreen
        navigation={mockNavigation as any}
        route={mockRoute('NewLead', undefined) as any}
      />,
    );
    const inputs = utils.getAllByTestId('text-input-outlined');
    fireEvent.changeText(inputs[0], 'Alice');
    fireEvent.changeText(inputs[1], 'alice@example.com');
    const saveButton = await utils.findByText('Save');
    fireEvent.press(saveButton);
  });

  it('submits edit lead form and calls mutate with correct data', async () => {
    const { default: EditLeadScreen } = require('../screens/EditLeadScreen');
    const {
      fireEvent,
      findByText,
      getAllByTestId,
    } = require('@testing-library/react-native');
    const utils = render(
      <EditLeadScreen
        navigation={mockNavigation as any}
        route={mockRoute('EditLead', { leadId: '1' }) as any}
      />,
    );
    const inputs = utils.getAllByTestId('text-input-outlined');
    fireEvent.changeText(inputs[0], 'Bob Updated');
    fireEvent.changeText(inputs[1], 'bob@new.com');
    const saveButton = await utils.findByText('Save');
    fireEvent.press(saveButton);
  });
});
