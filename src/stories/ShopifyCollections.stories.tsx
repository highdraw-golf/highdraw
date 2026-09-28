import type { Meta, StoryObj } from '@storybook/react';
import { ShopifyCollections } from '../components/ShopifyCollections';

const meta: Meta<typeof ShopifyCollections> = {
  title: 'High Draw Golf/ShopifyCollections',
  component: ShopifyCollections,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onAddToCart: (item) => alert(`Added ${item.name} to cart`),
  },
};
