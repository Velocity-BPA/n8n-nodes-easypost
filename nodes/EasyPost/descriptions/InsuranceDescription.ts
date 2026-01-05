/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const insuranceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['insurance'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create insurance for a shipment',
				action: 'Create insurance',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve insurance by ID',
				action: 'Get insurance',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many insurance records',
				action: 'Get many insurance records',
			},
			{
				name: 'Refund',
				value: 'refund',
				description: 'Request a refund for insurance',
				action: 'Refund insurance',
			},
		],
		default: 'create',
	},
];

export const insuranceFields: INodeProperties[] = [
	// Get/Refund operation
	{
		displayName: 'Insurance ID',
		name: 'insuranceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the insurance (starts with ins_)',
		displayOptions: {
			show: {
				resource: ['insurance'],
				operation: ['get', 'refund'],
			},
		},
	},
	// Create operation - Shipment method
	{
		displayName: 'Insurance Method',
		name: 'insuranceMethod',
		type: 'options',
		options: [
			{
				name: 'From Shipment',
				value: 'shipment',
				description: 'Create insurance from an existing shipment',
			},
			{
				name: 'Standalone',
				value: 'standalone',
				description: 'Create standalone insurance with tracking code',
			},
		],
		default: 'shipment',
		displayOptions: {
			show: {
				resource: ['insurance'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Shipment ID',
		name: 'shipmentId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the shipment to insure (starts with shp_)',
		displayOptions: {
			show: {
				resource: ['insurance'],
				operation: ['create'],
				insuranceMethod: ['shipment'],
			},
		},
	},
	// Standalone insurance fields
	{
		displayName: 'Tracking Code',
		name: 'trackingCode',
		type: 'string',
		required: true,
		default: '',
		description: 'The tracking code for the shipment',
		displayOptions: {
			show: {
				resource: ['insurance'],
				operation: ['create'],
				insuranceMethod: ['standalone'],
			},
		},
	},
	{
		displayName: 'Carrier',
		name: 'carrier',
		type: 'string',
		required: true,
		default: '',
		description: 'The carrier name',
		displayOptions: {
			show: {
				resource: ['insurance'],
				operation: ['create'],
				insuranceMethod: ['standalone'],
			},
		},
	},
	// Common fields for create
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		required: true,
		default: 0,
		description: 'The amount to insure in USD',
		displayOptions: {
			show: {
				resource: ['insurance'],
				operation: ['create'],
			},
		},
	},
	// To Address for standalone
	{
		displayName: 'To Name',
		name: 'toName',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['insurance'],
				operation: ['create'],
				insuranceMethod: ['standalone'],
			},
		},
	},
	{
		displayName: 'To Street 1',
		name: 'toStreet1',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['insurance'],
				operation: ['create'],
				insuranceMethod: ['standalone'],
			},
		},
	},
	{
		displayName: 'To City',
		name: 'toCity',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['insurance'],
				operation: ['create'],
				insuranceMethod: ['standalone'],
			},
		},
	},
	{
		displayName: 'To State',
		name: 'toState',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['insurance'],
				operation: ['create'],
				insuranceMethod: ['standalone'],
			},
		},
	},
	{
		displayName: 'To ZIP',
		name: 'toZip',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['insurance'],
				operation: ['create'],
				insuranceMethod: ['standalone'],
			},
		},
	},
	{
		displayName: 'To Country',
		name: 'toCountry',
		type: 'string',
		default: 'US',
		displayOptions: {
			show: {
				resource: ['insurance'],
				operation: ['create'],
				insuranceMethod: ['standalone'],
			},
		},
	},
	// From Address for standalone
	{
		displayName: 'From Name',
		name: 'fromName',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['insurance'],
				operation: ['create'],
				insuranceMethod: ['standalone'],
			},
		},
	},
	{
		displayName: 'From Street 1',
		name: 'fromStreet1',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['insurance'],
				operation: ['create'],
				insuranceMethod: ['standalone'],
			},
		},
	},
	{
		displayName: 'From City',
		name: 'fromCity',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['insurance'],
				operation: ['create'],
				insuranceMethod: ['standalone'],
			},
		},
	},
	{
		displayName: 'From State',
		name: 'fromState',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['insurance'],
				operation: ['create'],
				insuranceMethod: ['standalone'],
			},
		},
	},
	{
		displayName: 'From ZIP',
		name: 'fromZip',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['insurance'],
				operation: ['create'],
				insuranceMethod: ['standalone'],
			},
		},
	},
	{
		displayName: 'From Country',
		name: 'fromCountry',
		type: 'string',
		default: 'US',
		displayOptions: {
			show: {
				resource: ['insurance'],
				operation: ['create'],
				insuranceMethod: ['standalone'],
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
				resource: ['insurance'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Reference',
				name: 'reference',
				type: 'string',
				default: '',
				description: 'Custom reference for the insurance',
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
				resource: ['insurance'],
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
				resource: ['insurance'],
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
				resource: ['insurance'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Before ID',
				name: 'beforeId',
				type: 'string',
				default: '',
				description: 'Get insurance records before this ID',
			},
			{
				displayName: 'After ID',
				name: 'afterId',
				type: 'string',
				default: '',
				description: 'Get insurance records after this ID',
			},
			{
				displayName: 'Start Date',
				name: 'startDatetime',
				type: 'dateTime',
				default: '',
				description: 'Start date for filtering',
			},
			{
				displayName: 'End Date',
				name: 'endDatetime',
				type: 'dateTime',
				default: '',
				description: 'End date for filtering',
			},
		],
	},
];
