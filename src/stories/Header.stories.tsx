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
    activeBoard: 'Autumn Fairways',
    tickerText: 'FREE SHIPPING ON ORDERS OVER $75 • TOUR-GRADE DRAPE AT $48',
    onOpenCart: () => alert('Cart opened'),
    onScrollToSection: (id) => alert(`Scroll to ${id}`),
    onOpenPipes: () => alert('Pipes curation opened'),
    onOpenAdmin: () => alert('Owner console opened'),
  },
};
