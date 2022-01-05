import { makeStyles } from "@material-ui/core";
import React from "react";
import {
  appName,
  domainName,
  featureFlags,
  unavailableMessage,
} from "../../../../common/constants";
import HelpBox from "../../components/HelpBox";
import ListItems from "../../components/ListItems";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import globalStyles from "../../styles/global";

const useTermsStyles = makeStyles((muiTheme) => ({
  heading: {
    marginTop: 16,
    textDecoration: "underline",
  },
  paragraph: {
    marginTop: 16,
  },
  bold: {
    fontWeight: "bold",
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

const TermsOfService = () => {
  const globalClasses = globalStyles();
  const classes = useTermsStyles();

  return (
    <Container
      className={`${globalClasses.gridContainer} ${globalClasses.smallContainer}`}
    >
      <Grid container spacing={2}>
        <Grid item sm={12}>
          {
            // FEATURE FLAG - stripe
            !featureFlags.stripe && (
              <HelpBox
                type="alert"
                label={unavailableMessage}
                margin="0 0 12px 0"
              />
            )
          }
          <Typography variant="h4">Terms of service</Typography>
          <Typography variant="h5" className={classes.heading}>
            {`Introduction`}
          </Typography>
          <Typography className={classes.paragraph}>
            {`Please read these Terms of Service (Terms) carefully. 
            They contain the legal terms and conditions that govern your use of services provided to you by ${appName}, including information, text, images, graphics, 
            data or other materials (Content) and products and services provided through www.${domainName} as well as all elements, software, programs and code forming or incorporated in to www.${domainName} (Service).`}
          </Typography>
          <Typography className={classes.paragraph}>
            {`By using the Service, you agree to be bound by the "General Terms" section, which contains provisions applicable to all users of the Service, 
            including visitors to the ${appName} website (Site). If you choose to register as a member of the Service, you agree to be bound by the additional terms set forth in the "Additional Terms" section.`}
          </Typography>
          <Typography variant="h5" className={classes.heading}>
            {`General Terms`}
          </Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`1. Availability`}
          </Typography>
          <Typography
            className={classes.paragraph}
          >{`This Service is provided by ${appName} on an "AS IS" and "AS AVAILABLE" basis and ${appName} reserves the right to modify, suspend or discontinue the Service, in its sole discretion, at any time and without notice. 
          You agree that ${appName} is and will not be liable to you for any modification, suspension or discontinuance of the Service.`}</Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`2. Privacy`}
          </Typography>
          <Typography
            className={classes.paragraph}
          >{`${appName} has a firm commitment to safeguarding your privacy. Please review ${appName}'s Privacy Policy. The terms of ${appName}'s privacy policy are incorporated into, and form a part of, these Terms.`}</Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`3. Trademarks`}
          </Typography>
          <Typography
            className={classes.paragraph}
          >{`All brand, product and service names used in this Service which identify ${appName} or third parties and their products and services are proprietary marks of ${appName} and/or the relevant third parties. 
          Nothing in this Service shall be deemed to confer on any person any license or right on the part of ${appName} or any third party with respect to any such image, logo or name.`}</Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`4. Copyright`}
          </Typography>
          <Typography
            className={classes.paragraph}
          >{`${appName} is, unless otherwise stated, the owner of all copyright and data rights in the Service and its contents. Individuals who have posted artwork to ${appName} are either the copyright owners of the 
          component parts of that work or are posting the work under license from a copyright owner or his or her agent or otherwise as permitted by law. You may not reproduce, distribute, publicly display or perform, 
          or prepare derivative works based on any of the Content including any such works without the express, written consent of ${appName} or the appropriate owner of copyright in such works. ${appName} does not claim 
          ownership rights in your works or other materials posted by you to ${appName} (Your Content). You agree not to distribute any part of the Service other than Your Content in any medium other than as permitted in 
          these Terms of Service or by use of functions on the Service provided. You agree not to alter or modify any part of the Service unless expressly permitted to do so or by use of functions on the Service provided.`}</Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`5. External Links`}
          </Typography>
          <Typography
            className={classes.paragraph}
          >{`${appName} may provide links to third-party websites or resources. You acknowledge and agree that ${appName} is not responsible or liable for: the availability or accuracy of such websites or resources; 
          or the Content, products, or services on or available from such websites or resources. Links to such websites or resources do not imply any endorsement by ${appName} of such websites or resources or the Content, 
          products, or services available from such websites or resources. You acknowledge sole responsibility for and assume all risk arising from your use of any such websites or resources.`}</Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`6. Third Party Software`}
          </Typography>
          <Typography
            className={classes.paragraph}
          >{`As a convenience, ${appName} may make third-party software available through the Service. To use the third-party software, you must agree to the terms and conditions imposed by the third party provider and the 
          agreement to use such software will be solely between you and the third party provider. By downloading third party software, you acknowledge and agree that the software is provided on an "AS IS" basis without warranty of any kind. 
          In no event shall ${appName} be liable for claims or damages of any nature, whether direct or indirect, arising from or related to any third-party software downloaded through the Service.`}</Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`7. Conduct`}
          </Typography>
          <Typography
            className={classes.paragraph}
          >{`You agree that you shall not interfere with or disrupt (or attempt to interfere with or disrupt) this Service or servers or networks connected to this Service, or to disobey any requirements, 
          procedures, policies or regulations of networks connected to this Service; or provide any information to ${appName} that is false or misleading, that attempts to hide your identity or that you do 
          not have the right to disclose. ${appName} does not endorse any content placed on the Service by third parties or any opinions or advice contained in such content. You agree to defend, indemnify, 
          and hold harmless ${appName}, its officers, directors, employees and agents, from and against any claims, liabilities, damages, losses, and expenses, including, without limitation, reasonable legal 
          and expert fees, arising out of or in any way connected with your access to or use of the Services, or your violation of these Terms.`}</Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`8. Disclaimer of Warranty and Limitation of Liability`}
          </Typography>
          <Typography
            className={classes.paragraph}
          >{`VESPER MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED AS TO THE OPERATION OF THE SERVICE, OR THE CONTENT OR PRODUCTS, PROVIDED THROUGH THE SERVICE. 
          YOU EXPRESSLY AGREE THAT YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK. VESPER DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION, IMPLIED WARRANTIES OF MERCHANTABILITY, 
          FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT, TO THE FULLEST EXTENT PERMITTED BY LAW. VESPER MAKES NO WARRANTY AS TO THE SECURITY, RELIABILITY, TIMELINESS, AND PERFORMANCE OF THIS SERVICE. 
          YOU SPECIFICALLY ACKNOWLEDGE THAT VESPER IS NOT LIABLE FOR YOUR DEFAMATORY, OFFENSIVE OR ILLEGAL CONDUCT, OR SUCH CONDUCT BY THIRD PARTIES, AND YOU EXPRESSLY ASSUME ALL RISKS AND RESPONSIBILITY 
          FOR DAMAGES AND LOSSES ARISING FROM SUCH CONDUCT. EXCEPT FOR THE EXPRESS, LIMITED REMEDIES PROVIDED HEREIN, AND TO THE FULLEST EXTENT ALLOWED BY LAW, VESPER SHALL NOT BE LIABLE FOR ANY DAMAGES OF 
          ANY KIND ARISING FROM USE OF THE SERVICE, INCLUDING BUT NOT LIMITED TO DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES, EVEN IF VESPER HAS BEEN ADVISED OF THE 
          POSSIBILITY OF SUCH DAMAGES. THE FOREGOING DISCLAIMERS, WAIVERS AND LIMITATIONS SHALL APPLY NOTWITHSTANDING ANY FAILURE OF ESSENTIAL PURPOSE OF ANY LIMITED REMEDY. SOME JURISDICTIONS DO NOT ALLOW 
          THE EXCLUSION OF OR LIMITATIONS ON CERTAIN WARRANTIES OR DAMAGES. THEREFORE, SOME OF THE ABOVE EXCLUSIONS OR LIMITATIONS MAY NOT APPLY TO YOU. IN NO EVENT SHALL VESPER'S AGGREGATE LIABILITY TO YOU 
          EXCEED THE AMOUNTS PAID BY YOU TO VESPER PURSUANT TO THIS AGREEMENT.`}</Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`9. Amendment of the Terms`}
          </Typography>
          <Typography
            className={classes.paragraph}
          >{`${appName} reserves the right to amend these Terms from time to time. If you have registered as a member, you shall be notified of any material changes to these Terms (and the effective date of such changes) 
          by receiving an email to the address you have provided to ${appName} for your account. For all other users, the revised terms will be posted on the Site. If you continue to use the Service after the effective 
          date of the revised Terms, you will be deemed to have accepted those changes. If you do not agree to the revised Terms, your sole remedy shall be to discontinue using the Service.`}</Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`10. General`}
          </Typography>
          <Typography
            className={classes.paragraph}
          >{`These Terms constitute the entire agreement between ${appName} and you with respect to your use of the Service. ${appName}'s failure to enforce any right or provision in these Terms shall not constitute a 
          waiver of such right or provision. If a court should find that one or more provisions contained in these Terms is invalid, you agree that the remainder of the Terms shall be enforceable. ${appName} shall have 
          the right to assign its rights and/or delegate its obligations under these Terms, in whole or in part, to any person or business entity. You may not assign your rights or delegate your obligations under these 
          Terms without the prior written consent of ${appName}.`}</Typography>
          <Typography variant="h5" className={classes.heading}>
            {`Additional Terms`}
          </Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`11. Registration`}
          </Typography>
          <Typography
            className={classes.paragraph}
          >{`To register as a member of the Service or purchase products, you must be 13 years or lawfully permitted to enter into and form contracts under applicable law. In no event may minors submit Content to the Service. 
          You agree that the information that you provide to ${appName} upon registration, at the time of purchase, and at all other times will be true, accurate, current and complete. You also agree that you will ensure that 
          this information is kept accurate and up to date at all times. This is especially important with respect to your email address, since that is the primary way in which ${appName} will communicate with you about your 
          account and your orders.`}</Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`12. Password`}
          </Typography>
          <Typography
            className={classes.paragraph}
          >{`When you register as a member you will be asked to provide a password. You are responsible for safeguarding the password and you agree not to disclose your password to any third party. 
          You agree that you shall be solely responsible for any activities or actions under your password, whether or not you have authorized such activities or actions. 
          You shall immediately notify ${appName} of any unauthorized use of your password.`}</Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`13. Copyright in Your Content`}
          </Typography>
          <Typography
            className={classes.paragraph}
          >{`${appName} does not claim ownership rights in Your Content. For the sole purpose of enabling ${appName} to make your Content available through the Service, you grant to ${appName} a 
          non-exclusive, royalty-free license to reproduce, distribute, re-format, store, prepare derivative works based on, and publicly display and perform Your Content. Please note that when you upload Content, 
          third parties will be able to copy, distribute and display your Content using readily available tools on their computers for this purpose although other than by linking to your Content on ${appName} any use 
          by a third party of your Content could violate paragraph "Copyright" of these Terms and Conditions unless the third party receives permission from you by license.`}</Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`14. Monitoring Content`}
          </Typography>
          <Typography
            className={classes.paragraph}
          >{`${appName} has no ability to control the Content you may upload, post or otherwise transmit using the Service and does not have any obligation to monitor such Content for any purpose. 
          You acknowledge that you are solely responsible for all Content and material you upload, post or otherwise transmit using the Service.`}</Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`15. Storage Policy`}
          </Typography>
          <Typography
            className={classes.paragraph}
          >{`At this time, ${appName} provides free online storage of Your Content to registered members of the Service. However, you acknowledge and agree that ${appName} may, at its option, 
          establish limits concerning your use of the Service, including without limitation the maximum number of days that Your Content will be retained by the Service, the maximum size of any 
          Content files that may be stored on the Service, the maximum disk space that will be allotted to you for the storage of Content on ${appName}'s servers. Furthermore, you acknowledge that ${appName} 
          reserves the right to terminate or suspend accounts that are inactive, in ${appName}'s sole discretion, for an extended period of time (thus deleting or suspending access to your Content). ${appName} 
          shall have no responsibility or liability for the deletion or failure to store any Content maintained on the Service and you are solely responsible for creating back-ups of Your Content. 
          You further acknowledge that ${appName} reserves the right to modify its storage policies from time to time, with or without notice to you.`}</Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`16. Conduct`}
          </Typography>
          <Typography
            className={classes.paragraph}
          >{`You are responsible for all of Your Content you upload, download, and otherwise copy, distribute and display using the Service. You must have the legal right to copy, 
          distribute and display all parts of any content that you upload, download and otherwise copy, distribute and display. Content provided to you by others, or made available through 
          websites, magazines, books and other sources, are protected by copyright and should not be uploaded, downloaded, or otherwise copied, distributed or displayed without the consent 
          of the copyright owner or as otherwise permitted by law. 
          You agree not to use the Service:
          `}</Typography>
          <ListItems
            noPadding={true}
            items={[
              {
                label: `for any unlawful purposes;`,
                icon: null,
              },
              {
                label: `to upload, post, or otherwise transmit any material that is obscene, offensive, blasphemous, pornographic, unlawful, threatening, menacing, abusive, harmful, an invasion of privacy or publicity rights, defamatory, libelous, vulgar, illegal or otherwise objectionable;','to upload, post, or otherwise transmit any material that infringes any copyright, trade mark, patent or other intellectual property right or any moral right or artist's right of any third party including, but not limited to, ${appName} or to facilitate the unlawful distribution of copyrighted content or illegal content;`,
                icon: null,
              },
              {
                label: `to harm minors in any way, including, but not limited to, uploading, posting, or otherwise transmitting content that violates child pornography laws, child sexual exploitation laws or laws prohibiting the depiction of minors engaged in sexual conduct, or submitting any personally identifiable information about any child under the age of 13;`,
                icon: null,
              },
              {
                label: `to forge headers or otherwise manipulate identifiers in order to disguise the origin of any Content transmitted through the Service;`,
                icon: null,
              },
              {
                label: `to upload, post, or otherwise transmit any material which is likely to cause harm to ${appName} or anyone else's computer systems, including but not limited to that which contains any virus, code, worm, data or other files or programs designed to damage or allow unauthorized access to the Service which may cause any defect, error, malfunction or corruption to the Service;`,
                icon: null,
              },
              {
                label: `for any commercial purpose, except as expressly permitted under these Terms;`,
                icon: null,
              },
              {
                label: `to sell access to the Service on any other website or to use the Service on another website for the primary purpose of gaining advertising or subscription revenue other than a personal blog or social network where the primary purpose is to display content from ${appName} by hyperlink and not to compete with ${appName}.`,
                icon: null,
              },
            ]}
          />
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`17. Commercial Activities`}
          </Typography>
          <Typography
            className={classes.paragraph}
          >{`Commercial activities mean the offering, solicitation or sale of goods or services by anyone other than ${appName}. Commercial activities with respect to the arts are permitted for 
          registered members acting as individuals, for small corporations or partnerships engaged primarily in art-related activities in which one or more of the principals is a registered member 
          or for those seeking to retain the services or works of a registered member. Commercial activities in the form of paid advertising on the Service are subject to the terms and conditions 
          relating to the purchase of such advertising. No other commercial activities are permitted on or through the Service without ${appName}'s written approval. Any interactions with members 
          of the Service with respect to commercial activities including payment for and delivery of goods and/or services and any terms related to the commercial activities including conditions, 
          warranties or representations and so forth are solely between you and the other member.`}</Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`18. Suspension and Termination of Access and Membership`}
          </Typography>
          <Typography
            className={classes.paragraph}
          >{`You agree that ${appName} may at any time, and without notice, suspend or terminate any part of the Service, or refuse to fulfill any order, or any part of any order or terminate your 
          membership and delete any Content stored on the ${appName} Site, in ${appName}'s sole discretion, if you fail to comply with the Terms or applicable law.`}</Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`19. Purchasing And Downloading Artwork`}
          </Typography>
          <Typography
            className={classes.paragraph}
          >{`Users can place orders and purchase artwork alongside the license of their choosing.
          All payments are to be made in US dollars and prices are subject to change at any time. Platform fees will be added to your order during the checkout process.
          `}</Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`20. Personal and Commercial Licenses`}
          </Typography>
          <Typography
            className={classes.paragraph}
          >{`By purchasing or downloading a license, the Seller (artist) grants you a perpetual, exclusive, non-transferable, worldwide license to use the artwork for Permitted Personal Usage 
          or Permitted Commercial Usage, depending on the license type. For the avoidance of doubt, the Seller (artist) retains all ownership rights.
          “Permitted Personal Usage” means personal use only. The purchased artwork may not be used in any way whatsoever in which you charge money, collect fees, or receive any form of remuneration. 
          The content may not be resold, relicensed, sub-licensed or used in advertising and strictly excludes any illegal, immoral or defamatory purpose.
          “Permitted Commercial Usage” means any business related use, such as (by way of example) advertising, promotion, creating web pages, integration into product, software or other business 
          related tools etc., and strictly excludes any illegal, immoral or defamatory purpose. 
          There is no warranty, express or implied, with the purchase or download of the artwork, including with respect to fitness for a particular purpose. 
          Neither the Seller (artist) nor ${appName} will be liable for any claims, or incidental, consequential or other damages arising out of this license, the artwork or your use of the artwork.
          `}</Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TermsOfService;
