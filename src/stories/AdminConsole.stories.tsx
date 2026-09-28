import type { Meta, StoryObj } from '@storybook/react';
import { AdminConsole } from '../components/AdminConsole';

const meta: Meta<typeof AdminConsole> = {
  title: 'High Draw Golf/AdminConsole',
  component: AdminConsole,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    tickerText: 'FREE SHIPPING ON ORDERS OVER $75 • TOUR-GRADE DRAPE AT $48',
    activeBoard: 'Autumn Fairways',
    poloPrice: 48,
    onClose: () => alert('Close clicked'),
    onUpdateTicker: (text) => alert(`Ticker updated to: ${text}`),
    onSelectBoard: (board) => alert(`Board selected: ${board}`),
    onUpdatePrice: (price) => alert(`Price updated to: $${price}`),
  },
};
