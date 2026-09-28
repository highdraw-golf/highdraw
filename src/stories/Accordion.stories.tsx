import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from '../components/ui/Accordion';
import { RefreshCw, ShieldCheck, Truck } from 'lucide-react';

const meta: Meta<typeof Accordion> = {
  title: 'Design System/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ProductAccordions: Story = {
  args: {
    defaultOpenId: 'engineering',
    items: [
      {
        id: 'engineering',
        title: 'Fabric & Collar Engineering',
        icon: <RefreshCw size={16} className="text-[#38BDF8]" />,
        content: (
          <p className="text-slate-600">
            Fused interlining collar stand engineered to never curl or bacon in the wash. 180 GSM yarn-dyed micro-pique with a tailored matte drape.
          </p>
        ),
      },
      {
        id: 'guarantee',
        title: '100+ Washes Tested Guarantee',
        icon: <ShieldCheck size={16} className="text-emerald-700" />,
        content: (
          <p className="text-slate-600">
            We back our proprietary fused collar stand with a 30-day fairway trial and 100+ wash durability warranty.
          </p>
        ),
      },
      {
        id: 'shipping',
        title: 'Complimentary Shipping & Returns',
        icon: <Truck size={16} className="text-[#38BDF8]" />,
        content: (
          <p className="text-slate-600">
            All orders over $75 include free standard domestic US shipping. 30-day hassle-free size exchanges.
          </p>
        ),
      },
    ],
  },
};
