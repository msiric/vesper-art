// import React, { useContext, useRef, useState, useEffect } from "react";
// import { Context } from "../../context/Store.js";
// import SelectField from "../../shared/SelectInput/SelectInput.js";
// import NumberFormat from "react-number-format";
// import Summary from "./Summary.js";
// import Steppers from "./Steppers.js";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import { Formik, Form, Field, FieldArray } from "formik";
// import * as Yup from "yup";
// import {
//   Box,
//   Paper,
//   Modal,
//   Container,
//   Grid,
//   CircularProgress,
//   Card,
//   CardMedia,
//   CardContent,
//   CardActions,
//   Typography,
//   TextField,
//   List,
//   ListItem,
//   ListItemText,
//   Button,
//   Divider,
// } from "@material-ui/core";
// import { useHistory } from "react-router-dom";
// import { getCheckout } from "../../services/checkout.js";

// const validationSchema = Yup.object().shape({
//   discountCode: Yup.string().trim().required("Discount cannot be empty"),
// });

// const Checkout = ({ match, location }) => {
//   const [store, dispatch] = useContext(Context);
//   const [state, setState] = useState({
//     stripe: null,
//     secret: null,
//     artwork: {},
//     billing: {},
//     licenses: [],
//     discount: {},
//     loading: true,
//   });

//   const history = useHistory();

//   const classes = {};

//   const handleSecretSave = (value) => {
//     setState((prevState) => ({ ...prevState, secret: value }));
//   };

//   const handleLicenseSave = async (licenses) => {
//     try {
//       const versionId = state.artwork.current._id.toString();
//       const storageObject = {
//         versionId: versionId,
//         intentId: null,
//         licenseList: licenses,
//       };
//       window.sessionStorage.setItem(
//         state.artwork._id,
//         JSON.stringify(storageObject)
//       );
//       setState((prevState) => ({
//         ...prevState,
//         licenses: licenses,
//       }));
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleBillingSave = async (billing) => {
//     setState((prevState) => ({
//       ...prevState,
//       billing: billing,
//     }));
//   };

//   const handleDiscountEdit = (discount) => {
//     setState((prevState) => ({
//       ...prevState,
//       discount: discount,
//     }));
//   };

//   const retrieveLicenseInformation = (artwork) => {
//     const checkoutItem = JSON.parse(
//       window.sessionStorage.getItem(artwork._id.toString())
//     );
//     if (checkoutItem) {
//       const currentId = artwork.current._id.toString();
//       if (checkoutItem.versionId === currentId) {
//         return checkoutItem.licenseList;
//       } else {
//         window.sessionStorage.removeItem(artwork._id);
//         console.log("$TODO ENQUEUE MESSAGE, DELETE INTENT ON SERVER");
//       }
//     }
//   };

//   const fetchData = async () => {
//     try {
//       const billing = {
//         firstname: "",
//         lastname: "",
//         email: "",
//         address: "",
//         zip: "",
//         city: "",
//         country: "",
//       };
//       const { data } = await getCheckout({ artworkId: match.params.id });
//       const stripe = await loadStripe(
//         "pk_test_xi0qpLTPs3WI8YPUfTyeeyzt00tNwou20z"
//       );
//       const licenses = retrieveLicenseInformation(data.artwork);
//       setState({
//         ...state,
//         loading: false,
//         stripe: stripe,
//         artwork: data.artwork,
//         licenses: licenses ? licenses : [],
//         billing: billing,
//         discount: data.discount,
//       });
//     } catch (err) {
//       setState({ ...state, loading: false });
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <Container fixed className={classes.fixed}>
//       <Grid container className={classes.container} spacing={2}>
//         {state.loading ? (
//           <Grid item xs={12} className={classes.loader}>
//             <CircularProgress />
//           </Grid>
//         ) : state.artwork._id ? (
//           <>
//             <Grid item xs={12} md={8} className={classes.artwork}>
//               <Box component="main">
//                 <Container maxWidth="md">
//                   {state.loading ? (
//                     <CircularProgress />
//                   ) : (
//                     <Paper elevation={5}>
//                       {state.stripe ? (
//                         <Elements stripe={state.stripe}>
//                           <Steppers
//                             secret={state.secret}
//                             artwork={state.artwork}
//                             licenses={state.licenses}
//                             billing={state.billing}
//                             discount={state.discount}
//                             handleSecretSave={handleSecretSave}
//                             handleLicenseSave={handleLicenseSave}
//                             handleBillingSave={handleBillingSave}
//                           />
//                         </Elements>
//                       ) : null}
//                     </Paper>
//                   )}
//                 </Container>
//               </Box>
//             </Grid>
//             <Grid item xs={12} md={4} className={classes.actions}>
//               <Summary
//                 artwork={state.artwork}
//                 licenses={state.licenses}
//                 discount={state.discount}
//                 handleDiscountEdit={handleDiscountEdit}
//               />
//               <br />
//             </Grid>
//           </>
//         ) : (
//           history.push("/")
//         )}
//       </Grid>
//     </Container>
//   );
// };

// export default Checkout;
