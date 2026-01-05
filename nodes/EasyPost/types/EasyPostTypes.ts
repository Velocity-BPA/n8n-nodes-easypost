/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

// Base types
export interface IEasyPostAddress extends IDataObject {
	id?: string;
	object?: string;
	name?: string;
	company?: string;
	street1?: string;
	street2?: string;
	city?: string;
	state?: string;
	zip?: string;
	country?: string;
	phone?: string;
	email?: string;
	mode?: string;
	carrier_facility?: string;
	residential?: boolean;
	federal_tax_id?: string;
	state_tax_id?: string;
	verifications?: IDataObject;
}

export interface IEasyPostParcel extends IDataObject {
	id?: string;
	object?: string;
	length?: number;
	width?: number;
	height?: number;
	weight?: number;
	predefined_package?: string;
	mode?: string;
}

export interface IEasyPostRate extends IDataObject {
	id?: string;
	object?: string;
	carrier?: string;
	service?: string;
	rate?: string;
	currency?: string;
	retail_rate?: string;
	retail_currency?: string;
	list_rate?: string;
	list_currency?: string;
	billing_type?: string;
	delivery_days?: number;
	delivery_date?: string;
	delivery_date_guaranteed?: boolean;
	est_delivery_days?: number;
	shipment_id?: string;
	carrier_account_id?: string;
}

export interface IEasyPostCustomsItem extends IDataObject {
	id?: string;
	object?: string;
	description?: string;
	quantity?: number;
	value?: string;
	weight?: number;
	hs_tariff_number?: string;
	origin_country?: string;
	code?: string;
	currency?: string;
}

export interface IEasyPostCustomsInfo extends IDataObject {
	id?: string;
	object?: string;
	customs_certify?: boolean;
	customs_signer?: string;
	contents_type?: string;
	contents_explanation?: string;
	eel_pfc?: string;
	non_delivery_option?: string;
	restriction_type?: string;
	restriction_comments?: string;
	customs_items?: IEasyPostCustomsItem[];
}

export interface IEasyPostShipment extends IDataObject {
	id?: string;
	object?: string;
	to_address?: IEasyPostAddress;
	from_address?: IEasyPostAddress;
	return_address?: IEasyPostAddress;
	buyer_address?: IEasyPostAddress;
	parcel?: IEasyPostParcel;
	customs_info?: IEasyPostCustomsInfo;
	rates?: IEasyPostRate[];
	selected_rate?: IEasyPostRate;
	postage_label?: IDataObject;
	tracking_code?: string;
	carrier?: string;
	service?: string;
	options?: IDataObject;
	insurance?: string;
	reference?: string;
	is_return?: boolean;
	messages?: IDataObject[];
	status?: string;
	fees?: IDataObject[];
	created_at?: string;
	updated_at?: string;
}

export interface IEasyPostTracker extends IDataObject {
	id?: string;
	object?: string;
	tracking_code?: string;
	carrier?: string;
	status?: string;
	status_detail?: string;
	signed_by?: string;
	weight?: number;
	est_delivery_date?: string;
	shipment_id?: string;
	public_url?: string;
	tracking_details?: IDataObject[];
	carrier_detail?: IDataObject;
	fees?: IDataObject[];
	created_at?: string;
	updated_at?: string;
}

export interface IEasyPostInsurance extends IDataObject {
	id?: string;
	object?: string;
	reference?: string;
	mode?: string;
	amount?: string;
	provider?: string;
	provider_id?: string;
	shipment_id?: string;
	tracking_code?: string;
	status?: string;
	tracker?: IEasyPostTracker;
	to_address?: IEasyPostAddress;
	from_address?: IEasyPostAddress;
	fee?: IDataObject;
	messages?: string[];
	created_at?: string;
	updated_at?: string;
}

export interface IEasyPostBatch extends IDataObject {
	id?: string;
	object?: string;
	reference?: string;
	mode?: string;
	state?: string;
	num_shipments?: number;
	shipments?: IEasyPostShipment[];
	status?: IDataObject;
	label_url?: string;
	scan_form?: IDataObject;
	pickup?: IDataObject;
	created_at?: string;
	updated_at?: string;
}

export interface IEasyPostScanForm extends IDataObject {
	id?: string;
	object?: string;
	status?: string;
	message?: string;
	address?: IEasyPostAddress;
	tracking_codes?: string[];
	form_url?: string;
	form_file_type?: string;
	batch_id?: string;
	created_at?: string;
	updated_at?: string;
}

export interface IEasyPostPickup extends IDataObject {
	id?: string;
	object?: string;
	mode?: string;
	status?: string;
	reference?: string;
	min_datetime?: string;
	max_datetime?: string;
	is_account_address?: boolean;
	instructions?: string;
	messages?: IDataObject[];
	confirmation?: string;
	address?: IEasyPostAddress;
	carrier_accounts?: IDataObject[];
	pickup_rates?: IDataObject[];
	created_at?: string;
	updated_at?: string;
}

export interface IEasyPostCarrierAccount extends IDataObject {
	id?: string;
	object?: string;
	type?: string;
	clone?: boolean;
	description?: string;
	reference?: string;
	readable?: string;
	credentials?: IDataObject;
	test_credentials?: IDataObject;
	fields?: IDataObject;
	billing_type?: string;
	created_at?: string;
	updated_at?: string;
}

export interface IEasyPostWebhook extends IDataObject {
	id?: string;
	object?: string;
	mode?: string;
	url?: string;
	webhook_secret?: string;
	disabled_at?: string;
	created_at?: string;
	updated_at?: string;
}

export interface IEasyPostError extends IDataObject {
	code?: string;
	message?: string;
	errors?: IDataObject[];
	field?: string;
}

export interface IEasyPostResponse<T> extends IDataObject {
	[key: string]: T[] | string | boolean | number | undefined;
	has_more?: boolean;
}

export type EasyPostResource =
	| 'shipment'
	| 'address'
	| 'parcel'
	| 'rate'
	| 'tracker'
	| 'insurance'
	| 'customsInfo'
	| 'customsItem'
	| 'batch'
	| 'scanForm'
	| 'pickup'
	| 'carrierAccount'
	| 'webhook';

export type ShipmentOperation =
	| 'create'
	| 'get'
	| 'getAll'
	| 'buy'
	| 'buyWithRate'
	| 'convertLabel'
	| 'insure'
	| 'refund'
	| 'regenerateRates';

export type AddressOperation = 'create' | 'get' | 'getAll' | 'verify';

export type ParcelOperation = 'create' | 'get';

export type RateOperation = 'getForShipment' | 'getSmartRates';

export type TrackerOperation = 'create' | 'get' | 'getAll';

export type InsuranceOperation = 'create' | 'get' | 'getAll' | 'refund';

export type CustomsInfoOperation = 'create' | 'get';

export type CustomsItemOperation = 'create' | 'get';

export type BatchOperation =
	| 'create'
	| 'get'
	| 'getAll'
	| 'addShipments'
	| 'removeShipments'
	| 'buy'
	| 'createScanForm';

export type ScanFormOperation = 'create' | 'get' | 'getAll';

export type PickupOperation = 'create' | 'get' | 'buy' | 'cancel';

export type CarrierAccountOperation = 'create' | 'get' | 'getAll' | 'update' | 'delete';

export type WebhookOperation = 'create' | 'get' | 'getAll' | 'update' | 'delete';

export interface IPaginationOptions extends IDataObject {
	page_size?: number;
	before_id?: string;
	after_id?: string;
	start_datetime?: string;
	end_datetime?: string;
}
