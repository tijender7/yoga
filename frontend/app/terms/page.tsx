'use client'

import { Card } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p>Welcome to YogForever. By using our service, you agree to these terms. Please read them carefully.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. User Accounts</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You must be at least 18 years old to use this service</li>
              <li>You must provide accurate and complete information when creating an account</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must notify us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Classes and Services</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Classes are provided on a scheduled basis</li>
              <li>We reserve the right to modify class schedules</li>
              <li>Classes may be recorded for quality and training purposes</li>
              <li>You agree not to share or redistribute class content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Payments and Refunds</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>All payments are processed securely through our payment partners</li>
              <li>Subscription fees are billed in advance</li>
              <li>Refunds are provided according to our refund policy</li>
              <li>We reserve the right to modify pricing with notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Health and Safety</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Consult your physician before starting any exercise program</li>
              <li>You are responsible for practicing within your physical limitations</li>
              <li>We are not liable for any injuries during practice</li>
              <li>Report any health concerns to your instructor</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </Card>
    </div>
  )
}