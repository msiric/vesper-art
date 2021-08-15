import { makeStyles } from "@material-ui/core";
import React from "react";
import { domainName } from "../../../../common/constants";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import globalStyles from "../../styles/global";

const usePrivacyStyles = makeStyles((muiTheme) => ({
  heading: {
    marginTop: 16,
    textDecoration: "underline",
  },
  paragraph: {
    marginTop: 16,
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    margin: "0 auto",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    [muiTheme.breakpoints.down("xs")]: {
      flexDirection: "column",
      height: 80,
    },
  },
  label: {
    marginBottom: 16,
    [muiTheme.breakpoints.down("xs")]: {
      fontSize: "1.8rem",
    },
  },
}));

const PrivacyPolicy = () => {
  const globalClasses = globalStyles();
  const classes = usePrivacyStyles();

  return (
    <Container
      className={`${globalClasses.gridContainer} ${globalClasses.smallContainer}`}
    >
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <Typography variant="h4">Privacy policy</Typography>
          <Typography className={classes.paragraph}>
            {`This Platform was built with your privacy in mind. This Privacy Policy (Policy) describes how your Personal Information is collected, used, shared, and secured when you visit the Platform (www.${domainName}).
            By accessing the website you agree to this Privacy Policy and its Terms of Use.`}
          </Typography>
          <Typography variant="h5" className={classes.heading}>
            {`Personal Information Collected`}
          </Typography>
          <Typography className={classes.paragraph}>
            {`Information may be collected that is reasonably capable of identifying you as an individual (Personal Information). Personal Information does not include anonymous or aggregate information that does not identify you as an individual.
            - **Creating a User Account**: If you sign up to use the Platform, you are required to provide your full name. Additionally, you might provide your location, website and biographical information.
            - **Visiting the Site**: Basic analytics data is collected when you access or use the Platform through Cookies. See more about the Cookies Policy below for more information about the Cookies used and data collected.`}
          </Typography>
          <Typography variant="h5" className={classes.heading}>
            {`What Is Done With The Collected Information`}
          </Typography>
          <Typography className={classes.paragraph}>
            {`Personal Information is collected in order to:
            - Make the Platform work and enable you to list, collect and purchase/sell digital art;
            - Provide you with critical updates, confirmations, or security alerts;
            - Provide support or respond to your comments or questions;
            - Personalize and improve your experience;
            - Analyze and improve the Platform.`}
          </Typography>
          <Typography
            variant="h5"
            className={classes.heading}
          >{`Cookies`}</Typography>
          <Typography className={classes.paragraph}>
            {`Basic analytics data is collected through Cookies when you access or use the Platform. 
            A “**Cookie**” is a small piece of data or text file stored on the local hard disk of your computer or mobile device. 
            These include first-party Cookies used by the platform and third-party Cookies. Some Cookies are only stored temporarily and destroyed each time you close your web browser. 
            Others may remain on your browser and may collect and store data for a period of time after you have left the Platform.`}
          </Typography>
          <Typography variant="h5" className={classes.heading}>
            {`How are Cookies used`}
          </Typography>
          <Typography className={classes.paragraph}>
            {`- **Functionality:** The Platform uses Cookies to ensure the Platform functions properly, including authentication and page loads.
            - **Google Analytics:** Google Analytics is used to understand how users interact with the Platform. `}
          </Typography>
          <Typography
            variant="h5"
            className={classes.heading}
          >{`Your Rights`}</Typography>
          <Typography className={classes.paragraph}>
            {`You may reach out at [p](mailto:info@${domainName}) to erase, update or correct any Personal Information that was collected about you.`}
          </Typography>
          <Typography variant="h5" className={classes.heading}>
            {`Minors and Children`}
          </Typography>
          <Typography className={classes.paragraph}>
            {`The Platform is not intended for use by children under the age of 18, and Personal Information is not knowingly collected from children under the age of 13. If this does happen, said information will be deleted.`}
          </Typography>
          <Typography variant="h5" className={classes.heading}>
            {`Third-Party Links and Services`}
          </Typography>
          <Typography className={classes.paragraph}>
            {`This Policy only applies to this Platform and does not apply to third-party websites or services. It is encouraged that you review the privacy policies of those third-party sites to learn about their practices or what rights you may have.`}
          </Typography>
          <Typography variant="h5" className={classes.heading}>
            {`Changes to this Policy`}
          </Typography>
          <Typography className={classes.paragraph}>
            {`The commitment to preserving your privacy will not change, but the Platform may evolve. The effective date of each version is identified above. 
            If material changes to this Privacy Policy are made, reasonable means to inform you will be used and, where necessary, obtain your consent.`}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PrivacyPolicy;
