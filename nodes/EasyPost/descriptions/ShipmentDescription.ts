/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const shipmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['shipment'],
			},
		},
		options: [
			{
				name: 'Buy',
				value: 'buy',
				description: 'Purchase a label for a shipment',
				action: 'Buy a shipment',
			},
			{
				name: 'Buy With Rate',
				value: 'buyWithRate',
				description: 'Create and buy shipment in one call',
				action: 'Create and buy shipment',
			},
			{
				name: 'Convert Label',
				value: 'convertLabel',
				description: 'Convert label to a different format',
				action: 'Convert label format',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new shipment and get rates',
				action: 'Create a shipment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a shipment by ID',
				action: 'Get a shipment',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many shipments',
				action: 'Get many shipments',
			},
			{
				name: 'Insure',
				value: 'insure',
				description: 'Add insurance to a shipment',
				action: 'Insure a shipment',
			},
			{
				name: 'Refund',
				value: 'refund',
				description: 'Request a refund for a shipment',
				action: 'Refund a shipment',
			},
			{
				name: 'Regenerate Rates',
				value: 'regenerateRates',
				description: 'Regenerate rates for a shipment',
				action: 'Regenerate rates',
			},
		],
		default: 'create',
	},
];

const toAddressFields: INodeProperties[] = [
	{
		displayName: 'To Name',
		name: 'toName',
		type: 'string',
		default: '',
		description: 'Recipient name',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
			},
		},
	},
	{
		displayName: 'To Company',
		name: 'toCompany',
		type: 'string',
		default: '',
		description: 'Recipient company name',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
			},
		},
	},
	{
		displayName: 'To Street 1',
		name: 'toStreet1',
		type: 'string',
		default: '',
		required: true,
		description: 'Recipient street address',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
			},
		},
	},
	{
		displayName: 'To Street 2',
		name: 'toStreet2',
		type: 'string',
		default: '',
		description: 'Recipient apartment/suite/etc',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
			},
		},
	},
	{
		displayName: 'To City',
		name: 'toCity',
		type: 'string',
		default: '',
		required: true,
		description: 'Recipient city',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
			},
		},
	},
	{
		displayName: 'To State',
		name: 'toState',
		type: 'string',
		default: '',
		required: true,
		description: 'Recipient state/province',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
			},
		},
	},
	{
		displayName: 'To ZIP',
		name: 'toZip',
		type: 'string',
		default: '',
		required: true,
		description: 'Recipient postal code',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
			},
		},
	},
	{
		displayName: 'To Country',
		name: 'toCountry',
		type: 'string',
		default: 'US',
		required: true,
		description: 'Recipient country code (ISO 3166)',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
			},
		},
	},
	{
		displayName: 'To Phone',
		name: 'toPhone',
		type: 'string',
		default: '',
		description: 'Recipient phone number',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
			},
		},
	},
	{
		displayName: 'To Email',
		name: 'toEmail',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		description: 'Recipient email address',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
			},
		},
	},
];

const fromAddressFields: INodeProperties[] = [
	{
		displayName: 'From Name',
		name: 'fromName',
		type: 'string',
		default: '',
		description: 'Sender name',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
			},
		},
	},
	{
		displayName: 'From Company',
		name: 'fromCompany',
		type: 'string',
		default: '',
		description: 'Sender company name',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
			},
		},
	},
	{
		displayName: 'From Street 1',
		name: 'fromStreet1',
		type: 'string',
		default: '',
		required: true,
		description: 'Sender street address',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
			},
		},
	},
	{
		displayName: 'From Street 2',
		name: 'fromStreet2',
		type: 'string',
		default: '',
		description: 'Sender apartment/suite/etc',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
			},
		},
	},
	{
		displayName: 'From City',
		name: 'fromCity',
		type: 'string',
		default: '',
		required: true,
		description: 'Sender city',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
			},
		},
	},
	{
		displayName: 'From State',
		name: 'fromState',
		type: 'string',
		default: '',
		required: true,
		description: 'Sender state/province',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
			},
		},
	},
	{
		displayName: 'From ZIP',
		name: 'fromZip',
		type: 'string',
		default: '',
		required: true,
		description: 'Sender postal code',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
			},
		},
	},
	{
		displayName: 'From Country',
		name: 'fromCountry',
		type: 'string',
		default: 'US',
		required: true,
		description: 'Sender country code (ISO 3166)',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
			},
		},
	},
	{
		displayName: 'From Phone',
		name: 'fromPhone',
		type: 'string',
		default: '',
		description: 'Sender phone number',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
			},
		},
	},
	{
		displayName: 'From Email',
		name: 'fromEmail',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		description: 'Sender email address',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
			},
		},
	},
];

const parcelFields: INodeProperties[] = [
	{
		displayName: 'Use Predefined Package',
		name: 'usePredefinedPackage',
		type: 'boolean',
		default: false,
		description: 'Whether to use a carrier-specific predefined package',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
			},
		},
	},
	{
		displayName: 'Predefined Package',
		name: 'predefinedPackage',
		type: 'options',
		options: [
			{ name: 'Card', value: 'Card' },
			{ name: 'Flat', value: 'Flat' },
			{ name: 'FlatRateCardboardEnvelope', value: 'FlatRateCardboardEnvelope' },
			{ name: 'FlatRateEnvelope', value: 'FlatRateEnvelope' },
			{ name: 'FlatRateLegalEnvelope', value: 'FlatRateLegalEnvelope' },
			{ name: 'FlatRatePaddedEnvelope', value: 'FlatRatePaddedEnvelope' },
			{ name: 'FlatRateWindowEnvelope', value: 'FlatRateWindowEnvelope' },
			{ name: 'LargeFlatRateBox', value: 'LargeFlatRateBox' },
			{ name: 'Letter', value: 'Letter' },
			{ name: 'MediumFlatRateBox', value: 'MediumFlatRateBox' },
			{ name: 'Parcel', value: 'Parcel' },
			{ name: 'RegionalRateBoxA', value: 'RegionalRateBoxA' },
			{ name: 'RegionalRateBoxB', value: 'RegionalRateBoxB' },
			{ name: 'SmallFlatRateBox', value: 'SmallFlatRateBox' },
			{ name: 'SmallFlatRateEnvelope', value: 'SmallFlatRateEnvelope' },
			{ name: 'SoftPack', value: 'SoftPack' },
		],
		default: 'Parcel',
		description: 'Carrier-specific predefined package type',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
				usePredefinedPackage: [true],
			},
		},
	},
	{
		displayName: 'Length (inches)',
		name: 'length',
		type: 'number',
		default: 0,
		description: 'Package length in inches',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
				usePredefinedPackage: [false],
			},
		},
	},
	{
		displayName: 'Width (inches)',
		name: 'width',
		type: 'number',
		default: 0,
		description: 'Package width in inches',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
				usePredefinedPackage: [false],
			},
		},
	},
	{
		displayName: 'Height (inches)',
		name: 'height',
		type: 'number',
		default: 0,
		description: 'Package height in inches',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
				usePredefinedPackage: [false],
			},
		},
	},
	{
		displayName: 'Weight (oz)',
		name: 'weight',
		type: 'number',
		default: 0,
		required: true,
		description: 'Package weight in ounces',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
			},
		},
	},
];

export const shipmentFields: INodeProperties[] = [
	// Get operation
	{
		displayName: 'Shipment ID',
		name: 'shipmentId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the shipment (starts with shp_)',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['get', 'buy', 'convertLabel', 'insure', 'refund', 'regenerateRates'],
			},
		},
	},
	// To Address fields
	...toAddressFields,
	// From Address fields
	...fromAddressFields,
	// Parcel fields
	...parcelFields,
	// Buy operation
	{
		displayName: 'Rate ID',
		name: 'rateId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the rate to purchase (starts with rate_)',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['buy'],
			},
		},
	},
	// Buy with Rate operation
	{
		displayName: 'Carrier',
		name: 'carrier',
		type: 'string',
		required: true,
		default: '',
		description: 'The carrier to use (e.g., USPS, UPS, FedEx)',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['buyWithRate'],
			},
		},
	},
	{
		displayName: 'Service',
		name: 'service',
		type: 'string',
		required: true,
		default: '',
		description: 'The service level (e.g., Priority, Ground, Express)',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['buyWithRate'],
			},
		},
	},
	// Convert Label
	{
		displayName: 'Label Format',
		name: 'labelFormat',
		type: 'options',
		options: [
			{ name: 'PDF', value: 'PDF' },
			{ name: 'PNG', value: 'PNG' },
			{ name: 'ZPL', value: 'ZPL' },
			{ name: 'EPL2', value: 'EPL2' },
		],
		default: 'PDF',
		description: 'The format to convert the label to',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['convertLabel'],
			},
		},
	},
	// Insure
	{
		displayName: 'Insurance Amount',
		name: 'insuranceAmount',
		type: 'number',
		required: true,
		default: 0,
		description: 'The amount to insure the shipment for (in USD)',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['insure'],
			},
		},
	},
	// Get All
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},
	// Additional Options
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create', 'buyWithRate'],
			},
		},
		options: [
			{
				displayName: 'Reference',
				name: 'reference',
				type: 'string',
				default: '',
				description: 'Custom reference for the shipment',
			},
			{
				displayName: 'Is Return',
				name: 'isReturn',
				type: 'boolean',
				default: false,
				description: 'Whether this is a return shipment',
			},
			{
				displayName: 'Label Format',
				name: 'labelFormat',
				type: 'options',
				options: [
					{ name: 'PDF', value: 'PDF' },
					{ name: 'PNG', value: 'PNG' },
					{ name: 'ZPL', value: 'ZPL' },
					{ name: 'EPL2', value: 'EPL2' },
				],
				default: 'PDF',
				description: 'Format for the shipping label',
			},
			{
				displayName: 'Label Size',
				name: 'labelSize',
				type: 'options',
				options: [
					{ name: '4x6', value: '4x6' },
					{ name: '4x4', value: '4x4' },
					{ name: '8.5x11', value: '8.5x11' },
				],
				default: '4x6',
				description: 'Size of the shipping label',
			},
			{
				displayName: 'Print Custom 1',
				name: 'printCustom1',
				type: 'string',
				default: '',
				description: 'Custom text to print on label',
			},
			{
				displayName: 'Print Custom 2',
				name: 'printCustom2',
				type: 'string',
				default: '',
				description: 'Custom text to print on label',
			},
			{
				displayName: 'Print Custom 3',
				name: 'printCustom3',
				type: 'string',
				default: '',
				description: 'Custom text to print on label',
			},
			{
				displayName: 'Delivery Confirmation',
				name: 'deliveryConfirmation',
				type: 'options',
				options: [
					{ name: 'No Signature', value: 'NO_SIGNATURE' },
					{ name: 'Signature', value: 'SIGNATURE' },
					{ name: 'Adult Signature', value: 'ADULT_SIGNATURE' },
					{ name: 'Adult Signature Restricted', value: 'ADULT_SIGNATURE_RESTRICTED' },
				],
				default: 'NO_SIGNATURE',
				description: 'Delivery confirmation type',
			},
			{
				displayName: 'Saturday Delivery',
				name: 'saturdayDelivery',
				type: 'boolean',
				default: false,
				description: 'Whether to request Saturday delivery',
			},
			{
				displayName: 'Hazmat',
				name: 'hazmat',
				type: 'options',
				options: [
					{ name: 'None', value: '' },
					{ name: 'Primary Contained', value: 'PRIMARY_CONTAINED' },
					{ name: 'Primary Packed', value: 'PRIMARY_PACKED' },
					{ name: 'Primary', value: 'PRIMARY' },
					{ name: 'Secondary Contained', value: 'SECONDARY_CONTAINED' },
					{ name: 'Secondary Packed', value: 'SECONDARY_PACKED' },
					{ name: 'Secondary', value: 'SECONDARY' },
					{ name: 'Ormd', value: 'ORMD' },
					{ name: 'Limited Quantity', value: 'LIMITED_QUANTITY' },
					{ name: 'Lithium', value: 'LITHIUM' },
				],
				default: '',
				description: 'Hazmat classification',
			},
			{
				displayName: 'Invoice Number',
				name: 'invoiceNumber',
				type: 'string',
				default: '',
				description: 'Invoice number for the shipment',
			},
			{
				displayName: 'PO Number',
				name: 'poNumber',
				type: 'string',
				default: '',
				description: 'Purchase order number',
			},
			{
				displayName: 'Carrier Accounts',
				name: 'carrierAccounts',
				type: 'string',
				default: '',
				description: 'Comma-separated list of carrier account IDs to limit rates to',
			},
		],
	},
	// Filters for getAll
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Before ID',
				name: 'beforeId',
				type: 'string',
				default: '',
				description: 'Get shipments before this ID',
			},
			{
				displayName: 'After ID',
				name: 'afterId',
				type: 'string',
				default: '',
				description: 'Get shipments after this ID',
			},
			{
				displayName: 'Start Date',
				name: 'startDatetime',
				type: 'dateTime',
				default: '',
				description: 'Start date for filtering shipments',
			},
			{
				displayName: 'End Date',
				name: 'endDatetime',
				type: 'dateTime',
				default: '',
				description: 'End date for filtering shipments',
			},
			{
				displayName: 'Purchased',
				name: 'purchased',
				type: 'boolean',
				default: false,
				description: 'Whether to filter by purchased shipments only',
			},
			{
				displayName: 'Include Children',
				name: 'includeChildren',
				type: 'boolean',
				default: false,
				description: 'Whether to include child user shipments',
			},
		],
	},
];
