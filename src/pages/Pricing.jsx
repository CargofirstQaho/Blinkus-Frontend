import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bot, ShieldCheck, LayoutDashboard, FileSignature, ClipboardList } from 'lucide-react';
import PricingCard from '../components/pricing/PricingCard.jsx';
import PricingFeatures from '../components/pricing/PricingFeatures.jsx';
import PricingToggle from '../components/pricing/PricingToggle.jsx';
import { selectIsAuthenticated } from '../redux/slices/authSlice';

const FREE_FEATURES = [
  { label: 'Limited AI Chat Usage', included: true, highlight: Bot },
  { label: 'No ERP Access', included: false },
  { label: 'No Buyer/Seller Credibility Checking', included: false },
  { label: 'No Contract Drafting', included: false },
  { label: 'No Order Management', included: false },
  { label: 'No Purchase Orders', included: false },
  { label: 'No Credit Notes', included: false },
  { label: 'No Debit Notes', included: false },
  { label: 'No Proforma Invoice', included: false },
  { label: 'No Packing List', included: false },
  { label: 'No Commercial Invoice', included: false },
];

const PREMIUM_FEATURES = [
  { label: 'Unlimited AI Chat', highlight: Bot },
  { label: 'Buyer/Seller Credibility Check', highlight: ShieldCheck },
  { label: 'ERP Access', highlight: LayoutDashboard },
  { label: 'Purchase Orders', highlight: ClipboardList },
  { label: 'Credit Notes' },
  { label: 'Debit Notes' },
  { label: 'Contract Drafting', highlight: FileSignature },
  { label: 'Proforma Invoice' },
  { label: 'Packing List' },
  { label: 'Commercial Invoice' },
].map((feature) => ({ ...feature, included: true }));

const BILLING_OPTIONS = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'sixMonth', label: '6 Months' },
  { id: 'yearly', label: 'Yearly' },
];

const BILLING_PLANS = {
  monthly: {
    price: '$55',
    originalPrice: '$63.25',
    priceSuffix: '/ month',
    savings: 'Save $8.25',
  },
  sixMonth: {
    price: '$237.50',
    originalPrice: '$285',
    priceSuffix: '/ 6 months',
    badge: '1 Month Free',
    savings: 'Save $47.50',
  },
  yearly: {
    price: '$500',
    originalPrice: '$665',
    priceSuffix: '/ year',
    badge: '2 Months Free',
    savings: 'Save $165',
  },
};

export default function Pricing() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [billingCycle, setBillingCycle] = useState('yearly');

  const handleGetStarted = useCallback(() => {
    navigate(isAuthenticated ? '/dashboard' : '/login');
  }, [isAuthenticated, navigate]);

  const premiumPlan = useMemo(() => BILLING_PLANS[billingCycle], [billingCycle]);

  return (
    <section className="pt-24 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-accent font-bold tracking-[0.2em] text-xs uppercase">Pricing</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mt-4 mb-6">
          Simple &amp; Transparent Pricing
        </h1>
        <p className="text-lg md:text-xl text-black/60 leading-relaxed">
          Choose the plan that fits your business growth. Start free and upgrade when you&apos;re
          ready to unlock Blinkus ERP, credibility verification, trade documentation, and
          unlimited AI assistance.
        </p>
      </div>

      <div className="flex justify-center mb-12 md:mb-16">
        <PricingToggle
          options={BILLING_OPTIONS}
          selected={billingCycle}
          onChange={setBillingCycle}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch max-w-4xl mx-auto">
        <PricingCard
          title="Free Plan"
          price="$0"
          priceSuffix="/ forever"
          ctaLabel="Get Started Free"
          onSelect={handleGetStarted}
        >
          <PricingFeatures features={FREE_FEATURES} />
        </PricingCard>

        <PricingCard
          title="Blinkus Premium"
          price={premiumPlan.price}
          originalPrice={premiumPlan.originalPrice}
          priceSuffix={premiumPlan.priceSuffix}
          badge={premiumPlan.badge}
          savingsLabel={premiumPlan.savings}
          highlighted
          ctaLabel="Get Started"
          onSelect={handleGetStarted}
        >
          <PricingFeatures features={PREMIUM_FEATURES} highlighted />
        </PricingCard>
      </div>
    </section>
  );
}
