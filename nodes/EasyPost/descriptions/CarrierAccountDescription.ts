/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const carrierAccountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['carrierAccount'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a carrier account',
				action: 'Create a carrier account',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a carrier account',
				action: 'Delete a carrier account',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a carrier account by ID',
				action: 'Get a carrier account',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many carrier accounts',
				action: 'Get many carrier accounts',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a carrier account',
				action: 'Update a carrier account',
			},
		],
		default: 'getAll',
	},
];

export const carrierAccountFields: INodeProperties[] = [
	// Get/Update/Delete operation
	{
		displayName: 'Carrier Account ID',
		name: 'carrierAccountId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the carrier account (starts with ca_)',
		displayOptions: {
			show: {
				resource: ['carrierAccount'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},
	// Create operation
	{
		displayName: 'Carrier Type',
		name: 'type',
		type: 'options',
		options: [
			{ name: 'AmazonMws', value: 'AmazonMwsAccount' },
			{ name: 'APC', value: 'ApcAccount' },
			{ name: 'Asendia', value: 'AsendiaAccount' },
			{ name: 'Australia Post', value: 'AustraliaPostAccount' },
			{ name: 'CanadaPost', value: 'CanadaPostAccount' },
			{ name: 'DHL eCommerce', value: 'DhlEcommerceAccount' },
			{ name: 'DHL Express', value: 'DhlExpressAccount' },
			{ name: 'DPD', value: 'DpdAccount' },
			{ name: 'Endicia', value: 'EndiciaAccount' },
			{ name: 'Estafeta', value: 'EstafetaAccount' },
			{ name: 'Fastway', value: 'FastwayAccount' },
			{ name: 'FedEx', value: 'FedexAccount' },
			{ name: 'FedEx SmartPost', value: 'FedexSmartpostAccount' },
			{ name: 'GSO', value: 'GsoAccount' },
			{ name: 'LaserShip', value: 'LasershipAccount' },
			{ name: 'Loomis Express', value: 'LoomisExpressAccount' },
			{ name: 'LSO', value: 'LsoAccount' },
			{ name: 'Newgistics', value: 'NewgisticsAccount' },
			{ name: 'OnTrac', value: 'OntracAccount' },
			{ name: 'Purolator', value: 'PurolatorAccount' },
			{ name: 'Royal Mail', value: 'RoyalMailAccount' },
			{ name: 'SEKO', value: 'SekoAccount' },
			{ name: 'Spee-Dee', value: 'SpeedeeAccount' },
			{ name: 'StarTrack', value: 'StartrackAccount' },
			{ name: 'UPS', value: 'UpsAccount' },
			{ name: 'UPS Mail Innovations', value: 'UpsMailInnovationsAccount' },
			{ name: 'UPS SurePost', value: 'UpsSurepostAccount' },
			{ name: 'USPS', value: 'UspsAccount' },
			{ name: 'Veho', value: 'VehoAccount' },
		],
		default: 'UspsAccount',
		required: true,
		description: 'The type of carrier account to create',
		displayOptions: {
			show: {
				resource: ['carrierAccount'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description: 'Description for the carrier account',
		displayOptions: {
			show: {
				resource: ['carrierAccount'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Reference',
		name: 'reference',
		type: 'string',
		default: '',
		description: 'Custom reference for the carrier account',
		displayOptions: {
			show: {
				resource: ['carrierAccount'],
				operation: ['create', 'update'],
			},
		},
	},
	// Credentials
	{
		displayName: 'Credentials',
		name: 'credentials',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		description: 'Carrier-specific credentials (varies by carrier)',
		displayOptions: {
			show: {
				resource: ['carrierAccount'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				name: 'credential',
				displayName: 'Credential',
				values: [
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
						description: 'Credential key name',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						typeOptions: { password: true },
						default: '',
						description: 'Credential value',
					},
				],
			},
		],
	},
	// Test Credentials
	{
		displayName: 'Test Credentials',
		name: 'testCredentials',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		description: 'Carrier-specific test credentials (for sandbox testing)',
		displayOptions: {
			show: {
				resource: ['carrierAccount'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				name: 'credential',
				displayName: 'Credential',
				values: [
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
						description: 'Credential key name',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						typeOptions: { password: true },
						default: '',
						description: 'Credential value',
					},
				],
			},
		],
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
				resource: ['carrierAccount'],
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
				resource: ['carrierAccount'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},
];
