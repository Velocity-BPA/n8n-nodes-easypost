/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	easyPostApiRequest,
	easyPostApiRequestAllItems,
	buildAddressObject,
	buildOptionsObject,
	validateShipmentId,
	validateAddressId,
	validateParcelId,
	validateTrackerId,
	validateBatchId,
	validatePickupId,
	validateRateId,
} from './transport';

import {
	shipmentOperations,
	shipmentFields,
	addressOperations,
	addressFields,
	parcelOperations,
	parcelFields,
	rateOperations,
	rateFields,
	trackerOperations,
	trackerFields,
	insuranceOperations,
	insuranceFields,
	customsInfoOperations,
	customsInfoFields,
	customsItemOperations,
	customsItemFields,
	batchOperations,
	batchFields,
	scanFormOperations,
	scanFormFields,
	pickupOperations,
	pickupFields,
	carrierAccountOperations,
	carrierAccountFields,
	webhookOperations,
	webhookFields,
} from './descriptions';

// License notice logged once per node load
const LICENSING_NOTICE = `[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`;

let licenseNoticeLogged = false;

function logLicenseNotice(): void {
	if (!licenseNoticeLogged) {
		console.warn(LICENSING_NOTICE);
		licenseNoticeLogged = true;
	}
}

export class EasyPost implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'EasyPost',
		name: 'easyPost',
		icon: 'file:easypost.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the EasyPost shipping API',
		defaults: {
			name: 'EasyPost',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'easyPostApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Address',
						value: 'address',
					},
					{
						name: 'Batch',
						value: 'batch',
					},
					{
						name: 'Carrier Account',
						value: 'carrierAccount',
					},
					{
						name: 'Customs Info',
						value: 'customsInfo',
					},
					{
						name: 'Customs Item',
						value: 'customsItem',
					},
					{
						name: 'Insurance',
						value: 'insurance',
					},
					{
						name: 'Parcel',
						value: 'parcel',
					},
					{
						name: 'Pickup',
						value: 'pickup',
					},
					{
						name: 'Rate',
						value: 'rate',
					},
					{
						name: 'Scan Form',
						value: 'scanForm',
					},
					{
						name: 'Shipment',
						value: 'shipment',
					},
					{
						name: 'Tracker',
						value: 'tracker',
					},
					{
						name: 'Webhook',
						value: 'webhook',
					},
				],
				default: 'shipment',
			},
			// Shipment
			...shipmentOperations,
			...shipmentFields,
			// Address
			...addressOperations,
			...addressFields,
			// Parcel
			...parcelOperations,
			...parcelFields,
			// Rate
			...rateOperations,
			...rateFields,
			// Tracker
			...trackerOperations,
			...trackerFields,
			// Insurance
			...insuranceOperations,
			...insuranceFields,
			// Customs Info
			...customsInfoOperations,
			...customsInfoFields,
			// Customs Item
			...customsItemOperations,
			...customsItemFields,
			// Batch
			...batchOperations,
			...batchFields,
			// Scan Form
			...scanFormOperations,
			...scanFormFields,
			// Pickup
			...pickupOperations,
			...pickupFields,
			// Carrier Account
			...carrierAccountOperations,
			...carrierAccountFields,
			// Webhook
			...webhookOperations,
			...webhookFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		logLicenseNotice();

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// ===== SHIPMENT OPERATIONS =====
				if (resource === 'shipment') {
					if (operation === 'create') {
						const body: IDataObject = {
							shipment: {
								to_address: buildAddressObject('to', this.getNodeParameter('', i, {}) as IDataObject) || {
									name: this.getNodeParameter('toName', i, '') as string,
									company: this.getNodeParameter('toCompany', i, '') as string,
									street1: this.getNodeParameter('toStreet1', i) as string,
									street2: this.getNodeParameter('toStreet2', i, '') as string,
									city: this.getNodeParameter('toCity', i) as string,
									state: this.getNodeParameter('toState', i) as string,
									zip: this.getNodeParameter('toZip', i) as string,
									country: this.getNodeParameter('toCountry', i) as string,
									phone: this.getNodeParameter('toPhone', i, '') as string,
									email: this.getNodeParameter('toEmail', i, '') as string,
								},
								from_address: buildAddressObject('from', this.getNodeParameter('', i, {}) as IDataObject) || {
									name: this.getNodeParameter('fromName', i, '') as string,
									company: this.getNodeParameter('fromCompany', i, '') as string,
									street1: this.getNodeParameter('fromStreet1', i) as string,
									street2: this.getNodeParameter('fromStreet2', i, '') as string,
									city: this.getNodeParameter('fromCity', i) as string,
									state: this.getNodeParameter('fromState', i) as string,
									zip: this.getNodeParameter('fromZip', i) as string,
									country: this.getNodeParameter('fromCountry', i) as string,
									phone: this.getNodeParameter('fromPhone', i, '') as string,
									email: this.getNodeParameter('fromEmail', i, '') as string,
								},
								parcel: {} as IDataObject,
							},
						};

						const usePredefined = this.getNodeParameter('usePredefinedPackage', i, false) as boolean;
						if (usePredefined) {
							(body.shipment as IDataObject).parcel = {
								predefined_package: this.getNodeParameter('predefinedPackage', i) as string,
								weight: this.getNodeParameter('weight', i) as number,
							};
						} else {
							(body.shipment as IDataObject).parcel = {
								length: this.getNodeParameter('length', i, 0) as number,
								width: this.getNodeParameter('width', i, 0) as number,
								height: this.getNodeParameter('height', i, 0) as number,
								weight: this.getNodeParameter('weight', i) as number,
							};
						}

						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
						if (additionalOptions.reference) {
							(body.shipment as IDataObject).reference = additionalOptions.reference;
						}
						if (additionalOptions.isReturn) {
							(body.shipment as IDataObject).is_return = additionalOptions.isReturn;
						}

						const options = buildOptionsObject(additionalOptions);
						if (options) {
							(body.shipment as IDataObject).options = options;
						}

						if (additionalOptions.carrierAccounts) {
							const accounts = (additionalOptions.carrierAccounts as string).split(',').map((a) => a.trim());
							(body.shipment as IDataObject).carrier_accounts = accounts;
						}

						responseData = await easyPostApiRequest.call(this, 'POST', '/shipments', body);
					}

					if (operation === 'get') {
						const shipmentId = this.getNodeParameter('shipmentId', i) as string;
						validateShipmentId(shipmentId);
						responseData = await easyPostApiRequest.call(this, 'GET', `/shipments/${shipmentId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const qs: IDataObject = {};

						if (filters.beforeId) qs.before_id = filters.beforeId;
						if (filters.afterId) qs.after_id = filters.afterId;
						if (filters.startDatetime) qs.start_datetime = filters.startDatetime;
						if (filters.endDatetime) qs.end_datetime = filters.endDatetime;
						if (filters.purchased !== undefined) qs.purchased = filters.purchased;
						if (filters.includeChildren) qs.include_children = filters.includeChildren;

						if (returnAll) {
							responseData = await easyPostApiRequestAllItems.call(
								this,
								'GET',
								'/shipments',
								'shipments',
								{},
								qs,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.page_size = limit;
							const response = await easyPostApiRequest.call(this, 'GET', '/shipments', {}, qs);
							responseData = (response.shipments as IDataObject[]) || [];
						}
					}

					if (operation === 'buy') {
						const shipmentId = this.getNodeParameter('shipmentId', i) as string;
						const rateId = this.getNodeParameter('rateId', i) as string;
						validateShipmentId(shipmentId);
						validateRateId(rateId);

						const body = { rate: { id: rateId } };
						responseData = await easyPostApiRequest.call(
							this,
							'POST',
							`/shipments/${shipmentId}/buy`,
							body,
						);
					}

					if (operation === 'buyWithRate') {
						const body: IDataObject = {
							shipment: {
								to_address: {
									name: this.getNodeParameter('toName', i, '') as string,
									company: this.getNodeParameter('toCompany', i, '') as string,
									street1: this.getNodeParameter('toStreet1', i) as string,
									street2: this.getNodeParameter('toStreet2', i, '') as string,
									city: this.getNodeParameter('toCity', i) as string,
									state: this.getNodeParameter('toState', i) as string,
									zip: this.getNodeParameter('toZip', i) as string,
									country: this.getNodeParameter('toCountry', i) as string,
									phone: this.getNodeParameter('toPhone', i, '') as string,
									email: this.getNodeParameter('toEmail', i, '') as string,
								},
								from_address: {
									name: this.getNodeParameter('fromName', i, '') as string,
									company: this.getNodeParameter('fromCompany', i, '') as string,
									street1: this.getNodeParameter('fromStreet1', i) as string,
									street2: this.getNodeParameter('fromStreet2', i, '') as string,
									city: this.getNodeParameter('fromCity', i) as string,
									state: this.getNodeParameter('fromState', i) as string,
									zip: this.getNodeParameter('fromZip', i) as string,
									country: this.getNodeParameter('fromCountry', i) as string,
									phone: this.getNodeParameter('fromPhone', i, '') as string,
									email: this.getNodeParameter('fromEmail', i, '') as string,
								},
								parcel: {} as IDataObject,
								carrier: this.getNodeParameter('carrier', i) as string,
								service: this.getNodeParameter('service', i) as string,
							},
						};

						const usePredefined = this.getNodeParameter('usePredefinedPackage', i, false) as boolean;
						if (usePredefined) {
							(body.shipment as IDataObject).parcel = {
								predefined_package: this.getNodeParameter('predefinedPackage', i) as string,
								weight: this.getNodeParameter('weight', i) as number,
							};
						} else {
							(body.shipment as IDataObject).parcel = {
								length: this.getNodeParameter('length', i, 0) as number,
								width: this.getNodeParameter('width', i, 0) as number,
								height: this.getNodeParameter('height', i, 0) as number,
								weight: this.getNodeParameter('weight', i) as number,
							};
						}

						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
						const options = buildOptionsObject(additionalOptions);
						if (options) {
							(body.shipment as IDataObject).options = options;
						}

						responseData = await easyPostApiRequest.call(this, 'POST', '/shipments', body);
					}

					if (operation === 'convertLabel') {
						const shipmentId = this.getNodeParameter('shipmentId', i) as string;
						const labelFormat = this.getNodeParameter('labelFormat', i) as string;
						validateShipmentId(shipmentId);

						const body = { file_format: labelFormat };
						responseData = await easyPostApiRequest.call(
							this,
							'GET',
							`/shipments/${shipmentId}/label`,
							body,
						);
					}

					if (operation === 'insure') {
						const shipmentId = this.getNodeParameter('shipmentId', i) as string;
						const amount = this.getNodeParameter('insuranceAmount', i) as number;
						validateShipmentId(shipmentId);

						const body = { amount: amount.toString() };
						responseData = await easyPostApiRequest.call(
							this,
							'POST',
							`/shipments/${shipmentId}/insure`,
							body,
						);
					}

					if (operation === 'refund') {
						const shipmentId = this.getNodeParameter('shipmentId', i) as string;
						validateShipmentId(shipmentId);
						responseData = await easyPostApiRequest.call(
							this,
							'POST',
							`/shipments/${shipmentId}/refund`,
						);
					}

					if (operation === 'regenerateRates') {
						const shipmentId = this.getNodeParameter('shipmentId', i) as string;
						validateShipmentId(shipmentId);
						responseData = await easyPostApiRequest.call(
							this,
							'POST',
							`/shipments/${shipmentId}/rerate`,
						);
					}
				}

				// ===== ADDRESS OPERATIONS =====
				if (resource === 'address') {
					if (operation === 'create') {
						const body: IDataObject = {
							address: {
								name: this.getNodeParameter('name', i, '') as string,
								company: this.getNodeParameter('company', i, '') as string,
								street1: this.getNodeParameter('street1', i) as string,
								street2: this.getNodeParameter('street2', i, '') as string,
								city: this.getNodeParameter('city', i) as string,
								state: this.getNodeParameter('state', i) as string,
								zip: this.getNodeParameter('zip', i) as string,
								country: this.getNodeParameter('country', i) as string,
								phone: this.getNodeParameter('phone', i, '') as string,
								email: this.getNodeParameter('email', i, '') as string,
							},
						};

						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
						if (additionalOptions.federalTaxId) {
							(body.address as IDataObject).federal_tax_id = additionalOptions.federalTaxId;
						}
						if (additionalOptions.stateTaxId) {
							(body.address as IDataObject).state_tax_id = additionalOptions.stateTaxId;
						}
						if (additionalOptions.residential !== undefined) {
							(body.address as IDataObject).residential = additionalOptions.residential;
						}
						if (additionalOptions.carrierFacility) {
							(body.address as IDataObject).carrier_facility = additionalOptions.carrierFacility;
						}
						if (additionalOptions.verify) {
							body.verify = ['delivery'];
						}
						if (additionalOptions.verifyStrict) {
							body.verify_strict = ['delivery'];
						}

						responseData = await easyPostApiRequest.call(this, 'POST', '/addresses', body);
					}

					if (operation === 'get') {
						const addressId = this.getNodeParameter('addressId', i) as string;
						validateAddressId(addressId);
						responseData = await easyPostApiRequest.call(this, 'GET', `/addresses/${addressId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const qs: IDataObject = {};

						if (filters.beforeId) qs.before_id = filters.beforeId;
						if (filters.afterId) qs.after_id = filters.afterId;
						if (filters.startDatetime) qs.start_datetime = filters.startDatetime;
						if (filters.endDatetime) qs.end_datetime = filters.endDatetime;

						if (returnAll) {
							responseData = await easyPostApiRequestAllItems.call(
								this,
								'GET',
								'/addresses',
								'addresses',
								{},
								qs,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.page_size = limit;
							const response = await easyPostApiRequest.call(this, 'GET', '/addresses', {}, qs);
							responseData = (response.addresses as IDataObject[]) || [];
						}
					}

					if (operation === 'verify') {
						const addressId = this.getNodeParameter('addressId', i) as string;
						validateAddressId(addressId);
						responseData = await easyPostApiRequest.call(
							this,
							'GET',
							`/addresses/${addressId}/verify`,
						);
					}
				}

				// ===== PARCEL OPERATIONS =====
				if (resource === 'parcel') {
					if (operation === 'create') {
						const usePredefined = this.getNodeParameter('usePredefinedPackage', i, false) as boolean;
						let parcel: IDataObject;

						if (usePredefined) {
							parcel = {
								predefined_package: this.getNodeParameter('predefinedPackage', i) as string,
								weight: this.getNodeParameter('weight', i) as number,
							};
						} else {
							parcel = {
								length: this.getNodeParameter('length', i) as number,
								width: this.getNodeParameter('width', i) as number,
								height: this.getNodeParameter('height', i) as number,
								weight: this.getNodeParameter('weight', i) as number,
							};
						}

						responseData = await easyPostApiRequest.call(this, 'POST', '/parcels', { parcel });
					}

					if (operation === 'get') {
						const parcelId = this.getNodeParameter('parcelId', i) as string;
						validateParcelId(parcelId);
						responseData = await easyPostApiRequest.call(this, 'GET', `/parcels/${parcelId}`);
					}
				}

				// ===== RATE OPERATIONS =====
				if (resource === 'rate') {
					if (operation === 'getForShipment') {
						const shipmentId = this.getNodeParameter('shipmentId', i) as string;
						validateShipmentId(shipmentId);

						const response = await easyPostApiRequest.call(this, 'GET', `/shipments/${shipmentId}`);
						let rates = (response.rates as IDataObject[]) || [];

						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						if (filters.carrier) {
							rates = rates.filter(
								(r) => (r.carrier as string)?.toLowerCase() === (filters.carrier as string).toLowerCase(),
							);
						}
						if (filters.service) {
							rates = rates.filter(
								(r) => (r.service as string)?.toLowerCase() === (filters.service as string).toLowerCase(),
							);
						}

						responseData = rates;
					}

					if (operation === 'getSmartRates') {
						const shipmentId = this.getNodeParameter('shipmentId', i) as string;
						validateShipmentId(shipmentId);

						responseData = await easyPostApiRequest.call(
							this,
							'GET',
							`/shipments/${shipmentId}/smartrate`,
						);
					}
				}

				// ===== TRACKER OPERATIONS =====
				if (resource === 'tracker') {
					if (operation === 'create') {
						const body: IDataObject = {
							tracker: {
								tracking_code: this.getNodeParameter('trackingCode', i) as string,
							},
						};

						const carrier = this.getNodeParameter('carrier', i, '') as string;
						if (carrier) {
							(body.tracker as IDataObject).carrier = carrier;
						}

						responseData = await easyPostApiRequest.call(this, 'POST', '/trackers', body);
					}

					if (operation === 'get') {
						const trackerId = this.getNodeParameter('trackerId', i) as string;
						validateTrackerId(trackerId);
						responseData = await easyPostApiRequest.call(this, 'GET', `/trackers/${trackerId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const qs: IDataObject = {};

						if (filters.beforeId) qs.before_id = filters.beforeId;
						if (filters.afterId) qs.after_id = filters.afterId;
						if (filters.startDatetime) qs.start_datetime = filters.startDatetime;
						if (filters.endDatetime) qs.end_datetime = filters.endDatetime;
						if (filters.trackingCode) qs.tracking_code = filters.trackingCode;
						if (filters.carrier) qs.carrier = filters.carrier;

						if (returnAll) {
							responseData = await easyPostApiRequestAllItems.call(
								this,
								'GET',
								'/trackers',
								'trackers',
								{},
								qs,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.page_size = limit;
							const response = await easyPostApiRequest.call(this, 'GET', '/trackers', {}, qs);
							responseData = (response.trackers as IDataObject[]) || [];
						}
					}
				}

				// ===== INSURANCE OPERATIONS =====
				if (resource === 'insurance') {
					if (operation === 'create') {
						const insuranceMethod = this.getNodeParameter('insuranceMethod', i) as string;
						const amount = this.getNodeParameter('amount', i) as number;

						if (insuranceMethod === 'shipment') {
							const shipmentId = this.getNodeParameter('shipmentId', i) as string;
							validateShipmentId(shipmentId);

							responseData = await easyPostApiRequest.call(
								this,
								'POST',
								`/shipments/${shipmentId}/insure`,
								{ amount: amount.toString() },
							);
						} else {
							const body: IDataObject = {
								insurance: {
									tracking_code: this.getNodeParameter('trackingCode', i) as string,
									carrier: this.getNodeParameter('carrier', i) as string,
									amount: amount.toString(),
									to_address: {
										name: this.getNodeParameter('toName', i, '') as string,
										street1: this.getNodeParameter('toStreet1', i) as string,
										city: this.getNodeParameter('toCity', i) as string,
										state: this.getNodeParameter('toState', i) as string,
										zip: this.getNodeParameter('toZip', i) as string,
										country: this.getNodeParameter('toCountry', i, 'US') as string,
									},
									from_address: {
										name: this.getNodeParameter('fromName', i, '') as string,
										street1: this.getNodeParameter('fromStreet1', i) as string,
										city: this.getNodeParameter('fromCity', i) as string,
										state: this.getNodeParameter('fromState', i) as string,
										zip: this.getNodeParameter('fromZip', i) as string,
										country: this.getNodeParameter('fromCountry', i, 'US') as string,
									},
								},
							};

							const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
							if (additionalOptions.reference) {
								(body.insurance as IDataObject).reference = additionalOptions.reference;
							}

							responseData = await easyPostApiRequest.call(this, 'POST', '/insurances', body);
						}
					}

					if (operation === 'get') {
						const insuranceId = this.getNodeParameter('insuranceId', i) as string;
						responseData = await easyPostApiRequest.call(this, 'GET', `/insurances/${insuranceId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const qs: IDataObject = {};

						if (filters.beforeId) qs.before_id = filters.beforeId;
						if (filters.afterId) qs.after_id = filters.afterId;
						if (filters.startDatetime) qs.start_datetime = filters.startDatetime;
						if (filters.endDatetime) qs.end_datetime = filters.endDatetime;

						if (returnAll) {
							responseData = await easyPostApiRequestAllItems.call(
								this,
								'GET',
								'/insurances',
								'insurances',
								{},
								qs,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.page_size = limit;
							const response = await easyPostApiRequest.call(this, 'GET', '/insurances', {}, qs);
							responseData = (response.insurances as IDataObject[]) || [];
						}
					}

					if (operation === 'refund') {
						const insuranceId = this.getNodeParameter('insuranceId', i) as string;
						responseData = await easyPostApiRequest.call(
							this,
							'POST',
							`/insurances/${insuranceId}/refund`,
						);
					}
				}

				// ===== CUSTOMS INFO OPERATIONS =====
				if (resource === 'customsInfo') {
					if (operation === 'create') {
						const customsItems = this.getNodeParameter('customsItems', i, {}) as IDataObject;
						const items: IDataObject[] = [];

						if (customsItems.item && Array.isArray(customsItems.item)) {
							for (const item of customsItems.item as IDataObject[]) {
								items.push({
									description: item.description,
									quantity: item.quantity,
									value: item.value,
									weight: item.weight,
									hs_tariff_number: item.hsTariffNumber || undefined,
									origin_country: item.originCountry || 'US',
									code: item.code || undefined,
								});
							}
						}

						const body: IDataObject = {
							customs_info: {
								customs_certify: this.getNodeParameter('customsCertify', i) as boolean,
								customs_signer: this.getNodeParameter('customsSigner', i) as string,
								contents_type: this.getNodeParameter('contentsType', i) as string,
								contents_explanation: this.getNodeParameter('contentsExplanation', i, '') as string,
								non_delivery_option: this.getNodeParameter('nonDeliveryOption', i) as string,
								restriction_type: this.getNodeParameter('restrictionType', i) as string,
								restriction_comments: this.getNodeParameter('restrictionComments', i, '') as string,
								customs_items: items,
							},
						};

						const eelPfc = this.getNodeParameter('eelPfc', i) as string;
						if (eelPfc === 'custom') {
							(body.customs_info as IDataObject).eel_pfc = this.getNodeParameter('customEelPfc', i) as string;
						} else if (eelPfc) {
							(body.customs_info as IDataObject).eel_pfc = eelPfc;
						}

						responseData = await easyPostApiRequest.call(this, 'POST', '/customs_infos', body);
					}

					if (operation === 'get') {
						const customsInfoId = this.getNodeParameter('customsInfoId', i) as string;
						responseData = await easyPostApiRequest.call(
							this,
							'GET',
							`/customs_infos/${customsInfoId}`,
						);
					}
				}

				// ===== CUSTOMS ITEM OPERATIONS =====
				if (resource === 'customsItem') {
					if (operation === 'create') {
						const body: IDataObject = {
							customs_item: {
								description: this.getNodeParameter('description', i) as string,
								quantity: this.getNodeParameter('quantity', i) as number,
								value: this.getNodeParameter('value', i) as number,
								weight: this.getNodeParameter('weight', i) as number,
							},
						};

						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
						if (additionalOptions.hsTariffNumber) {
							(body.customs_item as IDataObject).hs_tariff_number = additionalOptions.hsTariffNumber;
						}
						if (additionalOptions.originCountry) {
							(body.customs_item as IDataObject).origin_country = additionalOptions.originCountry;
						}
						if (additionalOptions.code) {
							(body.customs_item as IDataObject).code = additionalOptions.code;
						}
						if (additionalOptions.currency) {
							(body.customs_item as IDataObject).currency = additionalOptions.currency;
						}

						responseData = await easyPostApiRequest.call(this, 'POST', '/customs_items', body);
					}

					if (operation === 'get') {
						const customsItemId = this.getNodeParameter('customsItemId', i) as string;
						responseData = await easyPostApiRequest.call(
							this,
							'GET',
							`/customs_items/${customsItemId}`,
						);
					}
				}

				// ===== BATCH OPERATIONS =====
				if (resource === 'batch') {
					if (operation === 'create') {
						const body: IDataObject = { batch: {} };

						const reference = this.getNodeParameter('reference', i, '') as string;
						if (reference) {
							(body.batch as IDataObject).reference = reference;
						}

						const shipmentIds = this.getNodeParameter('shipmentIds', i, '') as string;
						if (shipmentIds) {
							const ids = shipmentIds.split(',').map((id) => ({ id: id.trim() }));
							(body.batch as IDataObject).shipments = ids;
						}

						responseData = await easyPostApiRequest.call(this, 'POST', '/batches', body);
					}

					if (operation === 'get') {
						const batchId = this.getNodeParameter('batchId', i) as string;
						validateBatchId(batchId);
						responseData = await easyPostApiRequest.call(this, 'GET', `/batches/${batchId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const qs: IDataObject = {};

						if (filters.beforeId) qs.before_id = filters.beforeId;
						if (filters.afterId) qs.after_id = filters.afterId;
						if (filters.startDatetime) qs.start_datetime = filters.startDatetime;
						if (filters.endDatetime) qs.end_datetime = filters.endDatetime;

						if (returnAll) {
							responseData = await easyPostApiRequestAllItems.call(
								this,
								'GET',
								'/batches',
								'batches',
								{},
								qs,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.page_size = limit;
							const response = await easyPostApiRequest.call(this, 'GET', '/batches', {}, qs);
							responseData = (response.batches as IDataObject[]) || [];
						}
					}

					if (operation === 'addShipments') {
						const batchId = this.getNodeParameter('batchId', i) as string;
						const shipmentIds = this.getNodeParameter('shipmentIds', i) as string;
						validateBatchId(batchId);

						const ids = shipmentIds.split(',').map((id) => ({ id: id.trim() }));
						responseData = await easyPostApiRequest.call(
							this,
							'POST',
							`/batches/${batchId}/add_shipments`,
							{ shipments: ids },
						);
					}

					if (operation === 'removeShipments') {
						const batchId = this.getNodeParameter('batchId', i) as string;
						const shipmentIds = this.getNodeParameter('shipmentIds', i) as string;
						validateBatchId(batchId);

						const ids = shipmentIds.split(',').map((id) => ({ id: id.trim() }));
						responseData = await easyPostApiRequest.call(
							this,
							'POST',
							`/batches/${batchId}/remove_shipments`,
							{ shipments: ids },
						);
					}

					if (operation === 'buy') {
						const batchId = this.getNodeParameter('batchId', i) as string;
						validateBatchId(batchId);
						responseData = await easyPostApiRequest.call(this, 'POST', `/batches/${batchId}/buy`);
					}

					if (operation === 'createScanForm') {
						const batchId = this.getNodeParameter('batchId', i) as string;
						const fileFormat = this.getNodeParameter('fileFormat', i, 'PDF') as string;
						validateBatchId(batchId);

						responseData = await easyPostApiRequest.call(
							this,
							'POST',
							`/batches/${batchId}/scan_form`,
							{ file_format: fileFormat },
						);
					}
				}

				// ===== SCAN FORM OPERATIONS =====
				if (resource === 'scanForm') {
					if (operation === 'create') {
						const shipmentIds = this.getNodeParameter('shipmentIds', i) as string;
						const ids = shipmentIds.split(',').map((id) => ({ id: id.trim() }));

						responseData = await easyPostApiRequest.call(this, 'POST', '/scan_forms', {
							shipments: ids,
						});
					}

					if (operation === 'get') {
						const scanFormId = this.getNodeParameter('scanFormId', i) as string;
						responseData = await easyPostApiRequest.call(this, 'GET', `/scan_forms/${scanFormId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const qs: IDataObject = {};

						if (filters.beforeId) qs.before_id = filters.beforeId;
						if (filters.afterId) qs.after_id = filters.afterId;
						if (filters.startDatetime) qs.start_datetime = filters.startDatetime;
						if (filters.endDatetime) qs.end_datetime = filters.endDatetime;

						if (returnAll) {
							responseData = await easyPostApiRequestAllItems.call(
								this,
								'GET',
								'/scan_forms',
								'scan_forms',
								{},
								qs,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.page_size = limit;
							const response = await easyPostApiRequest.call(this, 'GET', '/scan_forms', {}, qs);
							responseData = (response.scan_forms as IDataObject[]) || [];
						}
					}
				}

				// ===== PICKUP OPERATIONS =====
				if (resource === 'pickup') {
					if (operation === 'create') {
						const shipmentId = this.getNodeParameter('shipmentId', i) as string;
						validateShipmentId(shipmentId);

						const body: IDataObject = {
							pickup: {
								shipment: { id: shipmentId },
								min_datetime: this.getNodeParameter('minDatetime', i) as string,
								max_datetime: this.getNodeParameter('maxDatetime', i) as string,
							},
						};

						const useShipmentAddress = this.getNodeParameter('useShipmentAddress', i, true) as boolean;
						if (!useShipmentAddress) {
							(body.pickup as IDataObject).address = {
								name: this.getNodeParameter('addressName', i, '') as string,
								company: this.getNodeParameter('addressCompany', i, '') as string,
								street1: this.getNodeParameter('addressStreet1', i) as string,
								street2: this.getNodeParameter('addressStreet2', i, '') as string,
								city: this.getNodeParameter('addressCity', i) as string,
								state: this.getNodeParameter('addressState', i) as string,
								zip: this.getNodeParameter('addressZip', i) as string,
								country: this.getNodeParameter('addressCountry', i, 'US') as string,
								phone: this.getNodeParameter('addressPhone', i, '') as string,
							};
						}

						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
						if (additionalOptions.instructions) {
							(body.pickup as IDataObject).instructions = additionalOptions.instructions;
						}
						if (additionalOptions.reference) {
							(body.pickup as IDataObject).reference = additionalOptions.reference;
						}
						if (additionalOptions.isAccountAddress !== undefined) {
							(body.pickup as IDataObject).is_account_address = additionalOptions.isAccountAddress;
						}

						responseData = await easyPostApiRequest.call(this, 'POST', '/pickups', body);
					}

					if (operation === 'get') {
						const pickupId = this.getNodeParameter('pickupId', i) as string;
						validatePickupId(pickupId);
						responseData = await easyPostApiRequest.call(this, 'GET', `/pickups/${pickupId}`);
					}

					if (operation === 'buy') {
						const pickupId = this.getNodeParameter('pickupId', i) as string;
						const carrier = this.getNodeParameter('carrier', i) as string;
						const service = this.getNodeParameter('service', i) as string;
						validatePickupId(pickupId);

						responseData = await easyPostApiRequest.call(this, 'POST', `/pickups/${pickupId}/buy`, {
							carrier,
							service,
						});
					}

					if (operation === 'cancel') {
						const pickupId = this.getNodeParameter('pickupId', i) as string;
						validatePickupId(pickupId);
						responseData = await easyPostApiRequest.call(
							this,
							'POST',
							`/pickups/${pickupId}/cancel`,
						);
					}
				}

				// ===== CARRIER ACCOUNT OPERATIONS =====
				if (resource === 'carrierAccount') {
					if (operation === 'create') {
						const body: IDataObject = {
							carrier_account: {
								type: this.getNodeParameter('type', i) as string,
								description: this.getNodeParameter('description', i, '') as string,
								reference: this.getNodeParameter('reference', i, '') as string,
							},
						};

						const credentials = this.getNodeParameter('credentials', i, {}) as IDataObject;
						if (credentials.credential && Array.isArray(credentials.credential)) {
							const creds: IDataObject = {};
							for (const cred of credentials.credential as IDataObject[]) {
								creds[cred.key as string] = cred.value;
							}
							(body.carrier_account as IDataObject).credentials = creds;
						}

						const testCredentials = this.getNodeParameter('testCredentials', i, {}) as IDataObject;
						if (testCredentials.credential && Array.isArray(testCredentials.credential)) {
							const testCreds: IDataObject = {};
							for (const cred of testCredentials.credential as IDataObject[]) {
								testCreds[cred.key as string] = cred.value;
							}
							(body.carrier_account as IDataObject).test_credentials = testCreds;
						}

						responseData = await easyPostApiRequest.call(this, 'POST', '/carrier_accounts', body);
					}

					if (operation === 'get') {
						const carrierAccountId = this.getNodeParameter('carrierAccountId', i) as string;
						responseData = await easyPostApiRequest.call(
							this,
							'GET',
							`/carrier_accounts/${carrierAccountId}`,
						);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							const response = await easyPostApiRequest.call(this, 'GET', '/carrier_accounts');
							responseData = ((response as IDataObject).carrier_accounts as IDataObject[]) || (response as unknown as IDataObject[]) || [];
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await easyPostApiRequest.call(this, 'GET', '/carrier_accounts');
							const accounts = ((response as IDataObject).carrier_accounts as IDataObject[]) || (response as unknown as IDataObject[]) || [];
							responseData = accounts.slice(0, limit);
						}
					}

					if (operation === 'update') {
						const carrierAccountId = this.getNodeParameter('carrierAccountId', i) as string;
						const body: IDataObject = { carrier_account: {} };

						const description = this.getNodeParameter('description', i, '') as string;
						const reference = this.getNodeParameter('reference', i, '') as string;

						if (description) {
							(body.carrier_account as IDataObject).description = description;
						}
						if (reference) {
							(body.carrier_account as IDataObject).reference = reference;
						}

						const credentials = this.getNodeParameter('credentials', i, {}) as IDataObject;
						if (credentials.credential && Array.isArray(credentials.credential)) {
							const creds: IDataObject = {};
							for (const cred of credentials.credential as IDataObject[]) {
								creds[cred.key as string] = cred.value;
							}
							(body.carrier_account as IDataObject).credentials = creds;
						}

						responseData = await easyPostApiRequest.call(
							this,
							'PUT',
							`/carrier_accounts/${carrierAccountId}`,
							body,
						);
					}

					if (operation === 'delete') {
						const carrierAccountId = this.getNodeParameter('carrierAccountId', i) as string;
						await easyPostApiRequest.call(
							this,
							'DELETE',
							`/carrier_accounts/${carrierAccountId}`,
						);
						responseData = { success: true };
					}
				}

				// ===== WEBHOOK OPERATIONS =====
				if (resource === 'webhook') {
					if (operation === 'create') {
						const body: IDataObject = {
							webhook: {
								url: this.getNodeParameter('url', i) as string,
							},
						};

						const webhookSecret = this.getNodeParameter('webhookSecret', i, '') as string;
						if (webhookSecret) {
							(body.webhook as IDataObject).webhook_secret = webhookSecret;
						}

						responseData = await easyPostApiRequest.call(this, 'POST', '/webhooks', body);
					}

					if (operation === 'get') {
						const webhookId = this.getNodeParameter('webhookId', i) as string;
						responseData = await easyPostApiRequest.call(this, 'GET', `/webhooks/${webhookId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const response = await easyPostApiRequest.call(this, 'GET', '/webhooks');
						const webhooks = (response.webhooks as IDataObject[]) || [];

						if (returnAll) {
							responseData = webhooks;
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = webhooks.slice(0, limit);
						}
					}

					if (operation === 'update') {
						const webhookId = this.getNodeParameter('webhookId', i) as string;
						const body: IDataObject = { webhook: {} };

						const url = this.getNodeParameter('url', i, '') as string;
						const webhookSecret = this.getNodeParameter('webhookSecret', i, '') as string;

						if (url) {
							(body.webhook as IDataObject).url = url;
						}
						if (webhookSecret) {
							(body.webhook as IDataObject).webhook_secret = webhookSecret;
						}

						responseData = await easyPostApiRequest.call(
							this,
							'PATCH',
							`/webhooks/${webhookId}`,
							body,
						);
					}

					if (operation === 'delete') {
						const webhookId = this.getNodeParameter('webhookId', i) as string;
						await easyPostApiRequest.call(this, 'DELETE', `/webhooks/${webhookId}`);
						responseData = { success: true };
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
