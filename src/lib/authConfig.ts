import { type Configuration, PublicClientApplication } from '@azure/msal-browser'

const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID as string,
    authority: 'https://login.microsoftonline.com/' + process.env.NEXT_PUBLIC_AZURE_TENANT_ID,
  },
}

export const msalInstance = new PublicClientApplication(msalConfig)
