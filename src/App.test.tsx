import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the App component', () => {
    render(<App />);
    // You might need to adjust this based on actual content rendered by App
    expect(screen.getByText(/Isana/i)).toBeInTheDocument(); 
  });
});