import { CardNumberElement } from "@stripe/react-stripe-js";
import create from "zustand";
import { getCheckout } from "../../services/checkout";
import { patchIntent, postIntent } from "../../services/stripe";

const STEPS = [
  "License information",
  "Billing information",
  "Payment information",
];

const initialState = {
  secret: null,
  version: {
    data: { artwork: { owner: {} }, cover: {}, media: {} },
    loading: true,
    error: false,
  },
  license: "",
  discount: { data: null, loading: false, error: false },
  intent: { data: null, loading: false, error: false },
  payment: { success: false, message: "" },
  step: {
    current: 0,
    length: STEPS.length,
  },
};

const initState = () => ({
  ...initialState,
});

const initActions = (set, get) => ({
  fetchCheckout: async ({ license, versionId }) => {
    try {
      const billing = {
        firstname: "",
        lastname: "",
        email: "",
        address: "",
        zip: "",
        city: "",
        country: "",
      };
      const { data } = await getCheckout.request({
        versionId,
      });
      /*       const license = retrieveLicenseInformation(data.artwork); */
      set((state) => ({
        ...state,
        license: license || initialState.license,
        version: { data: data.version, loading: false, error: false },
        billing: billing,
        discount: { data: data.discount, loading: false, error: false },
      }));
    } catch (err) {
      set((state) => ({ ...state }));
    }
  },
  submitPayment: async ({ values, stripe, elements, history, changeStep }) => {
    const secret = get().secret;
    if (!secret || !stripe || !elements) {
      console.log("nije dobro");
      console.log(secret, stripe, elements);
      set((state) => ({
        ...state,
        payment: {
          ...state.payment,
          success: false,
          message:
            "Payment couldn't be processed because Stripe wasn't initialized. Please try again.",
        },
      }));
      // $TODO Enqueue error;
    }

    console.log("SUBMITTING", values);
    const cardElement = elements.getElement(CardNumberElement);
    const stripeData = {
      payment_method: {
        card: cardElement,
        billing_details: {
          address: {
            city: values.billingCity,
            country: values.billingCountry.value,
            line1: values.billingAddress,
            line2: null,
            postal_code: values.billingZip,
            state: null,
          },
          email: values.billingEmail,
          name: `${values.billingName} ${values.billingSurname}`,
          phone: null,
        },
      },
    };
    const { paymentIntent, error } = await stripe.confirmCardPayment(
      secret,
      stripeData
    );

    if (error) {
      console.log("fail");
      console.log(error);
      set((state) => ({
        ...state,
        payment: { ...state.payment, success: false, message: error.message },
      }));
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      console.log("success");
      /*         enqueueSnackbar('Payment successful', {
            variant: 'success',
            autoHideDuration: 1000,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
          });
          enqueueSnackbar('Your purchase will appear in the "orders" page soon', {
            variant: 'success',
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
          }); */
      set((state) => ({
        ...state,
        payment: {
          ...state.payment,
          success: true,
          message:
            "Payment successful! Your order will appear in the Orders page soon.",
        },
      }));
    }
    changeStep({ value: 1 });
  },
  changeStep: ({ value }) => {
    set((state) => ({
      ...state,
      step: { ...state.step, current: state.step.current + value },
    }));
  },
  saveIntent: async ({ values, userIntents, changeStep }) => {
    try {
      // $TODO REMOVE INTENT AND FETCH FROM API
      const version = get().version.data;
      const discount = get().discount.data;
      const intentId = userIntents[version.id] || null;
      const { data } = await postIntent.request({
        versionId: version.id,
        artworkLicense: {
          assignee: values.licenseAssignee,
          company: values.licenseCompany,
          type: values.licenseType,
        },
        discountId: discount ? discount.id : null,
        intentId,
      });
      /*       if (!intentId) {
        try {
          await postCheckout.request({
            userId: userStore.id,
            data: {
              version: state.version.id,
              intentId: data.intent.id,
            },
          });
          // $TODO REMOVE INTENT AND FETCH FROM API
          userDispatch({
            type: "updateIntents",
            intents: {
              [state.version.id]: data.intent.id,
            },
          });
        } catch (err) {
          console.log(err);
        }
      } */
      set((state) => ({
        ...state,
        secret: data.intent.secret,
      }));
      changeStep({ value: 1 });
    } catch (err) {
      console.log(err);
    } finally {
      set((state) => ({ ...set, intent: { ...state.intent, loading: false } }));
    }
  },
  changeDiscount: async ({ values, actions, userIntents }) => {
    try {
      const version = get().version.data;
      const license = get().license;
      // $TODO REMOVE INTENT AND FETCH FROM API
      const intentId = userIntents[version.id] || null;
      const {
        data: { payload },
      } = values
        ? /* await getDiscount.request({ discountCode: values.discountCode }) */
          await patchIntent.request({
            versionId: version.id,
            discountCode: values.discountCode,
            licenseType: license,
          })
        : { data: { payload: null } };
      if (intentId) {
        await postIntent.request({
          versionId: version.id,
          artworkLicense: {
            assignee: "",
            company: "",
            type: license,
          },
          discountId: payload ? payload.id : null,
          intentId,
        });
      }
      set((state) => {
        console.log(state);
        return { ...state, discount: { ...state.discount, data: payload } };
      });
      actions && actions.setSubmitting(false);
    } catch (err) {
      console.log(err);
    }
  },
  changeLicense: ({ license, setFieldValue }) => {
    setFieldValue(license.name, license.value);
    set((state) => ({
      ...state,
      license: license.value,
    }));
  },
  resetArtwork: () => {
    set({ ...initialState });
  },
});

export const useOrderCheckout = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
