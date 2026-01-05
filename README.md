# n8n-nodes-easypost

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for EasyPost, the leading shipping API that aggregates 100+ carriers including USPS, UPS, FedEx, and DHL. Automate shipping workflows with label generation, rate shopping, real-time tracking, address verification, and insurance management.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![EasyPost API](https://img.shields.io/badge/EasyPost-Shipping%20API-green)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

## Features

- **Multi-Carrier Rate Shopping** - Compare rates across 100+ carriers in a single API call
- **Label Generation** - Create shipping labels in PDF, PNG, ZPL, and EPL2 formats
- **Real-Time Tracking** - Track shipments across all carriers with unified status updates
- **Address Verification** - Validate and standardize addresses before shipping
- **Insurance Management** - Add shipping insurance and manage claims
- **International Shipping** - Full customs documentation support for international shipments
- **Batch Processing** - Handle high-volume label generation efficiently
- **Pickup Scheduling** - Schedule carrier pickups directly from your workflow
- **Webhook Integration** - Receive real-time notifications for tracking updates and events

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** → **Community Nodes**
3. Select **Install**
4. Enter `n8n-nodes-easypost` in the input field
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-easypost

# Restart n8n
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-easypost.git
cd n8n-nodes-easypost

# Install dependencies
npm install

# Build the project
npm run build

# Link to n8n
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-easypost

# Restart n8n
n8n start
```

## Credentials Setup

### EasyPost API Credentials

| Field | Description |
|-------|-------------|
| **API Key** | Your EasyPost API key |

**API Key Types:**
- **Test Keys** (start with `EZTEST`): Use for development and testing. Creates test labels with no real postage charges.
- **Production Keys** (start with `EZPROD`): Use for live shipping. Real labels, real charges.

To get your API key:
1. Sign up at [EasyPost](https://www.easypost.com/)
2. Navigate to **Account Settings** → **API Keys**
3. Copy your Test or Production API key

## Resources & Operations

### Shipments

Create shipments, get rates, purchase labels, and manage the full shipping lifecycle.

| Operation | Description |
|-----------|-------------|
| Create | Create a new shipment and get available rates |
| Get | Retrieve a specific shipment |
| Get All | List all shipments with pagination |
| Buy | Purchase a label using a rate ID |
| Buy With Rate | Create and buy in a single call (one-call buy) |
| Convert Label | Convert label to a different format |
| Insure | Add insurance to a shipment |
| Refund | Request a refund for unused labels |
| Regenerate Rates | Get updated rates for a shipment |

### Addresses

Create, verify, and manage shipping addresses.

| Operation | Description |
|-----------|-------------|
| Create | Create a new address (optionally verify on creation) |
| Get | Retrieve an address by ID |
| Get All | List all addresses |
| Verify | Verify an existing address |

### Parcels

Define package dimensions and weights.

| Operation | Description |
|-----------|-------------|
| Create | Create a parcel with custom or predefined dimensions |
| Get | Retrieve a parcel by ID |

### Rates

Shop for the best shipping rates across carriers.

| Operation | Description |
|-----------|-------------|
| Get For Shipment | Get all available rates for a shipment |
| Get Smart Rates | Get rates with time-in-transit predictions |

### Trackers

Track shipments across all carriers with unified status updates.

| Operation | Description |
|-----------|-------------|
| Create | Create a tracker for any tracking number |
| Get | Retrieve tracker status |
| Get All | List all trackers |

### Insurance

Protect shipments with shipping insurance.

| Operation | Description |
|-----------|-------------|
| Create | Add insurance to a shipment |
| Get | Retrieve insurance details |
| Get All | List all insurance records |
| Refund | Request an insurance refund |

### Customs Info

Handle international shipping documentation.

| Operation | Description |
|-----------|-------------|
| Create | Create customs declaration with items |
| Get | Retrieve customs info |

### Customs Items

Define individual items for customs declarations.

| Operation | Description |
|-----------|-------------|
| Create | Create a customs item |
| Get | Retrieve a customs item |

### Batches

Process high volumes of shipments efficiently.

| Operation | Description |
|-----------|-------------|
| Create | Create a new batch |
| Get | Retrieve batch status |
| Get All | List all batches |
| Add Shipments | Add shipments to a batch |
| Remove Shipments | Remove shipments from a batch |
| Buy | Purchase all labels in a batch |
| Create Scan Form | Generate a SCAN form for the batch |

### Scan Forms

Create USPS SCAN forms for batch manifesting.

| Operation | Description |
|-----------|-------------|
| Create | Create a scan form from shipments |
| Get | Retrieve a scan form |
| Get All | List all scan forms |

### Pickups

Schedule carrier pickups for your shipments.

| Operation | Description |
|-----------|-------------|
| Create | Schedule a pickup |
| Get | Retrieve pickup details |
| Buy | Purchase/confirm a pickup |
| Cancel | Cancel a scheduled pickup |

### Carrier Accounts

Manage your carrier account connections.

| Operation | Description |
|-----------|-------------|
| Create | Connect a new carrier account |
| Get | Retrieve carrier account details |
| Get All | List all carrier accounts |
| Update | Update carrier credentials |
| Delete | Remove a carrier account |

### Webhooks

Receive real-time notifications for shipping events.

| Operation | Description |
|-----------|-------------|
| Create | Create a webhook endpoint |
| Get | Retrieve webhook configuration |
| Get All | List all webhooks |
| Update | Update webhook URL or settings |
| Delete | Remove a webhook |

## Usage Examples

### Basic Shipment Creation

```javascript
// Create a shipment and get rates
{
  "resource": "shipment",
  "operation": "create",
  "toAddress": {
    "name": "Jane Smith",
    "street1": "417 Montgomery St",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94104",
    "country": "US"
  },
  "fromAddress": {
    "name": "John Doe",
    "company": "Acme Corp",
    "street1": "123 Main St",
    "city": "Austin",
    "state": "TX",
    "zip": "78701",
    "country": "US"
  },
  "parcel": {
    "length": 10,
    "width": 8,
    "height": 4,
    "weight": 16
  }
}
```

### One-Call Buy (Create + Purchase)

```javascript
// Create shipment and buy label in one step
{
  "resource": "shipment",
  "operation": "buyWithRate",
  "carrier": "USPS",
  "service": "Priority",
  // ... address and parcel fields
}
```

### Rate Shopping

```javascript
// Get rates from all carriers, then filter
{
  "resource": "rate",
  "operation": "getForShipment",
  "shipmentId": "shp_abc123",
  "filterByCarrier": "USPS"
}
```

### Real-Time Tracking

```javascript
// Create a tracker for any carrier
{
  "resource": "tracker",
  "operation": "create",
  "trackingCode": "9400111899223456789012",
  "carrier": "USPS"
}
```

### International Shipment with Customs

```javascript
// Create customs info for international shipping
{
  "resource": "customsInfo",
  "operation": "create",
  "certify": true,
  "signer": "John Doe",
  "contentsType": "merchandise",
  "customsItems": [
    {
      "description": "T-Shirts",
      "quantity": 5,
      "value": 25.00,
      "weight": 8,
      "hsTariffNumber": "6109.10",
      "originCountry": "US"
    }
  ]
}
```

## Shipping Concepts

### Rate Shopping
EasyPost aggregates rates from all connected carriers, allowing you to compare prices and delivery times in a single API call. The returned rates include retail and negotiated pricing when available.

### Label Formats
- **PDF**: Best for printing on standard printers
- **PNG**: Image format for digital display
- **ZPL**: Zebra Programming Language for thermal printers
- **EPL2**: Eltron Programming Language for thermal printers

### Predefined Packages
Common carrier packages are available as predefined options:
- USPS: FlatRateEnvelope, SmallFlatRateBox, MediumFlatRateBox, LargeFlatRateBox
- FedEx: FedExEnvelope, FedExPak, FedExBox
- UPS: UPSLetter, UPSExpressBox

### SmartRates
SmartRates provide delivery time predictions based on historical data, offering confidence percentiles (50%, 75%, 90%, etc.) for estimated delivery.

## Error Handling

The node provides detailed error information from EasyPost:

- **ADDRESS.VERIFICATION.FAILURE**: Address could not be verified
- **RATE.UNAVAILABLE**: No rates available for the shipment
- **SHIPMENT.POSTAGE.FAILURE**: Label purchase failed
- **TRACKER.CREATE.ERROR**: Tracking number not recognized

Errors include specific field information when available, helping identify exactly what needs to be corrected.

## Security Best Practices

1. **Use Test Keys in Development**: Always use `EZTEST` keys during development to avoid accidental charges
2. **Secure Your API Keys**: Never expose API keys in client-side code or logs
3. **Validate Addresses**: Use address verification before creating shipments to reduce failed deliveries
4. **Webhook Secrets**: Configure webhook secrets to verify incoming webhook payloads

## Development

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build the project
npm run build

# Watch mode for development
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-easypost/issues)
- **Documentation**: [EasyPost API Docs](https://www.easypost.com/docs/api)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io/)

## Acknowledgments

- [EasyPost](https://www.easypost.com/) for their comprehensive shipping API
- [n8n](https://n8n.io/) for the powerful workflow automation platform
- The n8n community for their support and feedback
