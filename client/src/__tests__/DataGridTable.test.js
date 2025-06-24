import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DataGridTable from '../components/DataGridTable';
import * as api from '../api/api';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock('../api/api', () => ({
  getAllRecords: jest.fn(),
  deleteRecord: jest.fn(),
  searchRecords: jest.fn(),
  filterRecords: jest.fn(),
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}));


jest.mock('@mui/system/useMediaQuery', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(false),  
}));

jest.mock('ag-grid-react', () => ({
  AgGridReact: ({ rowData }) => (
    <div data-testid="ag-grid" data-row-count={rowData?.length || 0} />
  ),
}));

jest.mock('ag-grid-community', () => ({
  ModuleRegistry: { registerModules: jest.fn() },
  AllCommunityModule: {},
}));

const TestWrapper = ({ children }) => (
  <MemoryRouter>
    <ThemeProvider theme={createTheme()}>
      {children}
    </ThemeProvider>
  </MemoryRouter>
);

const mockData = [
  { _id: '1', name: 'John Doe', email: 'john@test.com' },
  { _id: '2', name: 'Jane Smith', email: 'jane@test.com' },
];

describe('DataGridTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getAllRecords.mockResolvedValue({ data: mockData });
    api.deleteRecord.mockResolvedValue({});
    api.searchRecords.mockResolvedValue({ data: mockData });
    api.filterRecords.mockResolvedValue({ data: mockData });
  });

  test('renders and loads data', async () => {
    render(<TestWrapper><DataGridTable /></TestWrapper>);
    
    expect(screen.getByText('🚗 Cars Data Tablen')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    
    expect(api.getAllRecords).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('ag-grid')).toBeInTheDocument();
  });

  test('search functionality', async () => {
    const user = userEvent.setup();
    render(<TestWrapper><DataGridTable /></TestWrapper>);
    
    await waitFor(() => screen.queryByRole('progressbar') === null);
    
    const searchInput = screen.getByPlaceholderText('🔍 Search...');
    await user.type(searchInput, 'John');
    
    await waitFor(() => {
      expect(api.searchRecords).toHaveBeenCalledWith('John');
    });
  });

  test('filter functionality', async () => {
    const user = userEvent.setup();
    render(<TestWrapper><DataGridTable /></TestWrapper>);
    
    await waitFor(() => screen.queryByRole('progressbar') === null);
    
    
    await user.click(screen.getByLabelText(/Field/i));
    await user.click(await screen.findByText(/NAME/i));
    
  
    await user.type(screen.getByLabelText(/Value/i), 'John');
    

    await user.click(screen.getByRole('button', { name: /apply/i }));
    
    await waitFor(() => {
      expect(api.filterRecords).toHaveBeenCalledWith('name', 'contains', 'John');
    });
  });

  test('reset functionality', async () => {
    const user = userEvent.setup();
    render(<TestWrapper><DataGridTable /></TestWrapper>);
    
    await waitFor(() => screen.queryByRole('progressbar') === null);
    
    const searchInput = screen.getByPlaceholderText('🔍 Search...');
    await user.type(searchInput, 'test');
    
    await user.click(screen.getByRole('button', { name: /reset/i }));
    
    expect(searchInput.value).toBe('');
    await waitFor(() => {
      expect(api.getAllRecords).toHaveBeenCalledTimes(2);
    });
  });

  test('handles API errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    api.getAllRecords.mockRejectedValue(new Error('API Error'));
    
    render(<TestWrapper><DataGridTable /></TestWrapper>);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    
    consoleSpy.mockRestore();
  });
});
