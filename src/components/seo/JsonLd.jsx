import { Helmet } from 'react-helmet-async';

/** Injects a JSON-LD <script> into <head> for structured data. */
export const JsonLd = ({ data }) => (
  <Helmet>
    <script type="application/ld+json">{JSON.stringify(data)}</script>
  </Helmet>
);
