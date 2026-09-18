import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Container, Typography, Link } from '@material-ui/core';
const titles = {'/about':'About Vesper','/how_it_works':'How the demo works','/start_selling':'Try sharing artwork','/start_buying':'Try collecting artwork','/license_information':'Simulated licenses','/faq':'Demo questions','/privacy_policy':'Demo data and privacy','/terms_of_service':'Demo use'};
export default function DemoAbout() {
 const {pathname}=useLocation();
 return <Container maxWidth="md" style={{paddingTop:40,paddingBottom:56,lineHeight:1.8}}>
  <Typography variant="h4" component="h1" gutterBottom>{titles[pathname] || 'About this demo'}</Typography>
  <Typography paragraph>Vesper is Mario Siric’s portfolio project exploring an art marketplace: galleries, search, favorites, comments, uploads and an order-and-license workflow.</Typography>
  <Typography variant="h6" component="h2" gutterBottom>Explore the sample, then try it</Typography>
  <Typography paragraph>The sample gallery works immediately. “Start live demo” creates a temporary, fictional account with no signup or password. You can favorite and comment on artwork, upload a small test image, and create a simulated free order. The free server may take about a minute to wake up.</Typography>
  <Typography variant="h6" component="h2" gutterBottom>No purchases or real licenses</Typography>
  <Typography paragraph>Every price, purchase, receipt and license is a software demonstration. No money is collected, no email is sent and no real usage rights are granted. A demo verification result only checks the matching demo record. The sample artwork is for viewing here.</Typography>
  <Typography variant="h6" component="h2" gutterBottom>Temporary, shared test content</Typography>
  <Typography paragraph>Use only non-sensitive test content you have permission to upload. Uploaded artwork, comments and profile details can be visible to other visitors. Accounts expire after 24 hours; expired records are removed when a later demo session starts. Ending a session signs you out; it does not immediately erase its content.</Typography>
  <Typography paragraph>The app uses an essential session cookie, a browser session flag and local display preferences. It has no advertising or app analytics. Hosting providers process request metadata such as IP addresses; the API uses temporary IP-based counters to limit abuse. Do not use this demo to store personal information or anything you need to keep.</Typography>
  <Typography paragraph>Each account allows 60 changes and 2 MiB of stored images. JPEG and PNG uploads are resized, with a 2 MB input limit and 4 megapixel limit. At most 50 temporary accounts can be active. The live service may sleep or become unavailable when free allowances run out; the sample remains available.</Typography>
  <Link component={RouterLink} to="/">Browse the gallery</Link>{' · '}<Link href="https://github.com/msiric/vesper-art">View source on GitHub</Link>
 </Container>;
}
