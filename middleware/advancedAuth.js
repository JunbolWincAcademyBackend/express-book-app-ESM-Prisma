import { auth } from 'express-oauth2-jwt-bearer';


const authMiddleware = auth({
  audience: 'https://book-store-api',
  issuerBaseURL: `https://dev-7txjr4h7f68rlivl.us.auth0.com/`,
});

export default authMiddleware;


// NOTES:

/* Why Did You Choose advancedAuth.js Over auth.js?
From the context of our discussions, it seems that the primary reason you decided to use advancedAuth.js is because:

OAuth2 with Auth0:

advancedAuth.js uses OAuth2, which is more secure and scalable, especially when dealing with third-party services like Auth0.
The integration with Auth0 simplifies token management and provides industry-standard security, making it a more robust solution for handling user authentication.
The auth() function in advancedAuth.js comes from the express-oauth2-jwt-bearer library, which is designed to validate JWT tokens issued by an OAuth2 server like Auth0. It directly connects to Auth0’s JWT validation mechanisms.

Streamlined Implementation:

The advancedAuth.js file handles the complexity of OAuth2 authentication automatically by validating tokens against the issuerBaseURL and audience you configured in Auth0.
This is a more enterprise-level approach to authentication and ensures that your API is following best security practices.

JWT Management by Auth0:

The auth.js file you initially worked on uses manual JWT validation, which means you have to manage the token lifecycle (like issuing, refreshing, and revoking tokens). Using Auth0 offloads this responsibility to a trusted third-party service.

OAuth2 Scalability:

OAuth2 is ideal for scenarios where you have multiple clients (web, mobile) accessing the same API, and it allows you to integrate with other services more seamlessly. Auth0, as an OAuth2 provider, ensures better security, including token expiration and scope validation.

Why Not auth.js?
While auth.js worked for simple JWT-based authentication, you ultimately switched to advancedAuth.js for these reasons:

OAuth2 Security: Auth0 is providing more advanced and secure token validation via OAuth2, which auth.js doesn’t inherently offer.

Less Manual Management: Using Auth0 for OAuth2 reduces the need to manually handle secret keys, token expiration, and validation errors.

Scalability & Flexibility: OAuth2 is more scalable and flexible when dealing with multiple clients or external services.

Final Decision:
I ultimately chose advancedAuth.js because of its OAuth2 integration with Auth0, making it more secure, scalable, and easier to manage than the simpler JWT-based auth.js approach.

 */
