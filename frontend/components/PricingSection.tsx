// components/PricingSection.tsx

"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check } from 'lucide-react';
import { fetchYogaPricing, handleSubscribeNow, checkSubscriptionStatus } from '@/lib/subscriptionActions';
import { supabase } from '@/lib/supabase';
import { ScrollAnimation } from '@/components/ui/ScrollAnimation';



interface PricingPlan {
  id: number;
  region: string;
  plan_type: string;
  monthly_price: number;
  total_price: number;
  savings: number;
  currency: string;
  strike_price: number;
  discounted_monthly_price: number;
  discount_percentage: number;
}

const PricingSection: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState('India');
  const [selectedPlan, setSelectedPlan] = useState('Annual');
  const [pricingData, setPricingData] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPricingData() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchYogaPricing(selectedRegion);
        setPricingData(data);
      } catch (err) {
        console.error('Failed to fetch pricing data:', err);
        setError('Failed to load pricing plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    loadPricingData();
  }, [selectedRegion]);

  const handleSubscribeClick = async (planType: string, region: string) => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.log('User not logged in');
      // TODO: Implement redirection to login or show login modal
      return;
    }

    try {
      await handleSubscribeNow(user.id, planType, region);
      const status = await checkSubscriptionStatus(user.id);
      if (status === 'active') {
        // Show success message or redirect to a success page
        alert('Your subscription is now active!');
      } else {
        // Show pending message
        alert("our payment is being processed. We'll update you soon.");
      }
    } catch (error) {
      console.error('Subscription failed:', error);
      // Show error message to user
    }
  };

  return (
    <ScrollAnimation>
      <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-gray-800">Simple and Affordable Plans</h2>

          <div className="flex justify-center mb-8">
            <Tabs defaultValue="India" className="w-full max-w-[300px]" onValueChange={setSelectedRegion}>
              <TabsList className="grid w-full grid-cols-3 rounded-md bg-white p-1 text-gray-500 shadow-sm">
                <TabsTrigger value="India">India</TabsTrigger>
                <TabsTrigger value="Europe">Europe</TabsTrigger>
                <TabsTrigger value="US">US</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Loading pricing plans...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {pricingData.filter(plan => plan.region === selectedRegion).map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`flex flex-col ${selectedPlan === plan.plan_type ? 'border-2 border-primary' : ''}`}
                  onClick={() => setSelectedPlan(plan.plan_type)}
                >
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                      {plan.plan_type}
                      {plan.plan_type === 'Annual' && (
                        <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-primary rounded-full">
                          Most Popular
                        </span>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {plan.plan_type === 'Monthly' ? 'Billed monthly' : 
                       `Subscription time: ${plan.plan_type === 'Annual' ? '12 Months' : '6 Months'}`}
                    </p>
                    {plan.plan_type !== 'Monthly' && (
                      <p className="text-sm text-gray-600">Billed monthly</p>
                    )}
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow">
                    <div className="mb-4">
                      <p className="text-4xl font-bold mb-2 text-gray-800">
                        {plan.currency}{plan.discounted_monthly_price?.toFixed(2) || '0.00'}/month
                      </p>
                      {plan.plan_type === 'Monthly' ? (
                        <>
                          <p className="text-sm text-gray-500 mb-1">
                            <span className="line-through">Regular price: {plan.currency}{plan.monthly_price?.toFixed(2) || '0.00'}/month</span>
                          </p>
                          <p className="text-sm text-red-500 font-semibold">Limited Time Offer!</p>
                        </>
                      ) : (
                        <p className="text-sm text-green-600">
                          Save {plan.discount_percentage}% off regular price
                        </p>
                      )}
                    </div>
                    <ul className="space-y-2 mb-4 flex-grow">
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">All Inclusive</span>
                      </li>
                      {plan.plan_type === 'Monthly' && (
                        <>
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-600">5 days a week, 1 hour sessions</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-600">Zoom sessions with privacy</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-600">Hardcore stretching</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-600">Flexibility training</span>
                          </li>
                        </>
                      )}
                      {plan.plan_type === 'Annual' && (
                        <>
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-600">Best value for money</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-600">Great for consistent practitioners</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-600">Save compared to monthly plan</span>
                          </li>
                        </>
                      )}
                      {plan.plan_type === '6 Months' && (
                        <>
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-600">Discounted rate for 6 months</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-600">Great for Beginners</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-600">Save compared to monthly plan</span>
                          </li>
                        </>
                      )}
                    </ul>
                    <Button 
                      onClick={() => handleSubscribeClick(plan.plan_type, selectedRegion)} 
                      className="w-full"
                    >
                      Subscribe Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </ScrollAnimation>
  );
};

export default PricingSection;
