/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const rateOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['rate'],
			},
		},
		options: [
			{
				name: 'Get for Shipment',
				value: 'getForShipment',
				description: 'Get rates for a shipment',
				action: 'Get rates for a shipment',
			},
			{
				name: 'Get Smart Rates',
				value: 'getSmartRates',
				description: 'Get SmartRates with time-in-transit predictions',
				action: 'Get smart rates',
			},
		],
		default: 'getForShipment',
	},
];

export const rateFields: INodeProperties[] = [
	// Shipment ID for both operations
	{
		displayName: 'Shipment ID',
		name: 'shipmentId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the shipment to get rates for (starts with shp_)',
		displayOptions: {
			show: {
				resource: ['rate'],
				operation: ['getForShipment', 'getSmartRates'],
			},
		},
	},
	// Filters for rates
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['rate'],
				operation: ['getForShipment'],
			},
		},
		options: [
			{
				displayName: 'Carrier',
				name: 'carrier',
				type: 'string',
				default: '',
				description: 'Filter by carrier (e.g., USPS, UPS, FedEx)',
			},
			{
				displayName: 'Service',
				name: 'service',
				type: 'string',
				default: '',
				description: 'Filter by service level (e.g., Priority, Ground)',
			},
		],
	},
	// Smart Rates options
	{
		displayName: 'Delivery Days',
		name: 'deliveryDays',
		type: 'number',
		default: 0,
		description: 'Filter SmartRates by maximum delivery days (0 for no filter)',
		displayOptions: {
			show: {
				resource: ['rate'],
				operation: ['getSmartRates'],
			},
		},
	},
	{
		displayName: 'Delivery Accuracy',
		name: 'deliveryAccuracy',
		type: 'options',
		options: [
			{ name: 'Percentile 50', value: 'percentile_50' },
			{ name: 'Percentile 75', value: 'percentile_75' },
			{ name: 'Percentile 85', value: 'percentile_85' },
			{ name: 'Percentile 90', value: 'percentile_90' },
			{ name: 'Percentile 95', value: 'percentile_95' },
			{ name: 'Percentile 97', value: 'percentile_97' },
			{ name: 'Percentile 99', value: 'percentile_99' },
		],
		default: 'percentile_85',
		description: 'Delivery time accuracy percentile for SmartRates',
		displayOptions: {
			show: {
				resource: ['rate'],
				operation: ['getSmartRates'],
			},
		},
	},
];
