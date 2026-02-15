SunFi is a solar intelligence engine designed to help African SMEs:

Estimate the right solar system size

Understand true system costs & ROI

Compare Solar vs Diesel

Connect with verified solar vendors

Submit and track quote requests

SunFi removes guesswork from solar adoption by turning a simple input (monthly electricity bill) into a complete technical and financial analysis.

Problem We’re Solving

SMEs in Nigeria and across Africa face:

High diesel costs

Unstable grid power

Overpriced or undersized solar systems

Unverified installers

No clear ROI breakdown

SunFi standardizes solar calculations and connects businesses to trusted, vetted installers.
Core Engine Architecture

SunFi is built around a modular solar logic engine:

1️⃣ Solar Sizing Engine

File: solarLogic.js

Calculates:

Daily & monthly energy consumption

Recommended system size (kW)

Number of panels

Inverter capacity (kVA)

Battery requirements

Total installation cost

Monthly savings

Payback period

25-year ROI

Uses realistic Nigerian assumptions:

5 peak sun hours

400W panels

48V hybrid inverter systems

12-hour battery backup

Professional Validation Layer

Function: validateInput(monthlyBill)

Protects the system from:

Null / undefined values

Negative or zero bills

Industrial-scale loads

Unrealistic SME usage

Includes:

Error blocking

Smart warnings

Range classification
Solar vs Diesel Comparison

Function: generateCostComparison()

10-year projection comparing:

Solar investment + maintenance

Generator purchase + fuel inflation

Cumulative cost curves

Accounts for:

10% annual diesel inflation

Fuel consumption modeling

Maintenance assumptions

Verified Vendor Matching System

Function: getMatchingVendors(requiredKw, userLocation)

Filters vendors by:

✅ Verification status

📍 Location coverage

⚡ System capacity range

⭐ Rating

📊 Experience

Includes a Location Guard system that:

Prevents invalid regions

Suggests available cities

Provides clear messaging

Quote Request System

Function: saveQuoteRequest(userData, vendorId, sizingResult)

Generates unique Quote ID

Stores requests in quote_requests.json

Attaches system details

Sends structured vendor information

Test Coverage

Run:

node testSolarLogic.js


Includes:

✅ 3 standard SME test cases

✅ 7 edge case stress tests

✅ 5 location guard tests

✅ 1 full end-to-end workflow

Workflow tested:

Validation → Sizing → Vendor Match → Quote Submission

📊 Example Use Case

Scenario: Chioma’s Bakery (Lagos)

Input:

Monthly Bill: ₦225,000


Output:

Recommended system size

Equipment breakdown

Total investment cost

Monthly savings

ROI projection

Verified Lagos installers

Instant quote submission

🌍 Supported Locations

Currently supports vendor matching in:

Lagos

Abuja

Kano

Port Harcourt

Kigali

Ouagadougou

(Expandable via vendor onboarding)

🛠 Tech Stack

Node.js (CommonJS)

JSON-based vendor database

File-based quote storage

Modular logic architecture

Calculation-driven financial modeling

🔮 Future Roadmap

REST API layer

Frontend dashboard (React / Next.js)

Vendor onboarding portal

Real-time pricing updates

Carbon savings calculator

Embedded financing calculator

Mobile-first SME interface

💡 Vision

SunFi aims to become:

The trusted solar intelligence infrastructure for African businesses.

We are building:

A marketplace

A decision engine

A verification layer

A financial modeling tool

All in one ecosystem.

📜 License

MIT License (Recommended)

👩🏽‍💼 Founder

Built as part of a capstone innovation project focused on sustainable energy infrastructure for African SMEs.

