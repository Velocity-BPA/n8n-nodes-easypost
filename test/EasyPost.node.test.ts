/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { EasyPost } from '../nodes/EasyPost/EasyPost.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('EasyPost Node', () => {
  let node: EasyPost;

  beforeAll(() => {
    node = new EasyPost();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('EasyPost');
      expect(node.description.name).toBe('easypost');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 10 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(10);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(10);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Address Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should create an address successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createAddress')
      .mockReturnValueOnce('123 Main St')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('New York')
      .mockReturnValueOnce('NY')
      .mockReturnValueOnce('10001')
      .mockReturnValueOnce('US')
      .mockReturnValueOnce('John Doe')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(false);

    const mockResponse = { id: 'adr_123', street1: '123 Main St' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.easypost.com/v2/addresses',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: {
        address: {
          street1: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'US',
          name: 'John Doe',
        }
      },
      json: true,
    });
  });

  it('should get an address successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAddress')
      .mockReturnValueOnce('adr_123');

    const mockResponse = { id: 'adr_123', street1: '123 Main St' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.easypost.com/v2/addresses/adr_123',
      headers: {
        'Authorization': 'Bearer test-key',
      },
      json: true,
    });
  });

  it('should list addresses successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listAddresses')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(20);

    const mockResponse = { addresses: [{ id: 'adr_123' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.easypost.com/v2/addresses?page_size=20',
      headers: {
        'Authorization': 'Bearer test-key',
      },
      json: true,
    });
  });

  it('should verify an address successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('verifyAddress')
      .mockReturnValueOnce('adr_123');

    const mockResponse = { id: 'adr_123', verifications: { delivery: { success: true } } };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.easypost.com/v2/addresses/adr_123/verify',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should handle API errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAddress').mockReturnValueOnce('invalid_id');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Not found'));

    const result = await executeAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result[0].json.error).toBe('Not found');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAddress').mockReturnValueOnce('invalid_id');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Not found'));

    await expect(executeAddressOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Not found');
  });
});

describe('Parcel Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.easypost.com/v2' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  test('createParcel operation should create a parcel successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createParcel')
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(16)
      .mockReturnValueOnce('');

    const mockParcel = { id: 'prcl_123', length: 10, width: 5, height: 3, weight: 16 };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockParcel);

    const result = await executeParcelOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockParcel, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.easypost.com/v2/parcels',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: { 
        parcel: { 
          length: 10, 
          width: 5, 
          height: 3, 
          weight: 16 
        } 
      },
      json: true,
    });
  });

  test('createParcel operation should handle errors', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createParcel')
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(16)
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeParcelOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  test('getParcel operation should retrieve a parcel successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getParcel')
      .mockReturnValueOnce('prcl_123');

    const mockParcel = { id: 'prcl_123', length: 10, width: 5, height: 3, weight: 16 };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockParcel);

    const result = await executeParcelOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockParcel, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.easypost.com/v2/parcels/prcl_123',
      headers: {
        'Authorization': 'Bearer test-key',
      },
      json: true,
    });
  });

  test('listParcels operation should list parcels successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listParcels')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(20);

    const mockParcels = { parcels: [{ id: 'prcl_123' }, { id: 'prcl_456' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockParcels);

    const result = await executeParcelOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockParcels, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.easypost.com/v2/parcels?page_size=20',
      headers: {
        'Authorization': 'Bearer test-key',
      },
      json: true,
    });
  });
});

describe('Shipment Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.easypost.com/v2',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  it('should create shipment successfully', async () => {
    const mockShipment = { id: 'shp_123', status: 'created' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockShipment);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createShipment')
      .mockReturnValueOnce({
        name: 'John Doe',
        street1: '123 Main St',
        city: 'Austin',
        state: 'TX',
        zip: '73301',
        country: 'US',
      })
      .mockReturnValueOnce({
        name: 'Jane Smith',
        street1: '456 Oak Ave',
        city: 'Dallas',
        state: 'TX',
        zip: '75201',
        country: 'US',
      })
      .mockReturnValueOnce({
        length: 10,
        width: 8,
        height: 6,
        weight: 16,
      })
      .mockReturnValueOnce({})
      .mockReturnValueOnce('REF123');

    const result = await executeShipmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockShipment,
      pairedItem: { item: 0 },
    }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.easypost.com/v2/shipments',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: expect.stringContaining('shipment'),
      json: true,
    });
  });

  it('should get shipment successfully', async () => {
    const mockShipment = { id: 'shp_123', status: 'delivered' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockShipment);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getShipment')
      .mockReturnValueOnce('shp_123');

    const result = await executeShipmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockShipment,
      pairedItem: { item: 0 },
    }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.easypost.com/v2/shipments/shp_123',
      headers: {
        'Authorization': 'Bearer test-key',
      },
      json: true,
    });
  });

  it('should list shipments successfully', async () => {
    const mockResponse = { shipments: [{ id: 'shp_123' }, { id: 'shp_456' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listShipments')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(20)
      .mockReturnValueOnce(false);

    const result = await executeShipmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 },
    }]);
  });

  it('should buy shipment successfully', async () => {
    const mockShipment = { id: 'shp_123', postage_label: { label_url: 'https://example.com/label.pdf' } };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockShipment);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('buyShipment')
      .mockReturnValueOnce('shp_123')
      .mockReturnValueOnce('rate_123')
      .mockReturnValueOnce(100);

    const result = await executeShipmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockShipment,
      pairedItem: { item: 0 },
    }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.easypost.com/v2/shipments/shp_123/buy',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: expect.stringContaining('rate_123'),
      json: true,
    });
  });

  it('should handle API errors gracefully', async () => {
    const error = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getShipment');

    const result = await executeShipmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { error: 'API Error' },
      pairedItem: { item: 0 },
    }]);
  });
});

describe('Rate Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.easypost.com/v2'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	test('should create rate successfully', async () => {
		const mockRateResponse = {
			id: 'rate_123',
			service: 'Priority',
			rate: '12.50',
			currency: 'USD',
		};

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createRate')
			.mockReturnValueOnce({
				name: 'John Doe',
				street1: '123 Main St',
				city: 'New York',
				state: 'NY',
				zip: '10001',
				country: 'US',
			})
			.mockReturnValueOnce({
				name: 'Jane Smith',
				street1: '456 Oak Ave',
				city: 'Los Angeles',
				state: 'CA',
				zip: '90210',
				country: 'US',
			})
			.mockReturnValueOnce({
				length: 10,
				width: 8,
				height: 6,
				weight: 16,
			})
			.mockReturnValueOnce('Priority');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockRateResponse);

		const result = await executeRateOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: mockRateResponse,
			pairedItem: { item: 0 },
		}]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.easypost.com/v2/shipments',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json',
			},
			body: {
				shipment: {
					to_address: {
						name: 'John Doe',
						street1: '123 Main St',
						city: 'New York',
						state: 'NY',
						zip: '10001',
						country: 'US',
					},
					from_address: {
						name: 'Jane Smith',
						street1: '456 Oak Ave',
						city: 'Los Angeles',
						state: 'CA',
						zip: '90210',
						country: 'US',
					},
					parcel: {
						length: 10,
						width: 8,
						height: 6,
						weight: 16,
					},
					service: 'Priority',
				},
			},
			json: true,
		});
	});

	test('should get rate by ID successfully', async () => {
		const mockRate = {
			id: 'rate_123',
			service: 'Priority',
			rate: '12.50',
			currency: 'USD',
		};

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getRate')
			.mockReturnValueOnce('rate_123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockRate);

		const result = await executeRateOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: mockRate,
			pairedItem: { item: 0 },
		}]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.easypost.com/v2/rates/rate_123',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	test('should handle API errors when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getRate');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeRateOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: { error: 'API Error' },
			pairedItem: { item: 0 },
		}]);
	});

	test('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getRate');
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(executeRateOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
	});

	test('should throw error for unknown operation', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

		await expect(executeRateOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Unknown operation: unknownOperation');
	});
});

describe('Tracker Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.easypost.com/v2'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  it('should create a tracker successfully', async () => {
    const mockResponse = {
      id: 'trk_123',
      tracking_code: '1234567890',
      carrier: 'USPS',
      status: 'in_transit'
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createTracker')
      .mockReturnValueOnce('1234567890')
      .mockReturnValueOnce('USPS');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTrackerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });

  it('should get a tracker successfully', async () => {
    const mockResponse = {
      id: 'trk_123',
      tracking_code: '1234567890',
      status: 'delivered'
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTracker')
      .mockReturnValueOnce('trk_123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTrackerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createTracker');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeTrackerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { error: 'API Error' },
      pairedItem: { item: 0 }
    }]);
  });
});

describe('Batch Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn()
      },
    };
  });

  test('createBatch operation - success', async () => {
    const mockResponse = { 
      id: 'batch_123',
      state: 'created',
      num_shipments: 2
    };
    
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'createBatch';
      if (param === 'shipments') return '[{"to_address": "addr_1", "from_address": "addr_2"}]';
      return '';
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    
    const result = await executeBatchOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
      method: 'POST',
      url: 'https://api.easypost.com/v2/batches',
      body: {
        batch: {
          shipments: [{"to_address": "addr_1", "from_address": "addr_2"}],
        },
      },
    });
  });

  test('getBatch operation - success', async () => {
    const mockResponse = { 
      id: 'batch_123',
      state: 'purchased',
      num_shipments: 5
    };
    
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getBatch';
      if (param === 'batchId') return 'batch_123';
      return '';
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    
    const result = await executeBatchOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
      method: 'GET',
      url: 'https://api.easypost.com/v2/batches/batch_123',
    });
  });

  test('listBatches operation - success', async () => {
    const mockResponse = { 
      batches: [
        { id: 'batch_1', state: 'created' },
        { id: 'batch_2', state: 'purchased' }
      ]
    };
    
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
      if (param === 'operation') return 'listBatches';
      if (param === 'pageSize') return 20;
      return defaultValue || '';
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    
    const result = await executeBatchOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result[0].json).toEqual(mockResponse);
  });

  test('buyBatch operation - success', async () => {
    const mockResponse = { 
      id: 'batch_123',
      state: 'purchased',
      num_shipments: 3
    };
    
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'buyBatch';
      if (param === 'batchId') return 'batch_123';
      return '';
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    
    const result = await executeBatchOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result[0].json).toEqual(mockResponse);
  });

  test('generateBatchLabels operation - success', async () => {
    const mockResponse = { 
      batch_id: 'batch_123',
      label_url: 'https://easypost-files.s3.us-west-2.amazonaws.com/files/batch_label/123.pdf'
    };
    
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
      if (param === 'operation') return 'generateBatchLabels';
      if (param === 'batchId') return 'batch_123';
      if (param === 'fileFormat') return 'pdf';
      return defaultValue || '';
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    
    const result = await executeBatchOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result[0].json).toEqual(mockResponse);
  });

  test('createScanForm operation - success', async () => {
    const mockResponse = { 
      id: 'sf_123',
      form_url: 'https://easypost-files.s3.us-west-2.amazonaws.com/files/scan_form/123.pdf'
    };
    
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'createScanForm';
      if (param === 'batchId') return 'batch_123';
      return '';
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    
    const result = await executeBatchOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result[0].json).toEqual(mockResponse);
  });

  test('createBatch operation - invalid JSON error', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'createBatch';
      if (param === 'shipments') return 'invalid json';
      return '';
    });
    
    await expect(executeBatchOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Invalid JSON in shipments parameter');
  });

  test('error handling with continueOnFail', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getBatch';
      if (param === 'batchId') return 'batch_123';
      return '';
    });
    
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    
    const result = await executeBatchOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result[0].json.error).toBe('API Error');
  });
});

describe('CustomsItem Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('createCustomsItem', () => {
		it('should create a customs item successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createCustomsItem')
				.mockReturnValueOnce('Electronics')
				.mockReturnValueOnce(2)
				.mockReturnValueOnce(16)
				.mockReturnValueOnce(100)
				.mockReturnValueOnce('851712')
				.mockReturnValueOnce('US')
				.mockReturnValueOnce('USD');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'cstitem_123',
				description: 'Electronics',
				quantity: 2,
			});

			const result = await executeCustomsItemOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe('cstitem_123');
		});

		it('should handle create customs item errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createCustomsItem')
				.mockReturnValue('');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid data'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeCustomsItemOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result[0].json.error).toBe('Invalid data');
		});
	});

	describe('getCustomsItem', () => {
		it('should get a customs item successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getCustomsItem')
				.mockReturnValueOnce('cstitem_123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'cstitem_123',
				description: 'Electronics',
			});

			const result = await executeCustomsItemOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe('cstitem_123');
		});

		it('should handle get customs item errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getCustomsItem')
				.mockReturnValueOnce('invalid_id');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeCustomsItemOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result[0].json.error).toBe('Not found');
		});
	});

	describe('listCustomsItems', () => {
		it('should list customs items successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listCustomsItems')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(20);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				customs_items: [
					{ id: 'cstitem_1' },
					{ id: 'cstitem_2' },
				],
			});

			const result = await executeCustomsItemOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.customs_items).toHaveLength(2);
		});

		it('should handle list customs items errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listCustomsItems')
				.mockReturnValue('');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Unauthorized'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeCustomsItemOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result[0].json.error).toBe('Unauthorized');
		});
	});
});

describe('CustomsInfo Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				api_key: 'test-api-key',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('createCustomsInfo', () => {
		it('should create customs info successfully', async () => {
			const mockResponse = {
				id: 'cstinfo_12345',
				customs_items: [
					{
						description: 'T-Shirt',
						quantity: 1,
						weight: 5,
						value: 25.99,
						origin_country: 'US',
					},
				],
				contents_type: 'merchandise',
				customs_certify: true,
				customs_signer: 'John Doe',
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createCustomsInfo')
				.mockReturnValueOnce([{
					description: 'T-Shirt',
					quantity: 1,
					weight: 5,
					value: 25.99,
					origin_country: 'US',
				}])
				.mockReturnValueOnce('merchandise')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('none')
				.mockReturnValueOnce(true)
				.mockReturnValueOnce('John Doe')
				.mockReturnValueOnce('return')
				.mockReturnValueOnce('');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeCustomsInfoOperations.call(
				mockExecuteFunctions,
				items,
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.easypost.com/v2/customs_infos',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				body: {
					customs_info: {
						customs_items: [{
							description: 'T-Shirt',
							quantity: 1,
							weight: 5,
							value: 25.99,
							origin_country: 'US',
						}],
						contents_type: 'merchandise',
						customs_certify: true,
						customs_signer: 'John Doe',
					},
				},
				json: true,
			});
		});

		it('should handle API errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createCustomsInfo')
				.mockReturnValue('test-value');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
				new Error('API Error'),
			);

			const items = [{ json: {} }];

			await expect(
				executeCustomsInfoOperations.call(mockExecuteFunctions, items),
			).rejects.toThrow('API Error');
		});
	});

	describe('getCustomsInfo', () => {
		it('should retrieve customs info successfully', async () => {
			const mockResponse = {
				id: 'cstinfo_12345',
				customs_items: [
					{
						description: 'T-Shirt',
						quantity: 1,
						weight: 5,
						value: 25.99,
					},
				],
				contents_type: 'merchandise',
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getCustomsInfo')
				.mockReturnValueOnce('cstinfo_12345');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeCustomsInfoOperations.call(
				mockExecuteFunctions,
				items,
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.easypost.com/v2/customs_infos/cstinfo_12345',
				headers: {
					'Authorization': 'Bearer test-api-key',
				},
				json: true,
			});
		});
	});

	describe('listCustomsInfos', () => {
		it('should list customs infos successfully', async () => {
			const mockResponse = {
				customs_infos: [
					{ id: 'cstinfo_1', contents_type: 'merchandise' },
					{ id: 'cstinfo_2', contents_type: 'documents' },
				],
				has_more: false,
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listCustomsInfos')
				.mockReturnValueOnce('before_123')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(20);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeCustomsInfoOperations.call(
				mockExecuteFunctions,
				items,
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.easypost.com/v2/customs_infos?before_id=before_123&page_size=20',
				headers: {
					'Authorization': 'Bearer test-api-key',
				},
				json: true,
			});
		});
	});
});

describe('Insurance Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('createInsurance', () => {
    it('should create insurance successfully', async () => {
      const mockInsurance = {
        id: 'ins_123',
        amount: '100.00',
        carrier: 'UPS',
        tracking_code: '1Z999AA1234567890',
        status: 'pending'
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createInsurance')
        .mockReturnValueOnce({ name: 'John Doe', street1: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345', country: 'US' })
        .mockReturnValueOnce({ name: 'Jane Smith', street1: '456 Oak Ave', city: 'Another City', state: 'NY', zip: '67890', country: 'US' })
        .mockReturnValueOnce('1Z999AA1234567890')
        .mockReturnValueOnce(100)
        .mockReturnValueOnce('UPS')
        .mockReturnValueOnce('REF123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockInsurance);

      const items = [{ json: {} }];
      const result = await executeInsuranceOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([
        {
          json: mockInsurance,
          pairedItem: { item: 0 },
        },
      ]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.easypost.com/v2/insurances',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        body: {
          to_address: { name: 'John Doe', street1: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345', country: 'US' },
          from_address: { name: 'Jane Smith', street1: '456 Oak Ave', city: 'Another City', state: 'NY', zip: '67890', country: 'US' },
          tracking_code: '1Z999AA1234567890',
          amount: '100',
          carrier: 'UPS',
          reference: 'REF123'
        },
        json: true,
      });
    });

    it('should handle createInsurance error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createInsurance')
        .mockReturnValueOnce({ name: 'John Doe', street1: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345', country: 'US' })
        .mockReturnValueOnce({ name: 'Jane Smith', street1: '456 Oak Ave', city: 'Another City', state: 'NY', zip: '67890', country: 'US' })
        .mockReturnValueOnce('1Z999AA1234567890')
        .mockReturnValueOnce(100)
        .mockReturnValueOnce('UPS')
        .mockReturnValueOnce('REF123');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executeInsuranceOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([
        {
          json: { error: 'API Error' },
          pairedItem: { item: 0 },
        },
      ]);
    });
  });

  describe('getInsurance', () => {
    it('should get insurance successfully', async () => {
      const mockInsurance = {
        id: 'ins_123',
        amount: '100.00',
        carrier: 'UPS',
        tracking_code: '1Z999AA1234567890',
        status: 'purchased'
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getInsurance')
        .mockReturnValueOnce('ins_123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockInsurance);

      const items = [{ json: {} }];
      const result = await executeInsuranceOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([
        {
          json: mockInsurance,
          pairedItem: { item: 0 },
        },
      ]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.easypost.com/v2/insurances/ins_123',
        headers: {
          'Authorization': 'Bearer test-key',
        },
        json: true,
      });
    });

    it('should handle getInsurance error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getInsurance')
        .mockReturnValueOnce('ins_123');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Insurance not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executeInsuranceOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([
        {
          json: { error: 'Insurance not found' },
          pairedItem: { item: 0 },
        },
      ]);
    });
  });

  describe('listInsurances', () => {
    it('should list insurances successfully', async () => {
      const mockResponse = {
        insurances: [
          { id: 'ins_123', amount: '100.00', carrier: 'UPS' },
          { id: 'ins_124', amount: '50.00', carrier: 'FedEx' }
        ],
        has_more: false
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listInsurances')
        .mockReturnValueOnce({ pageSize: 10, beforeId: 'ins_125' });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeInsuranceOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.easypost.com/v2/insurances',
        headers: {
          'Authorization': 'Bearer test-key',
        },
        qs: {
          page_size: 10,
          before_id: 'ins_125'
        },
        json: true,
      });
    });

    it('should handle listInsurances error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listInsurances')
        .mockReturnValueOnce({});

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Unauthorized'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executeInsuranceOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([
        {
          json: { error: 'Unauthorized' },
          pairedItem: { item: 0 },
        },
      ]);
    });
  });
});

describe('Event Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.easypost.com/v2',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getEvent operation', () => {
		it('should retrieve event details successfully', async () => {
			const mockEvent = {
				id: 'evt_123',
				object: 'Event',
				description: 'tracker.updated',
				mode: 'test',
				previous_attributes: {},
				pending_urls: [],
				completed_urls: [],
				created_at: '2023-01-01T00:00:00Z',
				updated_at: '2023-01-01T00:00:00Z',
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getEvent')
				.mockReturnValueOnce('evt_123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockEvent);

			const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.easypost.com/v2/events/evt_123',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: mockEvent,
				pairedItem: { item: 0 },
			}]);
		});

		it('should handle getEvent errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getEvent')
				.mockReturnValueOnce('invalid_id');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Event not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { error: 'Event not found' },
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('listEvents operation', () => {
		it('should list events successfully', async () => {
			const mockEventsResponse = {
				events: [
					{
						id: 'evt_123',
						object: 'Event',
						description: 'tracker.updated',
						mode: 'test',
						created_at: '2023-01-01T00:00:00Z',
					},
					{
						id: 'evt_456',
						object: 'Event',
						description: 'shipment.purchased',
						mode: 'test',
						created_at: '2023-01-02T00:00:00Z',
					},
				],
				has_more: false,
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listEvents')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(20);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockEventsResponse);

			const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.easypost.com/v2/events',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: mockEventsResponse,
				pairedItem: { item: 0 },
			}]);
		});

		it('should list events with filters', async () => {
			const mockEventsResponse = {
				events: [{
					id: 'evt_123',
					object: 'Event',
					description: 'tracker.updated',
					mode: 'test',
					created_at: '2023-01-01T00:00:00Z',
				}],
				has_more: false,
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listEvents')
				.mockReturnValueOnce('evt_before')
				.mockReturnValueOnce('evt_after')
				.mockReturnValueOnce('2023-01-01T00:00:00Z')
				.mockReturnValueOnce('2023-01-31T23:59:59Z')
				.mockReturnValueOnce(10);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockEventsResponse);

			const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.easypost.com/v2/events?before_id=evt_before&after_id=evt_after&start_datetime=2023-01-01T00%3A00%3A00Z&end_datetime=2023-01-31T23%3A59%3A59Z&page_size=10',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: mockEventsResponse,
				pairedItem: { item: 0 },
			}]);
		});

		it('should handle listEvents errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listEvents')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(20);

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { error: 'API Error' },
				pairedItem: { item: 0 },
			}]);
		});
	});
});
});
