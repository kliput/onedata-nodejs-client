class Client {
  host = '';
  username = '';
  password = '';
  token = '';

  get basicAuth() {
    return Buffer.from(`${this.username}:${this.password}`).toString('base64');
  }

  get xAuthToken() {
    return this.token;
  }

  /**
   * @param {Response} response
   * @param {string} requestName
   */
  static async validateResponse(response, requestName) {
    if (!response.ok) {
      throw new Error(
        `${requestName} response is not successful: ${response.status} ${response.statusText}; ${JSON.stringify(await response.json())}`
      );
    }
  }

  get baseOpts() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.basicAuth) {
      headers['Authorization'] = `Basic ${this.basicAuth}`;
    }
    if (this.xAuthToken) {
      headers['X-Auth-Token'] = this.xAuthToken;
    }
    return {
      headers,
    };
  }

  async fetch(method, path, data, options) {
    const opts = {
      ...this.baseOpts,
      method,
      ...options,
    };
    if (data) {
      opts.body = JSON.stringify(data);
    }
    return await fetch(`https://${this.host}/api/v3/${path}`, opts);
  }

}

module.exports = { Client };
