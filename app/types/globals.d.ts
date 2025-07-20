export {};

import "react-router";
declare module "react-router" {
  interface AppLoadContext {
    // add context properties here
  }
}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      isCreator?: boolean;
    };
  }
}
