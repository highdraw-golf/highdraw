import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/ui/Button';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Add to Bag • $48',
    variant: 'primary',
    size: 'md',
    icon: <ShoppingBag size={16} />,
  },
};

export const Secondary: Story = {
  args: {
    children: 'Explore Craftsmanship',
    variant: 'secondary',
    size: 'md',
    icon: <ArrowRight size={16} />,
  },
};

export const Luxury: Story = {
  args: {
    children: 'Checkout Now',
    variant: 'luxury',
    size: 'lg',
  },
};

export const Outline: Story = {
  args: {
    children: 'Find My Fit / Sizing',
    variant: 'outline',
    size: 'md',
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Add to Bag • $48',
    variant: 'primary',
    size: 'lg',
    fullWidth: true,
  },
};
