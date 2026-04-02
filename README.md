# n8n-nodes-easypost

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with EasyPost's shipping and logistics API. This node provides access to 10 core resources including address validation, shipment creation, rate comparison, package tracking, and customs documentation. Streamline your shipping workflows with comprehensive parcel management and real-time tracking capabilities.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Shipping](https://img.shields.io/badge/Shipping-API-green)
![Logistics](https://img.shields.io/badge/Logistics-Integration-orange)
![Tracking](https://img.shields.io/badge/Package-Tracking-purple)

## Features

**Address Validation** - Verify and standardize shipping addresses with comprehensive validation and suggestion capabilities

**Shipment Management** - Create, retrieve, and manage shipments with full lifecycle support and label generation

**Rate Comparison** - Compare shipping rates across multiple carriers to find the most cost-effective options

**Package Tracking** - Real-time tracking of shipments with detailed status updates and delivery confirmations

**Batch Processing** - Handle multiple shipments efficiently with batch creation and bulk operations

**Customs Documentation** - Generate and manage customs forms for international shipping compliance

**Insurance Integration** - Add shipping insurance with flexible coverage options and claims management

**Event Monitoring** - Track shipping events and status changes with webhook support and real-time notifications

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-easypost`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-easypost
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-easypost.git
cd n8n-nodes-easypost
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-easypost
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your EasyPost API key (test or production) | Yes |
| Environment | Select test or production environment | Yes |

## Resources & Operations

### 1. Address

| Operation | Description |
|-----------|-------------|
| Create | Create and validate a new address |
| Get | Retrieve an existing address by ID |
| Verify | Verify and get suggestions for an address |
| List | List all addresses in your account |

### 2. Parcel

| Operation | Description |
|-----------|-------------|
| Create | Create a new parcel with dimensions and weight |
| Get | Retrieve an existing parcel by ID |
| List | List all parcels in your account |

### 3. Shipment

| Operation | Description |
|-----------|-------------|
| Create | Create a new shipment with addresses and parcel |
| Get | Retrieve an existing shipment by ID |
| Buy | Purchase a shipping label for a shipment |
| Regenerate | Regenerate tracking codes for a shipment |
| List | List all shipments in your account |

### 4. Rate

| Operation | Description |
|-----------|-------------|
| Get | Retrieve a specific rate by ID |
| List | List all available rates for a shipment |

### 5. Tracker

| Operation | Description |
|-----------|-------------|
| Create | Create a new tracker for a tracking code |
| Get | Retrieve an existing tracker by ID |
| List | List all trackers in your account |
| Update | Update tracker information |

### 6. Batch

| Operation | Description |
|-----------|-------------|
| Create | Create a new batch for multiple shipments |
| Get | Retrieve an existing batch by ID |
| Buy | Purchase labels for all shipments in a batch |
| Generate Label | Generate consolidated labels for a batch |
| List | List all batches in your account |

### 7. CustomsItem

| Operation | Description |
|-----------|-------------|
| Create | Create a new customs item declaration |
| Get | Retrieve an existing customs item by ID |
| List | List all customs items in your account |

### 8. CustomsInfo

| Operation | Description |
|-----------|-------------|
| Create | Create customs information for international shipments |
| Get | Retrieve existing customs information by ID |
| List | List all customs info records in your account |

### 9. Insurance

| Operation | Description |
|-----------|-------------|
| Create | Create insurance coverage for a shipment |
| Get | Retrieve existing insurance information by ID |
| List | List all insurance records in your account |

### 10. Event

| Operation | Description |
|-----------|-------------|
| Get | Retrieve a specific event by ID |
| List | List all events in your account |
| Retrieve Payload | Get the full payload for a webhook event |

## Usage Examples

```javascript
// Create and validate an address
{
  "street1": "354 Main St",
  "street2": "Suite 100",
  "city": "San Francisco",
  "state": "CA",
  "zip": "94105",
  "country": "US",
  "company": "EasyPost",
  "phone": "415-456-7890"
}
```

```javascript
// Create a shipment with rate comparison
{
  "to_address": {
    "name": "John Doe",
    "street1": "417 Montgomery Street",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94104",
    "country": "US"
  },
  "from_address": {
    "name": "Jane Smith", 
    "street1": "354 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94105",
    "country": "US"
  },
  "parcel": {
    "length": 10,
    "width": 8,
    "height": 4,
    "weight": 15
  }
}
```

```javascript
// Track a package by tracking code
{
  "tracking_code": "EZ1000000001",
  "carrier": "USPS"
}
```

```javascript
// Create customs information for international shipping
{
  "customs_certify": true,
  "customs_signer": "John Doe",
  "contents_type": "merchandise",
  "contents_explanation": "T-shirt purchase",
  "eel_pfc": "NOEEI 30.37(a)",
  "non_delivery_option": "abandon",
  "restriction_type": "none",
  "customs_items": [
    {
      "description": "T-shirt",
      "quantity": 1,
      "value": 25.00,
      "weight": 5,
      "origin_country": "US",
      "hs_tariff_number": "6109.10.0012"
    }
  ]
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | The provided API key is invalid or expired | Verify your API key in EasyPost dashboard and update credentials |
| Address Validation Failed | The provided address could not be validated | Check address format and use address verification before shipment creation |
| Insufficient Postage | The selected rate is no longer available | Refresh rates and select a currently available option |
| Tracking Not Found | The tracking code does not exist or is invalid | Verify tracking code format and ensure it has been generated |
| Rate Limit Exceeded | Too many API requests in a short period | Implement exponential backoff and respect rate limiting |
| Invalid Parcel Dimensions | Parcel dimensions exceed carrier limits | Check carrier restrictions and adjust package dimensions |

## Development

```bash
npm install
npm run build
npm test
npm run lint
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

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-easypost/issues)
- **EasyPost API Documentation**: [EasyPost API Docs](https://www.easypost.com/docs/api)
- **EasyPost Developer Community**: [EasyPost Support](https://support.easypost.com)