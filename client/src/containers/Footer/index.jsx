import React from 'react';
import { Container, Link, Typography } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
export default function Footer() {
 return <footer style={{borderTop:'1px solid #555',padding:'28px 0',marginTop:32}}><Container>
  <Typography paragraph>Vesper · Portfolio demo. No real purchases or usage rights.</Typography>
  <nav aria-label="Footer" style={{display:'flex',flexWrap:'wrap',gap:24}}>
   <Link component={RouterLink} to="/">Gallery</Link><Link component={RouterLink} to="/about">About the demo</Link>
   <Link component={RouterLink} to="/how_it_works">How it works</Link><Link component={RouterLink} to="/privacy_policy">Demo data and privacy</Link>
   <Link component={RouterLink} to="/license_information">Simulated licenses</Link><Link href="https://github.com/msiric/vesper-art">Source on GitHub</Link>
  </nav></Container></footer>;
}
