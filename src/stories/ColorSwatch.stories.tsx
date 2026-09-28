import type { Meta, StoryObj } from '@storybook/react';
import { ColorSwatch } from '../components/ui/ColorSwatch';

const meta: Meta<typeof ColorSwatch> = {
  title: 'Design System/ColorSwatch',
  component: ColorSwatch,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const CoreColors: Story = {
  args: {
    colors: [
      { name: 'Cypress Green', hex: '#2A4236' },
      { name: 'Coastal Carolina', hex: '#6BA4B8' },
      { name: 'Deep Navy', hex: '#1E293B' },
      { name: 'Crisp White', hex: '#FFFFFF' },
    ],
    selectedColor: 'Cypress Green',
    onSelectColor: (c: string) => console.log('Selected color:', c),
    size: 'md',
    showLabel: true,
  },
};
