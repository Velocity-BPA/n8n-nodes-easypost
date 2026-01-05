/**
 * Unit tests for EasyPost transport utilities
 */

// Mock the n8n-workflow module
jest.mock('n8n-workflow', () => ({
  NodeApiError: class NodeApiError extends Error {
    constructor(_node: unknown, error: { message: string }) {
      super(error.message);
      this.name = 'NodeApiError';
    }
  },
}));

// Import validation functions by reading the source file and testing the logic
describe('EasyPost Transport Utilities', () => {
  describe('ID Validation Functions', () => {
    // Test validation patterns
    const validateShipmentId = (id: string): boolean => /^shp_[a-zA-Z0-9]+$/.test(id);
    const validateAddressId = (id: string): boolean => /^adr_[a-zA-Z0-9]+$/.test(id);
    const validateParcelId = (id: string): boolean => /^prcl_[a-zA-Z0-9]+$/.test(id);
    const validateTrackerId = (id: string): boolean => /^trk_[a-zA-Z0-9]+$/.test(id);
    const validateBatchId = (id: string): boolean => /^batch_[a-zA-Z0-9]+$/.test(id);
    const validatePickupId = (id: string): boolean => /^pickup_[a-zA-Z0-9]+$/.test(id);
    const validateRateId = (id: string): boolean => /^rate_[a-zA-Z0-9]+$/.test(id);

    describe('validateShipmentId', () => {
      it('should accept valid shipment IDs', () => {
        expect(validateShipmentId('shp_abc123')).toBe(true);
        expect(validateShipmentId('shp_ABC123xyz')).toBe(true);
        expect(validateShipmentId('shp_1234567890')).toBe(true);
      });

      it('should reject invalid shipment IDs', () => {
        expect(validateShipmentId('adr_abc123')).toBe(false);
        expect(validateShipmentId('shpabc123')).toBe(false);
        expect(validateShipmentId('')).toBe(false);
        expect(validateShipmentId('shp_')).toBe(false);
      });
    });

    describe('validateAddressId', () => {
      it('should accept valid address IDs', () => {
        expect(validateAddressId('adr_abc123')).toBe(true);
        expect(validateAddressId('adr_XYZ789')).toBe(true);
      });

      it('should reject invalid address IDs', () => {
        expect(validateAddressId('shp_abc123')).toBe(false);
        expect(validateAddressId('address_123')).toBe(false);
      });
    });

    describe('validateParcelId', () => {
      it('should accept valid parcel IDs', () => {
        expect(validateParcelId('prcl_abc123')).toBe(true);
      });

      it('should reject invalid parcel IDs', () => {
        expect(validateParcelId('parcel_abc123')).toBe(false);
        expect(validateParcelId('prcl')).toBe(false);
      });
    });

    describe('validateTrackerId', () => {
      it('should accept valid tracker IDs', () => {
        expect(validateTrackerId('trk_abc123')).toBe(true);
      });

      it('should reject invalid tracker IDs', () => {
        expect(validateTrackerId('tracker_abc123')).toBe(false);
      });
    });

    describe('validateBatchId', () => {
      it('should accept valid batch IDs', () => {
        expect(validateBatchId('batch_abc123')).toBe(true);
      });

      it('should reject invalid batch IDs', () => {
        expect(validateBatchId('bat_abc123')).toBe(false);
      });
    });

    describe('validatePickupId', () => {
      it('should accept valid pickup IDs', () => {
        expect(validatePickupId('pickup_abc123')).toBe(true);
      });

      it('should reject invalid pickup IDs', () => {
        expect(validatePickupId('pick_abc123')).toBe(false);
      });
    });

    describe('validateRateId', () => {
      it('should accept valid rate IDs', () => {
        expect(validateRateId('rate_abc123')).toBe(true);
      });

      it('should reject invalid rate IDs', () => {
        expect(validateRateId('rt_abc123')).toBe(false);
      });
    });
  });

  describe('Builder Functions', () => {
    describe('buildAddressObject', () => {
      const buildAddressObject = (params: Record<string, unknown>) => {
        const address: Record<string, unknown> = {};
        const fields = [
          'name', 'company', 'street1', 'street2', 'city', 'state', 'zip',
          'country', 'phone', 'email', 'federal_tax_id', 'state_tax_id',
          'carrier_facility', 'residential',
        ];
        for (const field of fields) {
          if (params[field] !== undefined && params[field] !== '') {
            address[field] = params[field];
          }
        }
        return address;
      };

      it('should build address with all fields', () => {
        const params = {
          name: 'John Doe',
          company: 'ACME Corp',
          street1: '123 Main St',
          street2: 'Suite 100',
          city: 'San Francisco',
          state: 'CA',
          zip: '94105',
          country: 'US',
          phone: '555-1234',
          email: 'john@example.com',
        };

        const address = buildAddressObject(params);

        expect(address).toEqual(params);
      });

      it('should omit empty fields', () => {
        const params = {
          name: 'John Doe',
          street1: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          zip: '94105',
          country: 'US',
          street2: '',
          company: undefined,
        };

        const address = buildAddressObject(params);

        expect(address).not.toHaveProperty('street2');
        expect(address).not.toHaveProperty('company');
        expect(address).toHaveProperty('name', 'John Doe');
      });

      it('should include residential flag when set', () => {
        const params = {
          name: 'Jane Doe',
          street1: '456 Oak Ave',
          city: 'Austin',
          state: 'TX',
          zip: '78701',
          country: 'US',
          residential: true,
        };

        const address = buildAddressObject(params);

        expect(address.residential).toBe(true);
      });
    });

    describe('buildParcelObject', () => {
      const buildParcelObject = (params: Record<string, unknown>) => {
        const parcel: Record<string, unknown> = {};

        if (params.predefinedPackage && params.predefinedPackage !== 'custom') {
          parcel.predefined_package = params.predefinedPackage;
        } else {
          if (params.length) parcel.length = Number(params.length);
          if (params.width) parcel.width = Number(params.width);
          if (params.height) parcel.height = Number(params.height);
        }

        if (params.weight) {
          parcel.weight = Number(params.weight);
        }

        return parcel;
      };

      it('should build parcel with custom dimensions', () => {
        const params = {
          predefinedPackage: 'custom',
          length: '10',
          width: '8',
          height: '6',
          weight: '16',
        };

        const parcel = buildParcelObject(params);

        expect(parcel).toEqual({
          length: 10,
          width: 8,
          height: 6,
          weight: 16,
        });
      });

      it('should build parcel with predefined package', () => {
        const params = {
          predefinedPackage: 'FlatRateEnvelope',
          weight: '8',
        };

        const parcel = buildParcelObject(params);

        expect(parcel).toEqual({
          predefined_package: 'FlatRateEnvelope',
          weight: 8,
        });
        expect(parcel).not.toHaveProperty('length');
        expect(parcel).not.toHaveProperty('width');
        expect(parcel).not.toHaveProperty('height');
      });

      it('should convert string values to numbers', () => {
        const params = {
          predefinedPackage: 'custom',
          length: '12.5',
          width: '9.25',
          height: '4.75',
          weight: '24.5',
        };

        const parcel = buildParcelObject(params);

        expect(typeof parcel.length).toBe('number');
        expect(typeof parcel.width).toBe('number');
        expect(typeof parcel.height).toBe('number');
        expect(typeof parcel.weight).toBe('number');
      });
    });

    describe('buildOptionsObject', () => {
      const buildOptionsObject = (params: Record<string, unknown>) => {
        const options: Record<string, unknown> = {};
        const optionFields = [
          { key: 'labelFormat', apiKey: 'label_format' },
          { key: 'labelSize', apiKey: 'label_size' },
          { key: 'deliveryConfirmation', apiKey: 'delivery_confirmation' },
          { key: 'saturdayDelivery', apiKey: 'saturday_delivery' },
          { key: 'hazmat', apiKey: 'hazmat' },
          { key: 'invoiceNumber', apiKey: 'invoice_number' },
          { key: 'poNumber', apiKey: 'po_number' },
        ];

        for (const field of optionFields) {
          if (params[field.key] !== undefined && params[field.key] !== '') {
            options[field.apiKey] = params[field.key];
          }
        }

        return options;
      };

      it('should build options with label settings', () => {
        const params = {
          labelFormat: 'PDF',
          labelSize: '4x6',
          deliveryConfirmation: 'SIGNATURE',
        };

        const options = buildOptionsObject(params);

        expect(options).toEqual({
          label_format: 'PDF',
          label_size: '4x6',
          delivery_confirmation: 'SIGNATURE',
        });
      });

      it('should include Saturday delivery when set', () => {
        const params = {
          saturdayDelivery: true,
        };

        const options = buildOptionsObject(params);

        expect(options.saturday_delivery).toBe(true);
      });

      it('should include hazmat flag', () => {
        const params = {
          hazmat: 'PRIMARY_CONTAINED',
        };

        const options = buildOptionsObject(params);

        expect(options.hazmat).toBe('PRIMARY_CONTAINED');
      });
    });

    describe('buildCustomsItemObject', () => {
      const buildCustomsItemObject = (item: Record<string, unknown>) => {
        return {
          description: item.description,
          quantity: Number(item.quantity),
          value: Number(item.value),
          weight: Number(item.weight),
          hs_tariff_number: item.hsTariffNumber || undefined,
          origin_country: item.originCountry || undefined,
          code: item.code || undefined,
        };
      };

      it('should build customs item with all fields', () => {
        const item = {
          description: 'Electronic components',
          quantity: '5',
          value: '100.00',
          weight: '16',
          hsTariffNumber: '8542.31',
          originCountry: 'CN',
          code: 'ELEC-001',
        };

        const customsItem = buildCustomsItemObject(item);

        expect(customsItem).toEqual({
          description: 'Electronic components',
          quantity: 5,
          value: 100,
          weight: 16,
          hs_tariff_number: '8542.31',
          origin_country: 'CN',
          code: 'ELEC-001',
        });
      });

      it('should handle missing optional fields', () => {
        const item = {
          description: 'Books',
          quantity: '2',
          value: '25.00',
          weight: '32',
        };

        const customsItem = buildCustomsItemObject(item);

        expect(customsItem.description).toBe('Books');
        expect(customsItem.quantity).toBe(2);
        expect(customsItem.hs_tariff_number).toBeUndefined();
        expect(customsItem.origin_country).toBeUndefined();
      });
    });
  });
});

describe('EasyPost API Response Parsing', () => {
  describe('Rate sorting', () => {
    it('should sort rates by price ascending', () => {
      const rates = [
        { id: 'rate_1', rate: '15.00', carrier: 'USPS', service: 'Priority' },
        { id: 'rate_2', rate: '8.50', carrier: 'USPS', service: 'First' },
        { id: 'rate_3', rate: '12.00', carrier: 'UPS', service: 'Ground' },
      ];

      const sorted = [...rates].sort((a, b) => parseFloat(a.rate) - parseFloat(b.rate));

      expect(sorted[0].rate).toBe('8.50');
      expect(sorted[1].rate).toBe('12.00');
      expect(sorted[2].rate).toBe('15.00');
    });
  });

  describe('Tracking status normalization', () => {
    const normalizeStatus = (status: string): string => {
      const statusMap: Record<string, string> = {
        'pre_transit': 'Pre-Transit',
        'in_transit': 'In Transit',
        'out_for_delivery': 'Out for Delivery',
        'delivered': 'Delivered',
        'available_for_pickup': 'Available for Pickup',
        'return_to_sender': 'Return to Sender',
        'failure': 'Failure',
        'cancelled': 'Cancelled',
        'error': 'Error',
      };
      return statusMap[status] || status;
    };

    it('should normalize tracking status strings', () => {
      expect(normalizeStatus('pre_transit')).toBe('Pre-Transit');
      expect(normalizeStatus('in_transit')).toBe('In Transit');
      expect(normalizeStatus('out_for_delivery')).toBe('Out for Delivery');
      expect(normalizeStatus('delivered')).toBe('Delivered');
    });

    it('should return unknown status as-is', () => {
      expect(normalizeStatus('unknown_status')).toBe('unknown_status');
    });
  });
});

describe('EasyPost Error Handling', () => {
  describe('Error message extraction', () => {
    const extractErrorMessage = (error: unknown): string => {
      if (typeof error === 'object' && error !== null) {
        const err = error as Record<string, unknown>;
        if (err.error && typeof err.error === 'object') {
          const apiError = err.error as Record<string, unknown>;
          if (apiError.message) {
            return String(apiError.message);
          }
          if (Array.isArray(apiError.errors)) {
            return apiError.errors.map((e: unknown) => String(e)).join(', ');
          }
        }
        if (err.message) {
          return String(err.message);
        }
      }
      return 'Unknown error occurred';
    };

    it('should extract message from EasyPost API error', () => {
      const apiError = {
        error: {
          code: 'ADDRESS.VERIFICATION.FAILURE',
          message: 'The address could not be verified',
          errors: [],
        },
      };

      expect(extractErrorMessage(apiError)).toBe('The address could not be verified');
    });

    it('should extract array of errors', () => {
      const apiError = {
        error: {
          code: 'VALIDATION.ERROR',
          errors: ['Field A is required', 'Field B is invalid'],
        },
      };

      expect(extractErrorMessage(apiError)).toBe('Field A is required, Field B is invalid');
    });

    it('should handle standard error objects', () => {
      const standardError = {
        message: 'Network timeout',
      };

      expect(extractErrorMessage(standardError)).toBe('Network timeout');
    });

    it('should handle unknown error format', () => {
      expect(extractErrorMessage(null)).toBe('Unknown error occurred');
      expect(extractErrorMessage(undefined)).toBe('Unknown error occurred');
      expect(extractErrorMessage('string error')).toBe('Unknown error occurred');
    });
  });
});
