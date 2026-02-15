const { calculateSolarSizing, getMatchingVendors, formatNaira } = require('./solarLogic.js');

console.log('========================================');
console.log('   VENDOR MATCHING TEST');
console.log('========================================\n');

// Test scenarios
const testScenarios = [
  {
    name: "Chioma's Bakery in Lagos",
    monthlyBill: 225000,
    location: "Lagos"
  },
  {
    name: "Small Shop in Abuja",
    monthlyBill: 80000,
    location: "Abuja"
  },
  {
    name: "Large Manufacturing in Kano",
    monthlyBill: 650000,
    location: "Kano"
  }
];

testScenarios.forEach((scenario, index) => {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`TEST ${index + 1}: ${scenario.name}`);
  console.log('='.repeat(70));
  
  // Step 1: Calculate solar sizing
  console.log(`\n INPUT:`);
  console.log(`   Monthly Bill: ${formatNaira(scenario.monthlyBill)}`);
  console.log(`   Location: ${scenario.location}`);
  
  const sizing = calculateSolarSizing(scenario.monthlyBill);
  const requiredKw = sizing.systemSize.actualCapacityKW;
  
  console.log(`\n RECOMMENDED SYSTEM:`);
  console.log(`   System Size: ${requiredKw} kW`);
  console.log(`   Total Cost: ${formatNaira(sizing.costs.total)}`);
  console.log(`   Monthly Savings: ${formatNaira(sizing.financials.monthlySavings)}`);
  console.log(`   Payback Period: ${sizing.financials.paybackPeriodYears} years`);
  
  // Step 2: Find matching vendors
  console.log(`\n FINDING MATCHING VENDORS...`);
  const vendors = getMatchingVendors(requiredKw, scenario.location);
  
  if (vendors.length === 0) {
    console.log(`\n    No verified vendors found in ${scenario.location} for ${requiredKw}kW systems`);
  } else {
    console.log(`\n    Found ${vendors.length} matching vendor(s):\n`);
    
    vendors.forEach((vendor, idx) => {
      console.log(`   ${idx + 1}. ${vendor.company_name}`);
      console.log(`      Rating: ${'⭐'.repeat(Math.floor(vendor.rating))} ${vendor.rating}/5`);
      console.log(`      Headquarters: ${vendor.headquarters}`);
      console.log(`      System Range: ${vendor.system_capacity_range}`);
      console.log(`      Experience: ${vendor.years_in_business} years (${vendor.installations_completed} installations)`);
      console.log(`      Specialties: ${vendor.specialties.join(', ')}`);
      console.log(`      Response Time: ${vendor.avg_response_time}`);
      console.log(`      Why Recommended: ${vendor.recommended_for}`);
      console.log(`      Contact: ${vendor.phone} | ${vendor.email}`);
      console.log('');
    });
  }
});

console.log('\n' + '='.repeat(70));
console.log(' All vendor matching tests completed!');
console.log('='.repeat(70) + '\n');

// Additional test: Show all filtering logic
console.log('\n VENDOR DATABASE SUMMARY:\n');
const allVendors = require('./vendors.json');

console.log(`   Total Vendors: ${allVendors.length}`);
console.log(`   Verified Vendors: ${allVendors.filter(v => v.verification_status).length}`);
console.log(`   Unverified Vendors: ${allVendors.filter(v => !v.verification_status).length}`);
console.log(`   Average Rating: ${(allVendors.reduce((sum, v) => sum + v.rating, 0) / allVendors.length).toFixed(1)}`);

console.log(`\n   Vendors by Location:`);
const locationCounts = {};
allVendors.forEach(v => {
  const location = v.headquarters.split(',')[0].trim();
  locationCounts[location] = (locationCounts[location] || 0) + 1;
});

Object.entries(locationCounts).forEach(([location, count]) => {
  console.log(`      ${location}: ${count} vendor(s)`);
});

console.log('\n');