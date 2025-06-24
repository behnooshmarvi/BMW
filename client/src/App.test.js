import React from 'react';
import { render, screen } from '@testing-library/react';  
import { MemoryRouter } from 'react-router-dom';
import App from './App'; 


jest.mock('@mui/material/useMediaQuery', () => ({
  useMediaQuery: jest.fn().mockReturnValue(false),  
}));


test('renders learn react link', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
