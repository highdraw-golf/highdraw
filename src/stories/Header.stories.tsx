import type { Meta, StoryObj } from '@storybook/react';
import { Header } from '../components/Header';

const meta: Meta<typeof Header> = {
  title: 'High Draw Golf/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cartCount: 2,
    tickerText: 'FREE SHIPPING ON ORDERS OVER $75 • TOUR-GRADE DRAPE AT $48',
    onOpenCart: () => alert('Cart opened'),
    onNavigate: (view, category) => alert(`Navigated to ${view} (category: ${category || 'none'})`),
  },
};
