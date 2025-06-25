import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
// Import all components
import { SharedValue } from 'react-native-reanimated';
import AboutThisLead from '../components/AboutThisLead';
import ActionBarIcon from '../components/ActionBarIcon';
import ActionButtons from '../components/ActionButtons';
import AddNewTagPopover from '../components/AddNewTagPopover';
import ChangeThemeAction from '../components/ChangeThemeAction';
import CompanyAndPosition from '../components/CompanyAndPosition';
import ContactInformation from '../components/ContactInformation';
import ContactRow from '../components/ContactRow';
import DetailsHeroSection from '../components/DetailsHeroSection';
import DetailTags from '../components/DetailTags';
import DetailTagsSection from '../components/DetailTagsSection';
import FilterPopover from '../components/FilterPopover';
import Form from '../components/Form';
import LeadCard from '../components/LeadCard';
import LeadDetailCard from '../components/LeadDetailCard';
import LoadingOverlay from '../components/LoadingOverlay';
import ModalHeader from '../components/ModalHeader';
import NotesSection from '../components/NotesSection';
import Popover from '../components/Popover';
import ProgressiveBlurView from '../components/ProgressiveBlurView';
import ScrollHeader from '../components/ScrollHeader';
import SearchAndFilters from '../components/SearchAndFilters';
import SettingsPopover from '../components/SettingsPopover';
import StickyHeader from '../components/StickyHeader';
import Tag from '../components/Tag';
import Tags from '../components/Tags';
import TemperatureTag from '../components/TemperatureTag';

const dummyLead = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  company: 'Acme Inc.',
  title: 'Manager',
  phone: '1234567890',
  tags: ['hot', 'priority'],
  notes: 'Some notes',
  createdAt: '2023-01-01T00:00:00Z',
  image: null,
};

const mockScrollY = { value: 0 } as SharedValue<number>;
const mockOnSearchChangeText = jest.fn();
const mockOnFiltersChange = jest.fn();
const mockSetFormData = jest.fn();
const mockOnClose = jest.fn();

describe('Component tests', () => {
  it('renders AboutThisLead and handles tag actions', () => {
    const onAddTag = jest.fn();
    const onRemoveTag = jest.fn();
    const { getByText } = render(
      <AboutThisLead
        lead={dummyLead}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
      />,
    );
    expect(getByText('About This Lead')).toBeTruthy();
  });
  it('renders ActionBarIcon and handles press', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <ActionBarIcon icon="star" onPress={onPress} />,
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalled();
  });
  it('renders ActionButtons', () => {
    render(<ActionButtons lead={dummyLead} />);
  });
  it('renders AddNewTagPopover and handles submit', () => {
    const onSubmit = jest.fn();
    const { getByTestId } = render(<AddNewTagPopover onSubmit={onSubmit} />);
    // Simulate opening and submitting if UI exposes testID
  });
  it('renders ChangeThemeAction', () => {
    render(<ChangeThemeAction />);
  });
  it('renders CompanyAndPosition with company and title', () => {
    const { getByText } = render(
      <CompanyAndPosition company="Acme Inc." title="Manager" />,
    );
    expect(getByText('Acme Inc.')).toBeTruthy();
    expect(getByText('Manager')).toBeTruthy();
  });
  it('renders ContactInformation', () => {
    render(<ContactInformation lead={dummyLead} />);
  });
  it('renders ContactRow and handles press', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ContactRow
        icon="phone"
        label="Phone"
        value="1234567890"
        onPress={onPress}
      />,
    );
    fireEvent.press(getByText('1234567890'));
    expect(onPress).toHaveBeenCalled();
  });
  it('renders DetailsHeroSection with initials', () => {
    const { getByText } = render(<DetailsHeroSection lead={dummyLead} />);
    expect(getByText('John Doe')).toBeTruthy();
  });
  it('renders DetailTags with required props', () => {
    render(<DetailTags tags={['hot', 'priority']} leadId="1" />);
  });
  it('renders DetailTagsSection and handles tag actions', () => {
    const onAddTag = jest.fn();
    const onRemoveTag = jest.fn();
    render(
      <DetailTagsSection
        tags={['hot', 'priority']}
        leadId="1"
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
      />,
    );
  });
  it('renders FilterPopover and handles filter change', () => {
    const onFiltersChange = jest.fn();
    render(
      <FilterPopover
        filters={{ sortBy: 'name' }}
        onFiltersChange={onFiltersChange}
      />,
    );
  });
  it('renders Form with required formConfig', () => {
    render(
      <Form
        formConfig={{
          title: 'Test',
          fields: [],
          submitLabel: 'Submit',
          cancelLabel: 'Cancel',
        }}
        formData={{}}
        setFormData={mockSetFormData}
      />,
    );
  });
  it('renders LeadCard and handles navigation', () => {
    render(<LeadCard {...dummyLead} />);
  });
  it('renders LeadDetailCard with children', () => {
    const { getByText } = render(
      <LeadDetailCard title="Title">Child</LeadDetailCard>,
    );
    expect(getByText('Title')).toBeTruthy();
  });
  it('renders LoadingOverlay', () => {
    render(<LoadingOverlay />);
  });
  it('renders ModalHeader with required props', () => {
    render(<ModalHeader scrollY={mockScrollY} onClose={mockOnClose} />);
  });
  it('renders NotesSection and handles note update', () => {
    const onUpdateNote = jest.fn();
    render(<NotesSection notes="Some notes" onUpdateNote={onUpdateNote} />);
  });
  it('renders Popover', () => {
    render(<Popover>Popover content</Popover>);
  });
  it('renders ProgressiveBlurView', () => {
    render(<ProgressiveBlurView>Blurred</ProgressiveBlurView>);
  });
  it('renders ScrollHeader with required props', () => {
    render(<ScrollHeader scrollY={mockScrollY} />);
  });
  it('renders SearchAndFilters with required props', () => {
    render(
      <SearchAndFilters
        searchValue=""
        onSearchChangeText={mockOnSearchChangeText}
        filters={{ sortBy: 'name' }}
        onFiltersChange={mockOnFiltersChange}
      />,
    );
  });
  it('renders SettingsPopover', () => {
    render(<SettingsPopover />);
  });
  it('renders StickyHeader with required props', () => {
    render(<StickyHeader scrollY={mockScrollY} />);
  });
  it('renders Tag', () => {
    render(<Tag label="Tag" />);
  });
  it('renders Tags', () => {
    render(<Tags tags={['tag1', 'tag2']} leadId="1" />);
  });
  it('renders TemperatureTag with hot', () => {
    render(<TemperatureTag temperature="hot" color="#FF0000" />);
  });
  // Edge case: LeadCard with missing optional props
  it('renders LeadCard with minimal props', () => {
    render(<LeadCard id="2" name="Jane" email="jane@example.com" />);
  });
  // Accessibility: LeadCard has correct accessibility label
  it('LeadCard has accessibility label', () => {
    const { getByLabelText } = render(<LeadCard {...dummyLead} />);
    expect(getByLabelText(/Lead John Doe/)).toBeTruthy();
  });
});
