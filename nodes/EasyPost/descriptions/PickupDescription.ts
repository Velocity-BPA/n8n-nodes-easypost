/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const pickupOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['pickup'],
			},
		},
		options: [
			{
				name: 'Buy',
				value: 'buy',
				description: 'Purchase a scheduled pickup',
				action: 'Buy a pickup',
			},
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a scheduled pickup',
				action: 'Cancel a pickup',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Schedule a package pickup',
				action: 'Create a pickup',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a pickup by ID',
				action: 'Get a pickup',
			},
		],
		default: 'create',
	},
];

export const pickupFields: INodeProperties[] = [
	// Get/Buy/Cancel operation
	{
		displayName: 'Pickup ID',
		name: 'pickupId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the pickup (starts with pickup_)',
		displayOptions: {
			show: {
				resource: ['pickup'],
				operation: ['get', 'buy', 'cancel'],
			},
		},
	},
	// Buy operation
	{
		displayName: 'Carrier',
		name: 'carrier',
		type: 'string',
		required: true,
		default: '',
		description: 'The carrier providing the pickup',
		displayOptions: {
			show: {
				resource: ['pickup'],
				operation: ['buy'],
			},
		},
	},
	{
		displayName: 'Service',
		name: 'service',
		type: 'string',
		required: true,
		default: '',
		description: 'The pickup service level',
		displayOptions: {
			show: {
				resource: ['pickup'],
				operation: ['buy'],
			},
		},
	},
	// Create operation
	{
		displayName: 'Shipment ID',
		name: 'shipmentId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the shipment for pickup',
		displayOptions: {
			show: {
				resource: ['pickup'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Min Datetime',
		name: 'minDatetime',
		type: 'dateTime',
		required: true,
		default: '',
		description: 'Earliest time for pickup',
		displayOptions: {
			show: {
				resource: ['pickup'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Max Datetime',
		name: 'maxDatetime',
		type: 'dateTime',
		required: true,
		default: '',
		description: 'Latest time for pickup',
		displayOptions: {
			show: {
				resource: ['pickup'],
				operation: ['create'],
			},
		},
	},
	// Pickup address
	{
		displayName: 'Use Shipment Address',
		name: 'useShipmentAddress',
		type: 'boolean',
		default: true,
		description: 'Whether to use the from address from the shipment',
		displayOptions: {
			show: {
				resource: ['pickup'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Pickup Name',
		name: 'addressName',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['pickup'],
				operation: ['create'],
				useShipmentAddress: [false],
			},
		},
	},
	{
		displayName: 'Pickup Company',
		name: 'addressCompany',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['pickup'],
				operation: ['create'],
				useShipmentAddress: [false],
			},
		},
	},
	{
		displayName: 'Pickup Street 1',
		name: 'addressStreet1',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['pickup'],
				operation: ['create'],
				useShipmentAddress: [false],
			},
		},
	},
	{
		displayName: 'Pickup Street 2',
		name: 'addressStreet2',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['pickup'],
				operation: ['create'],
				useShipmentAddress: [false],
			},
		},
	},
	{
		displayName: 'Pickup City',
		name: 'addressCity',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['pickup'],
				operation: ['create'],
				useShipmentAddress: [false],
			},
		},
	},
	{
		displayName: 'Pickup State',
		name: 'addressState',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['pickup'],
				operation: ['create'],
				useShipmentAddress: [false],
			},
		},
	},
	{
		displayName: 'Pickup ZIP',
		name: 'addressZip',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['pickup'],
				operation: ['create'],
				useShipmentAddress: [false],
			},
		},
	},
	{
		displayName: 'Pickup Country',
		name: 'addressCountry',
		type: 'string',
		default: 'US',
		displayOptions: {
			show: {
				resource: ['pickup'],
				operation: ['create'],
				useShipmentAddress: [false],
			},
		},
	},
	{
		displayName: 'Pickup Phone',
		name: 'addressPhone',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['pickup'],
				operation: ['create'],
				useShipmentAddress: [false],
			},
		},
	},
	// Additional options
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['pickup'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Instructions',
				name: 'instructions',
				type: 'string',
				default: '',
				description: 'Special instructions for the pickup',
			},
			{
				displayName: 'Reference',
				name: 'reference',
				type: 'string',
				default: '',
				description: 'Custom reference for the pickup',
			},
			{
				displayName: 'Is Account Address',
				name: 'isAccountAddress',
				type: 'boolean',
				default: false,
				description: 'Whether the pickup address is a registered account address',
			},
		],
	},
];
