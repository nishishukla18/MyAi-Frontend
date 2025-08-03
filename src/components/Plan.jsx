import React from 'react'
import { PricingTable } from '@clerk/clerk-react'

function Plan() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
          Choose Your Plan
        </h1>
        <p className="text-primary text-lg">Start for free and upgrade anytime</p>
      </div>

      <div className="w-full max-w-3xl">
        <PricingTable />
      </div>
    </div>
  )
}

export default Plan
