/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const customsItemOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customsItem'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a customs item',
				action: 'Create a customs item',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a customs item by ID',
				action: 'Get a customs item',
			},
		],
		default: 'create',
	},
];

export const customsItemFields: INodeProperties[] = [
	// Get operation
	{
		displayName: 'Customs Item ID',
		name: 'customsItemId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the customs item (starts with cstitem_)',
		displayOptions: {
			show: {
				resource: ['customsItem'],
				operation: ['get'],
			},
		},
	},
	// Create operation fields
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		required: true,
		description: 'Description of the item',
		displayOptions: {
			show: {
				resource: ['customsItem'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Quantity',
		name: 'quantity',
		type: 'number',
		default: 1,
		required: true,
		description: 'Number of items',
		displayOptions: {
			show: {
				resource: ['customsItem'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Value',
		name: 'value',
		type: 'number',
		default: 0,
		required: true,
		description: 'Value per item in USD',
		displayOptions: {
			show: {
				resource: ['customsItem'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Weight (oz)',
		name: 'weight',
		type: 'number',
		default: 0,
		required: true,
		description: 'Weight per item in ounces',
		displayOptions: {
			show: {
				resource: ['customsItem'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['customsItem'],
				operation: ['create'],
			},
		},
		options: [
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
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: 'USD',
				description: 'Currency for the value',
			},
		],
	},
];
