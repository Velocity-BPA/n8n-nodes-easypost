/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const addressOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['address'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new address',
				action: 'Create an address',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve an address by ID',
				action: 'Get an address',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many addresses',
				action: 'Get many addresses',
			},
			{
				name: 'Verify',
				value: 'verify',
				description: 'Verify an existing address',
				action: 'Verify an address',
			},
		],
		default: 'create',
	},
];

export const addressFields: INodeProperties[] = [
	// Get/Verify operation
	{
		displayName: 'Address ID',
		name: 'addressId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the address (starts with adr_)',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['get', 'verify'],
			},
		},
	},
	// Create operation fields
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Recipient name',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Company',
		name: 'company',
		type: 'string',
		default: '',
		description: 'Company name',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Street 1',
		name: 'street1',
		type: 'string',
		default: '',
		required: true,
		description: 'Street address line 1',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Street 2',
		name: 'street2',
		type: 'string',
		default: '',
		description: 'Street address line 2 (apt, suite, etc)',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'City',
		name: 'city',
		type: 'string',
		default: '',
		required: true,
		description: 'City name',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'State',
		name: 'state',
		type: 'string',
		default: '',
		required: true,
		description: 'State or province code',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'ZIP',
		name: 'zip',
		type: 'string',
		default: '',
		required: true,
		description: 'Postal/ZIP code',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Country',
		name: 'country',
		type: 'string',
		default: 'US',
		required: true,
		description: 'Country code (ISO 3166)',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		default: '',
		description: 'Phone number',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		description: 'Email address',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
	},
	// Additional options for create
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Verify',
				name: 'verify',
				type: 'boolean',
				default: false,
				description: 'Whether to verify the address on creation',
			},
			{
				displayName: 'Strict Verification',
				name: 'verifyStrict',
				type: 'boolean',
				default: false,
				description: 'Whether to use strict address verification (will fail if unverifiable)',
			},
			{
				displayName: 'Federal Tax ID',
				name: 'federalTaxId',
				type: 'string',
				default: '',
				description: 'Federal tax ID (for international shipments)',
			},
			{
				displayName: 'State Tax ID',
				name: 'stateTaxId',
				type: 'string',
				default: '',
				description: 'State tax ID (for international shipments)',
			},
			{
				displayName: 'Residential',
				name: 'residential',
				type: 'boolean',
				default: false,
				description: 'Whether this is a residential address',
			},
			{
				displayName: 'Carrier Facility',
				name: 'carrierFacility',
				type: 'string',
				default: '',
				description: 'Carrier facility code',
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
				resource: ['address'],
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
				resource: ['address'],
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
				resource: ['address'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Before ID',
				name: 'beforeId',
				type: 'string',
				default: '',
				description: 'Get addresses before this ID',
			},
			{
				displayName: 'After ID',
				name: 'afterId',
				type: 'string',
				default: '',
				description: 'Get addresses after this ID',
			},
			{
				displayName: 'Start Date',
				name: 'startDatetime',
				type: 'dateTime',
				default: '',
				description: 'Start date for filtering addresses',
			},
			{
				displayName: 'End Date',
				name: 'endDatetime',
				type: 'dateTime',
				default: '',
				description: 'End date for filtering addresses',
			},
		],
	},
];
