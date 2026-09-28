import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../components/ui/Badge';
import { RefreshCw, ShieldCheck } from 'lucide-react';

const meta: Meta<typeof Badge> = {
  title: 'Design System/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Guarantee: Story = {
  args: {
    children: '100+ Washes Tested',
    variant: 'guarantee',
    icon: <RefreshCw size={12} className="text-[#38BDF8]" />,
  },
};

export const TourDrape: Story = {
  args: {
    children: 'Tour Drape • $48',
    variant: 'tour',
  },
};

export const SaleSave: Story = {
  args: {
    children: 'Save $67 (58% Off)',
    variant: 'sale',
  },
};

export const TrueToSize: Story = {
  args: {
    children: '94% True to Size',
    variant: 'neutral',
    icon: <ShieldCheck size={12} className="text-emerald-700" />,
  },
};
