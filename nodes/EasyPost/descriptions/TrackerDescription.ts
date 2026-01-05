/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const trackerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['tracker'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a tracker for a tracking code',
				action: 'Create a tracker',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a tracker by ID',
				action: 'Get a tracker',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many trackers',
				action: 'Get many trackers',
			},
		],
		default: 'create',
	},
];

export const trackerFields: INodeProperties[] = [
	// Get operation
	{
		displayName: 'Tracker ID',
		name: 'trackerId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the tracker (starts with trk_)',
		displayOptions: {
			show: {
				resource: ['tracker'],
				operation: ['get'],
			},
		},
	},
	// Create operation fields
	{
		displayName: 'Tracking Code',
		name: 'trackingCode',
		type: 'string',
		required: true,
		default: '',
		description: 'The tracking number to track',
		displayOptions: {
			show: {
				resource: ['tracker'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Carrier',
		name: 'carrier',
		type: 'string',
		default: '',
		description: 'The carrier name (optional - will be auto-detected if not provided)',
		displayOptions: {
			show: {
				resource: ['tracker'],
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
				resource: ['tracker'],
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
				resource: ['tracker'],
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
				resource: ['tracker'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Before ID',
				name: 'beforeId',
				type: 'string',
				default: '',
				description: 'Get trackers before this ID',
			},
			{
				displayName: 'After ID',
				name: 'afterId',
				type: 'string',
				default: '',
				description: 'Get trackers after this ID',
			},
			{
				displayName: 'Start Date',
				name: 'startDatetime',
				type: 'dateTime',
				default: '',
				description: 'Start date for filtering trackers',
			},
			{
				displayName: 'End Date',
				name: 'endDatetime',
				type: 'dateTime',
				default: '',
				description: 'End date for filtering trackers',
			},
			{
				displayName: 'Tracking Code',
				name: 'trackingCode',
				type: 'string',
				default: '',
				description: 'Filter by tracking code',
			},
			{
				displayName: 'Carrier',
				name: 'carrier',
				type: 'string',
				default: '',
				description: 'Filter by carrier',
			},
		],
	},
];
