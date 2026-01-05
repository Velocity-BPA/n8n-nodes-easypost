/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const batchOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['batch'],
			},
		},
		options: [
			{
				name: 'Add Shipments',
				value: 'addShipments',
				description: 'Add shipments to a batch',
				action: 'Add shipments to batch',
			},
			{
				name: 'Buy',
				value: 'buy',
				description: 'Purchase all labels in a batch',
				action: 'Buy batch labels',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new batch',
				action: 'Create a batch',
			},
			{
				name: 'Create Scan Form',
				value: 'createScanForm',
				description: 'Generate a scan form for the batch',
				action: 'Create scan form for batch',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a batch by ID',
				action: 'Get a batch',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many batches',
				action: 'Get many batches',
			},
			{
				name: 'Remove Shipments',
				value: 'removeShipments',
				description: 'Remove shipments from a batch',
				action: 'Remove shipments from batch',
			},
		],
		default: 'create',
	},
];

export const batchFields: INodeProperties[] = [
	// Get/Buy/CreateScanForm/AddShipments/RemoveShipments operation
	{
		displayName: 'Batch ID',
		name: 'batchId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the batch (starts with batch_)',
		displayOptions: {
			show: {
				resource: ['batch'],
				operation: ['get', 'buy', 'createScanForm', 'addShipments', 'removeShipments'],
			},
		},
	},
	// Create operation
	{
		displayName: 'Reference',
		name: 'reference',
		type: 'string',
		default: '',
		description: 'Custom reference for the batch',
		displayOptions: {
			show: {
				resource: ['batch'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Shipment IDs',
		name: 'shipmentIds',
		type: 'string',
		default: '',
		description: 'Comma-separated list of shipment IDs to include in the batch',
		displayOptions: {
			show: {
				resource: ['batch'],
				operation: ['create', 'addShipments', 'removeShipments'],
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
				resource: ['batch'],
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
				resource: ['batch'],
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
				resource: ['batch'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Before ID',
				name: 'beforeId',
				type: 'string',
				default: '',
				description: 'Get batches before this ID',
			},
			{
				displayName: 'After ID',
				name: 'afterId',
				type: 'string',
				default: '',
				description: 'Get batches after this ID',
			},
			{
				displayName: 'Start Date',
				name: 'startDatetime',
				type: 'dateTime',
				default: '',
				description: 'Start date for filtering batches',
			},
			{
				displayName: 'End Date',
				name: 'endDatetime',
				type: 'dateTime',
				default: '',
				description: 'End date for filtering batches',
			},
		],
	},
	// Scan Form options
	{
		displayName: 'File Format',
		name: 'fileFormat',
		type: 'options',
		options: [
			{ name: 'PDF', value: 'PDF' },
			{ name: 'ZPL', value: 'ZPL' },
		],
		default: 'PDF',
		description: 'Format for the scan form',
		displayOptions: {
			show: {
				resource: ['batch'],
				operation: ['createScanForm'],
			},
		},
	},
];
