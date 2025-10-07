export interface AuthResponse {
  success: boolean;
  data?: any;
  error?: string;
}

class AuthService {
  private readonly API_URL = "https://hrvale.bapplware.com/api";

  async biometricLogin(employeeName: string): Promise<AuthResponse> {
    try {
      const token = btoa(employeeName);
      const response = await fetch(`${this.API_URL}/login/bio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      localStorage.setItem("bio", JSON.stringify(data));

      return {
        success: response.ok,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      };
    }
  }
}

export default new AuthService();
