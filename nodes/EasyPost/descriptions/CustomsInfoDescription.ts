/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const customsInfoOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customsInfo'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create customs info for international shipments',
				action: 'Create customs info',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve customs info by ID',
				action: 'Get customs info',
			},
		],
		default: 'create',
	},
];

export const customsInfoFields: INodeProperties[] = [
	// Get operation
	{
		displayName: 'Customs Info ID',
		name: 'customsInfoId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the customs info (starts with cstinfo_)',
		displayOptions: {
			show: {
				resource: ['customsInfo'],
				operation: ['get'],
			},
		},
	},
	// Create operation fields
	{
		displayName: 'Customs Certify',
		name: 'customsCertify',
		type: 'boolean',
		default: true,
		required: true,
		description: 'Whether to certify the customs information is correct',
		displayOptions: {
			show: {
				resource: ['customsInfo'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Customs Signer',
		name: 'customsSigner',
		type: 'string',
		default: '',
		required: true,
		description: 'Name of the person signing the customs form',
		displayOptions: {
			show: {
				resource: ['customsInfo'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Contents Type',
		name: 'contentsType',
		type: 'options',
		options: [
			{ name: 'Documents', value: 'documents' },
			{ name: 'Gift', value: 'gift' },
			{ name: 'Merchandise', value: 'merchandise' },
			{ name: 'Other', value: 'other' },
			{ name: 'Returned Goods', value: 'returned_goods' },
			{ name: 'Sample', value: 'sample' },
		],
		default: 'merchandise',
		required: true,
		description: 'Type of contents in the shipment',
		displayOptions: {
			show: {
				resource: ['customsInfo'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Contents Explanation',
		name: 'contentsExplanation',
		type: 'string',
		default: '',
		description: 'Explanation of the contents (required if contents type is "other")',
		displayOptions: {
			show: {
				resource: ['customsInfo'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Non-Delivery Option',
		name: 'nonDeliveryOption',
		type: 'options',
		options: [
			{ name: 'Abandon', value: 'abandon' },
			{ name: 'Return', value: 'return' },
		],
		default: 'return',
		description: 'What to do if the shipment cannot be delivered',
		displayOptions: {
			show: {
				resource: ['customsInfo'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'EEL/PFC',
		name: 'eelPfc',
		type: 'options',
		options: [
			{ name: 'None', value: '' },
			{ name: 'NOEEI 30.37(a)', value: 'NOEEI 30.37(a)' },
			{ name: 'NOEEI 30.37(h)', value: 'NOEEI 30.37(h)' },
			{ name: 'NOEEI 30.37(f)', value: 'NOEEI 30.37(f)' },
			{ name: 'NOEEI 30.36', value: 'NOEEI 30.36' },
			{ name: 'AES/ITN (Custom)', value: 'custom' },
		],
		default: 'NOEEI 30.37(a)',
		description: 'Export/Import compliance number',
		displayOptions: {
			show: {
				resource: ['customsInfo'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Custom EEL/PFC',
		name: 'customEelPfc',
		type: 'string',
		default: '',
		description: 'Custom AES/ITN number',
		displayOptions: {
			show: {
				resource: ['customsInfo'],
				operation: ['create'],
				eelPfc: ['custom'],
			},
		},
	},
	{
		displayName: 'Restriction Type',
		name: 'restrictionType',
		type: 'options',
		options: [
			{ name: 'None', value: 'none' },
			{ name: 'Quarantine', value: 'quarantine' },
			{ name: 'Sanitary/Phytosanitary Inspection', value: 'sanitary_phytosanitary_inspection' },
			{ name: 'Other', value: 'other' },
		],
		default: 'none',
		description: 'Type of restriction on the contents',
		displayOptions: {
			show: {
				resource: ['customsInfo'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Restriction Comments',
		name: 'restrictionComments',
		type: 'string',
		default: '',
		description: 'Comments about restrictions',
		displayOptions: {
			show: {
				resource: ['customsInfo'],
				operation: ['create'],
			},
		},
	},
	// Customs Items
	{
		displayName: 'Customs Items',
		name: 'customsItems',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		description: 'Items included in the shipment for customs declaration',
		displayOptions: {
			show: {
				resource: ['customsInfo'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'item',
				displayName: 'Item',
				values: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						required: true,
						description: 'Description of the item',
					},
					{
						displayName: 'Quantity',
						name: 'quantity',
						type: 'number',
						default: 1,
						required: true,
						description: 'Number of items',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'number',
						default: 0,
						required: true,
						description: 'Value per item in USD',
					},
					{
						displayName: 'Weight (oz)',
						name: 'weight',
						type: 'number',
						default: 0,
						required: true,
						description: 'Weight per item in ounces',
					},
					{
						displayName: 'HS Tariff Number',
						name: 'hsTariffNumber',
						type: 'string',
						default: '',
						description: 'Harmonized System tariff code',
					},
					{
						displayName: 'Origin Country',
						name: 'originCountry',
						type: 'string',
						default: 'US',
						description: 'Country of origin (ISO 3166)',
					},
					{
						displayName: 'Product Code',
						name: 'code',
						type: 'string',
						default: '',
						description: 'Product code/SKU',
					},
				],
			},
		],
	},
];
