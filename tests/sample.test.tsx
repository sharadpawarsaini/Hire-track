import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Sample Test Suite', () => {
  it('renders a basic component successfully', () => {
    render(<div>Hello World</div>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
