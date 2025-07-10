declare global {
  interface Window {
    AppleID: {
      auth: {
        init: (config: AppleSignInConfig) => Promise<void>
        signIn: () => Promise<AppleSignInResponse>
      }
    }
  }
}

interface AppleSignInConfig {
  clientId: string
  scope: string
  redirectURI: string
  state: string
  usePopup?: boolean
}

interface AppleSignInResponse {
  authorization: {
    code: string
    id_token: string
    state: string
  }
  user?: {
    email?: string
    name?: {
      firstName?: string
      lastName?: string
    }
  }
}

export {}
