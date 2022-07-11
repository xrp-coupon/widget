import create from "zustand";
import axios from "axios";
import produce from "immer";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";
const xrpl = require('xrpl')
const INITIAL_XRP_STATE = {
	get: {
		loading: false,
		success: {
			ok: false,
			data: [],
		},
		failure: {
			error: false,
			message: "",
		}
	},
	post: {
		loading: false,
		success: {
			ok: false,
			data: null,
		},
		failure: {
			error: false,
			message: "",
		}
	},
};

const useXRPStore = create((set, get) => ({
	xrpPayments: INITIAL_XRP_STATE,
	getXRPPayment: async({ id = '', shop = window.lookbook.shop } = {}) => {
		set(produce(state => ({
			...state,
			xrpPayments: {
				...state.xrpPayments,
				get: {
					...INITIAL_XRP_STATE.get,
					loading: true,
				}
			}
		})))

		try {
			set(produce(state => ({
				...state,
				xrpPayments: {
					...state.xrpPayments,
					get: {
						...INITIAL_XRP_STATE.get,
						success: {
							ok: true,
							data: null,
						}
					}
				}
			})));

			return null;

		} catch (e) {		
			set(produce(state => ({
				...state,
				xrpPayments: {
					...state.xrpPayments,
					get: {
						...INITIAL_XRP_STATE.get,
						failure: {
							error: true,
							message: e.message || INTERNAL_SERVER_ERROR,
						}
					}
				}
			})))
		}
	},
	postXRPPayments: async ({ client, wallet, merchantXRPAddress, lookPrice, lookDiscount,  lookId,  }) => {
		set(produce(state => ({
			...state,
			xrpPayments: {
				...state.xrpPayments,
				post: {
					...INITIAL_XRP_STATE.post,
					loading: true,
				}
			}
		})))

		try {

			/* START XRP PAYMENT */
			const xrpPaymentForCoupon = await client.autofill({
				"TransactionType": "Payment",
				"Account": wallet.address,
				"Amount": xrpl.xrpToDrops(lookPrice),
				"Destination": merchantXRPAddress
			});
			const signed = wallet.sign(xrpPaymentForCoupon);
			const tx = await client.submitAndWait(signed.tx_blob)
			/* XRP PAYMENT COMPLETE */

			/* NOW GENERATE COUPON WITH THE SHOPIFY API*/
			const { data } = await axios.post(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/post_discount`, {
				discount: { targetType: 'percentage', value: lookDiscount }
			});
			set(produce(state => ({
				...state,
				xrpPayments: {
					...state.xrpPayments,
					post: {
						...INITIAL_XRP_STATE.post,
						success: {
							ok: true,
							data
						},
					}
				}
			})))
			return data;

		} catch (e) {
			set(produce(state => ({
				...state,
				xrpPayments: {
					...state.xrpPayments,
					post: {
						...INITIAL_XRP_STATE.post,
						failure: {
							error: true,
							message: e.message || INTERNAL_SERVER_ERROR
						},
					}
				}
			})))
			throw e;
		}
	},
}));

export default useXRPStore;
	
