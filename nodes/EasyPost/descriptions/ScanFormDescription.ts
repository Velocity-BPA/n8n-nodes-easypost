/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const scanFormOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['scanForm'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a scan form (SCAN/manifest)',
				action: 'Create a scan form',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a scan form by ID',
				action: 'Get a scan form',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many scan forms',
				action: 'Get many scan forms',
			},
		],
		default: 'create',
	},
];

export const scanFormFields: INodeProperties[] = [
	// Get operation
	{
		displayName: 'Scan Form ID',
		name: 'scanFormId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the scan form (starts with sf_)',
		displayOptions: {
			show: {
				resource: ['scanForm'],
				operation: ['get'],
			},
		},
	},
	// Create operation
	{
		displayName: 'Shipment IDs',
		name: 'shipmentIds',
		type: 'string',
		required: true,
		default: '',
		description: 'Comma-separated list of shipment IDs to include in the scan form',
		displayOptions: {
			show: {
				resource: ['scanForm'],
				operation: ['create'],
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
				resource: ['scanForm'],
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
				resource: ['scanForm'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
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
				resource: ['scanForm'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Before ID',
				name: 'beforeId',
				type: 'string',
				default: '',
				description: 'Get scan forms before this ID',
			},
			{
				displayName: 'After ID',
				name: 'afterId',
				type: 'string',
				default: '',
				description: 'Get scan forms after this ID',
			},
			{
				displayName: 'Start Date',
				name: 'startDatetime',
				type: 'dateTime',
				default: '',
				description: 'Start date for filtering scan forms',
			},
			{
				displayName: 'End Date',
				name: 'endDatetime',
				type: 'dateTime',
				default: '',
				description: 'End date for filtering scan forms',
			},
		],
	},
];
