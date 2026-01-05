/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

const BASE_URL = 'https://api.easypost.com/v2';

export async function easyPostApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject> {
	const options: {
		method: IHttpRequestMethods;
		url: string;
		body?: IDataObject;
		qs?: IDataObject;
		json: boolean;
	} = {
		method,
		url: `${BASE_URL}${endpoint}`,
		json: true,
	};

	if (Object.keys(body).length > 0) {
		options.body = body;
	}

	if (Object.keys(qs).length > 0) {
		options.qs = qs;
	}

	try {
		const response = await this.helpers.requestWithAuthentication.call(
			this,
			'easyPostApi',
			options,
		);
		return response as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function easyPostApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	propertyName: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	limit?: number,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let responseData: IDataObject;
	let hasMore = true;

	qs.page_size = qs.page_size || 100;

	do {
		responseData = await easyPostApiRequest.call(this, method, endpoint, body, qs);
		const items = responseData[propertyName] as IDataObject[];

		if (items && Array.isArray(items)) {
			returnData.push(...items);

			if (items.length > 0) {
				const lastItem = items[items.length - 1];
				qs.before_id = lastItem.id as string;
			}

			hasMore = responseData.has_more as boolean;
		} else {
			hasMore = false;
		}

		if (limit && returnData.length >= limit) {
			return returnData.slice(0, limit);
		}
	} while (hasMore);

	return returnData;
}

export function validateShipmentId(shipmentId: string): void {
	if (!shipmentId || !shipmentId.startsWith('shp_')) {
		throw new Error('Invalid shipment ID format. Shipment IDs should start with "shp_"');
	}
}

export function validateAddressId(addressId: string): void {
	if (!addressId || !addressId.startsWith('adr_')) {
		throw new Error('Invalid address ID format. Address IDs should start with "adr_"');
	}
}

export function validateParcelId(parcelId: string): void {
	if (!parcelId || !parcelId.startsWith('prcl_')) {
		throw new Error('Invalid parcel ID format. Parcel IDs should start with "prcl_"');
	}
}

export function validateTrackerId(trackerId: string): void {
	if (!trackerId || !trackerId.startsWith('trk_')) {
		throw new Error('Invalid tracker ID format. Tracker IDs should start with "trk_"');
	}
}

export function validateBatchId(batchId: string): void {
	if (!batchId || !batchId.startsWith('batch_')) {
		throw new Error('Invalid batch ID format. Batch IDs should start with "batch_"');
	}
}

export function validatePickupId(pickupId: string): void {
	if (!pickupId || !pickupId.startsWith('pickup_')) {
		throw new Error('Invalid pickup ID format. Pickup IDs should start with "pickup_"');
	}
}

export function validateRateId(rateId: string): void {
	if (!rateId || !rateId.startsWith('rate_')) {
		throw new Error('Invalid rate ID format. Rate IDs should start with "rate_"');
	}
}

export function buildAddressObject(
	prefix: string,
	data: IDataObject,
): IDataObject | undefined {
	const address: IDataObject = {};
	const fields = [
		'name',
		'company',
		'street1',
		'street2',
		'city',
		'state',
		'zip',
		'country',
		'phone',
		'email',
	];

	for (const field of fields) {
		const key = `${prefix}${field.charAt(0).toUpperCase()}${field.slice(1)}`;
		if (data[key] !== undefined && data[key] !== '') {
			address[field] = data[key];
		}
	}

	return Object.keys(address).length > 0 ? address : undefined;
}

export function buildParcelObject(data: IDataObject): IDataObject | undefined {
	const parcel: IDataObject = {};

	if (data.predefinedPackage) {
		parcel.predefined_package = data.predefinedPackage;
	} else {
		if (data.length) parcel.length = data.length;
		if (data.width) parcel.width = data.width;
		if (data.height) parcel.height = data.height;
	}

	if (data.weight) parcel.weight = data.weight;

	return Object.keys(parcel).length > 0 ? parcel : undefined;
}

export function buildOptionsObject(data: IDataObject): IDataObject | undefined {
	const options: IDataObject = {};

	const optionFields = [
		'label_format',
		'label_size',
		'print_custom_1',
		'print_custom_2',
		'print_custom_3',
		'delivery_confirmation',
		'saturday_delivery',
		'certified_mail',
		'registered_mail',
		'return_receipt',
		'hazmat',
		'special_rates_eligibility',
		'smartpost_hub',
		'smartpost_manifest',
		'endorsement',
		'handling_instructions',
		'machinable',
		'invoice_number',
		'po_number',
		'bill_receiver_account',
		'bill_receiver_postal_code',
		'bill_third_party_account',
		'bill_third_party_postal_code',
		'bill_third_party_country',
	];

	for (const field of optionFields) {
		const camelCase = field.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
		if (data[camelCase] !== undefined && data[camelCase] !== '') {
			options[field] = data[camelCase];
		}
	}

	return Object.keys(options).length > 0 ? options : undefined;
}

export function buildCustomsItemObject(data: IDataObject): IDataObject {
	const item: IDataObject = {};

	if (data.description) item.description = data.description;
	if (data.quantity) item.quantity = data.quantity;
	if (data.value) item.value = data.value;
	if (data.weight) item.weight = data.weight;
	if (data.hsTariffNumber) item.hs_tariff_number = data.hsTariffNumber;
	if (data.originCountry) item.origin_country = data.originCountry;
	if (data.code) item.code = data.code;
	if (data.currency) item.currency = data.currency;

	return item;
}

export function buildCustomsInfoObject(data: IDataObject): IDataObject | undefined {
	const customsInfo: IDataObject = {};

	if (data.customsCertify !== undefined) customsInfo.customs_certify = data.customsCertify;
	if (data.customsSigner) customsInfo.customs_signer = data.customsSigner;
	if (data.contentsType) customsInfo.contents_type = data.contentsType;
	if (data.contentsExplanation) customsInfo.contents_explanation = data.contentsExplanation;
	if (data.eelPfc) customsInfo.eel_pfc = data.eelPfc;
	if (data.nonDeliveryOption) customsInfo.non_delivery_option = data.nonDeliveryOption;
	if (data.restrictionType) customsInfo.restriction_type = data.restrictionType;
	if (data.restrictionComments) customsInfo.restriction_comments = data.restrictionComments;

	if (data.customsItems && Array.isArray(data.customsItems)) {
		customsInfo.customs_items = (data.customsItems as IDataObject[]).map((item) =>
			buildCustomsItemObject(item),
		);
	}

	return Object.keys(customsInfo).length > 0 ? customsInfo : undefined;
}
