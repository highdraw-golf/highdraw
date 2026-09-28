import type { Meta, StoryObj } from '@storybook/react';
import { SizeSelector } from '../components/ui/SizeSelector';

const meta: Meta<typeof SizeSelector> = {
  title: 'Design System/SizeSelector',
  component: SizeSelector,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    selectedSize: 'L',
    onSelectSize: (sz: string) => console.log('Selected size:', sz),
    onOpenSizeGuide: () => alert('Open size guide modal'),
    lowStockSizes: ['XL', '2XL'],
  },
};
