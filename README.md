# XRP Coupon Architecture.



![Screenshot 2022-03-29 at 12.17.47 AM.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1648499593414/yaBsfQWnM.png)


![Screenshot 2022-03-29 at 1.04.48 AM.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1648500181436/Wvv2SXcrt.png)

# ENV variables.

Set the following variables in your .env.development
REACT_APP_SHOPIFY_API_KEY=
REACT_APP_XRPL_NETWORK=wss://s.altnet.rippletest.net:51233
REACT_APP_XRPL_SEED=

# Entry point.
The CRA app will load xrpl JS SDK and initialize it in index.js like below (https://github.com/xrp-coupon/widget/blob/main/src/index.js)
```
const xrpl = require("xrpl")
const client = new xrpl.Client(process.env.REACT_APP_XRPL_NETWORK);
const wallet = xrpl.Wallet.fromSeed(process.env.REACT_APP_XRPL_SEED); // For testing load from env

client.connect().then(() => {
  ReactDOM.render(
    <React.StrictMode>
      <App xrp={{ client, wallet }} />
    </React.StrictMode>,
    document.getElementById('root')
  );
}).catch((e) => {
  ReactDOM.render(
    <React.StrictMode>
      <h1>Unable to connect. Please try again via page refresh.</h1>
    </React.StrictMode>,
    document.getElementById('root')
  );
})
```

# React Context to pass wallet and client

Once initialized, both wallet and client are passed to subsequent children components using Context (https://github.com/xrp-coupon/widget/blob/main/src/App.js)

```
import React from "react";
export const ShopContext = React.createContext();
export const XRPContext = React.createContext();

    <ChakraProvider>
      <XRPContext.Provider value={{ wallet: props.wallet, client: props.client }}>
        <ShopContext.Provider value={shop}>
          <EmbedRoute />
        </ShopContext.Provider>
      </XRPContext.Provider>
    </ChakraProvider>
    
```

# Triggering payment with XRP for coupon codes

```
<Button
	marginTop={"10px"}
	onClick={() => onXRPClick({ ...params })}
	isFullWidth
>
	Pay {look.price || 0} XRP for {look.discount}% coupon
</Button>

 ```
 
 # Zustand Redux Store that actually triggers payment and waits for confirmation 
 Code (https://github.com/berrysupport/xrp-coupon-widget/tree/main/src/store/xrp)
 ```
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
```

# For more check the dependent libraries like api, cdn, client 
