import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import create from "zustand";
import { isObjectEmpty } from "../../../../common/helpers";
import { getCheckout, getDiscount } from "../../services/checkout";
import { postIntent } from "../../services/stripe";
import { resolveAsyncError } from "../../utils/helpers";

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
    error: { retry: false, redirect: false, message: "" },
  },
  license: "",
  discount: { data: null, loading: false, error: false },
  intent: { data: null, loading: false, error: false },
  payment: { success: false, message: "" },
  step: {
    current: 0,
    length: STEPS.length,
  },
  errors: {},
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
        version: {
          data: data.version,
          loading: false,
          error: { ...initialState.version.error },
        },
        billing: billing,
      }));
    } catch (err) {
      set((state) => ({
        ...state,
        version: {
          ...state.version,
          loading: false,
          error: resolveAsyncError(err),
        },
      }));
    }
  },
  submitPayment: async ({
    values,
    stripe,
    elements,
    reflectErrors,
    changeStep,
  }) => {
    let invalidInput = false;
    const stripeElements = [
      elements.getElement(CardNumberElement),
      elements.getElement(CardExpiryElement),
      elements.getElement(CardCvcElement),
    ];
    const cardElements = {
      cardNumber: "Card number",
      cardExpiry: "Card's expiration date",
      cardCvc: "Card's CVC",
    };
    for (let element of stripeElements) {
      if (!element._implementation._complete) {
        invalidInput = true;
        const elementInfo = element._implementation;
        const elementStatus = elementInfo._empty ? "required" : "invalid";
        const event = {
          elementType: elementInfo._componentName,
          error: {
            message: `${
              cardElements[elementInfo._componentName]
            } is ${elementStatus}`,
          },
        };
        reflectErrors({ event });
      }
    }
    if (invalidInput) return;
    set((state) => ({
      ...state,
      intent: { ...state.intent, loading: true },
    }));
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
        intent: { ...state.intent, loading: false },
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
        intent: { ...state.intent, loading: false },
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
  saveIntent: async ({ values, changeStep }) => {
    try {
      set((state) => ({
        ...state,
        intent: { ...state.intent, loading: true },
      }));
      // $TODO REMOVE INTENT AND FETCH FROM API
      const version = get().version.data;
      const discount = get().discount.data;
      const { data } = await postIntent.request({
        versionId: version.id,
        artworkLicense: {
          assignee: values.licenseAssignee,
          company: values.licenseCompany,
          type: values.licenseType,
        },
        discountId: discount ? discount.id : null,
      });

      set((state) => ({
        ...state,
        secret: data.intent.secret,
        intent: { ...state.intent, loading: false },
      }));
      changeStep({ value: 1 });
    } catch (err) {
      console.log(err);
      set((state) => ({ ...set, intent: { ...state.intent, loading: false } }));
    }
  },
  changeDiscount: async ({ values }) => {
    try {
      set((state) => ({
        ...state,
        discount: {
          ...state.discount,
          loading: true,
        },
      }));
      const discount = get().discount.data;
      const version = get().version.data;
      const license = get().license;
      if (discount && values.discountCode === null) {
        await postIntent.request({
          versionId: version.id,
          artworkLicense: {
            assignee: "",
            company: "",
            type: license,
          },
          discountId: null,
        });
        set((state) => ({
          ...set,
          discount: {
            ...state.discount,
            data: null,
            loading: false,
            error: false,
          },
        }));
      }
      if (!discount && values.discountCode) {
        const { data } = await getDiscount.request({
          discountCode: values.discountCode,
        });
        if (!isObjectEmpty(data.payload)) {
          console.log("ADDAS DISCOUNT");
          await postIntent.request({
            versionId: version.id,
            artworkLicense: {
              assignee: "",
              company: "",
              type: license,
            },
            discountId: data.payload.id,
          });
          set((state) => ({
            ...set,
            discount: {
              ...state.discount,
              data: data.payload,
              loading: false,
              error: false,
            },
          }));
        } else {
          console.log("$TODO discount does not exist");
        }
      }
    } catch (err) {
      console.log(err);
      set((state) => ({
        ...set,
        discount: { ...state.discount, loading: false },
      }));
    }
  },
  changeLicense: ({ license, setFieldValue }) => {
    setFieldValue(license.name, license.value);
    set((state) => ({
      ...state,
      license: license.value,
    }));
  },
  reflectErrors: ({ event }) => {
    set((state) => ({
      ...state,
      errors: {
        ...state.errors,
        [event.elementType]: event.error ? event.error.message : "",
      },
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