import React from "react";
import { Link as RouterLink } from "react-router-dom";
import SyncButton from "../components/SyncButton";
import Container from "../domain/Container";
import Typography from "../domain/Typography";
import Link from "../domain/Link";

export default function DemoWelcome() {
  return (
    <Container maxWidth="sm" style={{ paddingTop: 64, paddingBottom: 64, textAlign: "center" }}>
      <Typography variant="h4" component="h1" gutterBottom>Welcome to Vesper</Typography>
      <Typography paragraph>
        Save your favorite artwork, leave comments and build your collection.
        You can also upload a small test image and explore the order workflow.
      </Typography>
      <Typography paragraph>
        This demo creates a temporary account with no email or password.
        Accounts expire after 24 hours; their content is removed when a later session starts.
        Ending a session signs you out without immediately deleting its content.
      </Typography>
      <Typography paragraph>
        Use non-sensitive test content you have permission to share. Uploads and comments
        may be visible to other visitors. Orders are simulated and grant no usage rights.
      </Typography>
      <SyncButton onClick={() => window.dispatchEvent(new Event("vesper-demo-start"))}>
        Start session
      </SyncButton>
      <Typography style={{ marginTop: 24 }}>
        <Link component={RouterLink} to="/privacy_policy">Privacy policy</Link>
        {" · "}<Link component={RouterLink} to="/">Back to the gallery</Link>
      </Typography>
    </Container>
  );
}
