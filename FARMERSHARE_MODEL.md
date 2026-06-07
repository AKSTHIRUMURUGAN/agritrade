# Farmer Share Model Documentation

## Overview
The FarmerShare model is designed for the Agri Trade platform to enable investors to buy shares in agricultural projects, helping farmers reduce debt while earning returns on investments.

## Model Structure

### Farmer Information
- `farmerName` (String, required) - Name of the farmer
- `farmerImage` (String) - Profile image URL
- `farmerLocation` (String) - Farmer's location
- `farmerContact` (String) - Contact information
- `farmerExperience` (Number) - Years of farming experience

### Farm Details
- `farmName` (String) - Name of the farm
- `farmLocation` (String, required) - Farm location
- `farmSize` (Number) - Size in acres
- `farmImages` (Array of Strings) - Farm photos
- `cropType` (String, required) - Type of crop being grown
- `seedVariety` (String) - Specific seed variety
- `farmingMethod` (String) - organic, conventional, hydroponic, or mixed

### Share Information
- `totalShares` (Number, required) - Total shares available
- `availableShares` (Number, required) - Remaining shares for purchase
- `pricePerShare` (Number, required) - Price per share in rupees
- `minimumShares` (Number) - Minimum shares to purchase (default: 1)

### Investment Tracking
- `totalInvestmentRaised` (Number) - Total amount raised
- `targetAmount` (Number) - Funding goal
- `investors` (Array) - List of investors with:
  - `userId` (String, required)
  - `userName` (String)
  - `sharesOwned` (Number, required)
  - `investmentAmount` (Number, required)
  - `investmentDate` (Date)
  - `returnAmount` (Number)
  - `status` (String) - active, completed, or withdrawn

### Project Timeline
- `projectStartDate` (Date) - Project start
- `projectEndDate` (Date) - Project end
- `duration` (Number) - Duration in months
- `harvestDate` (Date) - Expected harvest date

### Financial Details
- `expectedReturn` (Number) - Expected return percentage
- `actualReturn` (Number) - Actual return achieved
- `profitLossMargin` (Number) - Profit/loss margin
- `insuranceCovered` (Boolean) - Insurance status

### Verification & Trust
- `soilTestReport` (Boolean) - Soil test completed
- `documentVerified` (Boolean) - Documents verified
- `kycVerified` (Boolean) - KYC completed
- `landOwnershipVerified` (Boolean) - Land ownership verified
- `governmentApproved` (Boolean) - Government approval status

### Rating & Performance
- `ranking` (Number) - Rating from 1-5 stars
- `previousProjectsCompleted` (Number) - Past projects
- `successRate` (Number) - Success rate percentage

### Status
- `status` (String) - open, funding, in-progress, harvesting, completed, or closed
- `assured` (Boolean) - Assured returns flag

### Additional Features
- `description` (String) - Project description
- `riskFactors` (Array of Strings) - Risk factors
- `milestones` (Array) - Project milestones
- `updates` (Array) - Project updates with images

## API Endpoints

### GET /api/farmershare
Fetch all farmer shares with optional filters:
- Query params: `status`, `cropType`

### POST /api/farmershare
Create a new farmer share project

### GET /api/farmershare/[id]
Get details of a specific farmer share

### PUT /api/farmershare/[id]
Update farmer share details

### DELETE /api/farmershare/[id]
Delete a farmer share

### POST /api/farmershare/invest
Invest in a farmer share project
- Required: `farmerShareId`, `userId`, `userName`, `sharesOwned`

## Pages

### /farmershares
List all farmer share opportunities

### /farmershares/[id]
View detailed information about a specific farmer share

### /addFarmerShare
Form to create a new farmer share project

## Key Features

1. **Automatic Calculations**: Available shares and total investment are calculated automatically
2. **Investor Tracking**: Complete history of all investors and their investments
3. **Status Management**: Automatic status updates based on funding progress
4. **Verification System**: Multiple verification checkpoints for trust
5. **Milestone Tracking**: Track project progress with milestones
6. **Updates System**: Keep investors informed with regular updates

## Usage Example

```javascript
// Create a new farmer share
const newShare = await FarmerShare.create({
  farmerName: "Ramesh Kumar",
  farmLocation: "Punjab, India",
  cropType: "Wheat",
  totalShares: 1000,
  availableShares: 1000,
  pricePerShare: 500,
  expectedReturn: 18,
  duration: 6,
  status: "open"
});

// Invest in a farmer share
const investment = {
  farmerShareId: "share_id",
  userId: "user_123",
  userName: "John Doe",
  sharesOwned: 10
};
```

## Business Model

- Investors buy shares in agricultural projects
- Farmers receive immediate funding to reduce debt
- After harvest, profits are distributed:
  - 60% to investors (based on share ownership)
  - 40% to farmers
- Platform helps prevent farmer suicides by providing financial relief
- Creates sustainable income for farming families

## Future Enhancements

1. Integration with payment gateways
2. Real-time notifications for updates
3. Mobile app support
4. Advanced analytics dashboard
5. Automated profit distribution
6. Insurance integration
7. Weather data integration
8. Market price tracking
