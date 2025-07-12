export interface AppleSignInConfig {
  clientId: string
  scope: string
  redirectURI: string
  state: string
  usePopup?: boolean
}

export interface AppleSignInResponse {
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

export class AppleSignInManager {
  private static instance: AppleSignInManager
  private isInitialized = false

  static getInstance(): AppleSignInManager {
    if (!AppleSignInManager.instance) {
      AppleSignInManager.instance = new AppleSignInManager()
    }
    return AppleSignInManager.instance
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    return new Promise((resolve, reject) => {
      // Check if Apple Sign-In script is already loaded
      if (window.AppleID) {
        this.isInitialized = true
        resolve()
        return
      }

      // Load Apple Sign-In script
      const script = document.createElement("script")
      script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
      script.async = true
      script.defer = true

      script.onload = () => {
        if (window.AppleID) {
          this.isInitialized = true
          resolve()
        } else {
          reject(new Error("Apple Sign-In script loaded but AppleID not available"))
        }
      }

      script.onerror = () => {
        reject(new Error("Failed to load Apple Sign-In script"))
      }

      document.head.appendChild(script)
    })
  }

  async signIn(): Promise<AppleSignInResponse> {
    await this.initialize()

    const config: AppleSignInConfig = {
      clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "com.prettystyles.signin",
      scope: "name email",
      redirectURI: `${window.location.origin}/auth/apple/callback`,
      state: this.generateState(),
      usePopup: true,
    }

    try {
      await window.AppleID.auth.init(config)
      const response = await window.AppleID.auth.signIn()
      return response
    } catch (error) {
      console.error("Apple Sign-In error:", error)
      throw new Error("Apple Sign-In was cancelled or failed")
    }
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  isAvailable(): boolean {
    // Apple Sign-In works best on Safari and iOS devices
    const userAgent = navigator.userAgent.toLowerCase()
    const isSafari = userAgent.includes("safari") && !userAgent.includes("chrome")
    const isIOS = /ipad|iphone|ipod/.test(userAgent)
    const isMac = userAgent.includes("mac")

    return isSafari || isIOS || isMac
  }

  getRecommendation(): string {
    if (this.isAvailable()) {
      return "Apple Sign-In is supported on your device."
    } else {
      return "Apple Sign-In works best on Safari browser or Apple devices. Consider using Google or email sign-in instead."
    }
  }
}

// Global type declarations
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
