/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const parcelOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['parcel'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new parcel',
				action: 'Create a parcel',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a parcel by ID',
				action: 'Get a parcel',
			},
		],
		default: 'create',
	},
];

export const parcelFields: INodeProperties[] = [
	// Get operation
	{
		displayName: 'Parcel ID',
		name: 'parcelId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the parcel (starts with prcl_)',
		displayOptions: {
			show: {
				resource: ['parcel'],
				operation: ['get'],
			},
		},
	},
	// Create operation fields
	{
		displayName: 'Use Predefined Package',
		name: 'usePredefinedPackage',
		type: 'boolean',
		default: false,
		description: 'Whether to use a carrier-specific predefined package',
		displayOptions: {
			show: {
				resource: ['parcel'],
				operation: ['create'],
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
				resource: ['parcel'],
				operation: ['create'],
				usePredefinedPackage: [true],
			},
		},
	},
	{
		displayName: 'Length (inches)',
		name: 'length',
		type: 'number',
		default: 0,
		required: true,
		description: 'Package length in inches',
		displayOptions: {
			show: {
				resource: ['parcel'],
				operation: ['create'],
				usePredefinedPackage: [false],
			},
		},
	},
	{
		displayName: 'Width (inches)',
		name: 'width',
		type: 'number',
		default: 0,
		required: true,
		description: 'Package width in inches',
		displayOptions: {
			show: {
				resource: ['parcel'],
				operation: ['create'],
				usePredefinedPackage: [false],
			},
		},
	},
	{
		displayName: 'Height (inches)',
		name: 'height',
		type: 'number',
		default: 0,
		required: true,
		description: 'Package height in inches',
		displayOptions: {
			show: {
				resource: ['parcel'],
				operation: ['create'],
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
				resource: ['parcel'],
				operation: ['create'],
			},
		},
	},
];
