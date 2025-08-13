// server/zoom-client.js
const fetch = require('node-fetch'); // Use existing dependency

class ZoomClient {
  constructor() {
    this.baseURL = 'https://api.zoom.us/v2';
    this.accessToken = null;
    this.tokenExpiry = null;
    
    // Required environment variables
    this.accountId = process.env.ZOOM_ACCOUNT_ID;
    this.clientId = process.env.ZOOM_CLIENT_ID;
    this.clientSecret = process.env.ZOOM_CLIENT_SECRET;
    
    if (!this.accountId || !this.clientId || !this.clientSecret) {
      console.error('Missing Zoom credentials:', {
        accountId: !!this.accountId,
        clientId: !!this.clientId,
        clientSecret: !!this.clientSecret
      });
      throw new Error('Missing required Zoom credentials in environment variables');
    }
  }

  async getAccessToken() {
    // Return existing token if still valid
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const tokenUrl = 'https://zoom.us/oauth/token';
    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    
    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'account_credentials',
          account_id: this.accountId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Zoom authentication failed:', error);
        throw new Error(`Authentication failed: ${error.error_description || error.error}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      // Set expiry 5 minutes before actual expiry for safety
      this.tokenExpiry = Date.now() + ((data.expires_in - 300) * 1000);
      
      console.log('Zoom authentication successful');
      return this.accessToken;
    } catch (error) {
      console.error('Failed to get Zoom access token:', error);
      throw new Error(`Failed to get access token: ${error.message}`);
    }
  }

  async makeRequest(endpoint, options = {}) {
    const token = await this.getAccessToken();
    
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json();
      console.error(`Zoom API request failed for ${endpoint}:`, error);
      throw new Error(`API request failed: ${error.message || response.statusText}`);
    }

    return response.json();
  }

  async getMeetingParticipants(meetingId) {
    return this.makeRequest(`/report/meetings/${meetingId}/participants`);
  }

  async getMeetingDetails(meetingId) {
    return this.makeRequest(`/meetings/${meetingId}`);
  }
}

// Export singleton instance
const zoomClient = new ZoomClient();
module.exports = zoomClient;