// FIXME: support: https://onedata.org/training/rest-hands-on.html#8

const { Client } = require('./client');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

class Onezone {
  /**
   * @param {Client} client
   */
  constructor(client) {
    if (!client) {
      throw new Error('you must provide Client instance');
    }
    this.client = client;
  }

  get baseOpts() {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${this.basicAuth}`,
      },
    };
  }

  async listSpaces() {
    const resp = await this.client.fetch('GET', 'onezone/user/spaces');
    await Client.validateResponse(resp, 'list spaces');
    const data = await resp.json();
    return data.spaces;
  }

  async createSpace(name) {
    const resp = await this.client.fetch('POST', 'onezone/user/spaces', { name });
    await Client.validateResponse(resp, 'create space');
    const respLocation = resp.headers.get('location');
    if (!respLocation) {
      throw new Error('createSpace response has no location header');
    }
    const spaceId = respLocation.match(/.*\/(.*)$/)?.[1];
    if (!spaceId) {
      throw new Error(`createSpace location reponse no valid space ID: ${respLocation}`);
    }
    return spaceId;
  }

  async removeSpace(spaceId) {
    const path = `onezone/user/spaces/${spaceId}`;
    const resp = await this.client.fetch('DELETE', path);
    await Client.validateResponse(resp, 'remove space');
  }

  /**
   * @param {string} tokenName
   * @param {Object} properties
   * @returns {Promise<{ tokenId, token }>}
   */
  async createNamedToken(tokenName, properties) {
    const resp = await this.client.fetch('POST', 'onezone/user/tokens/named', {
      name: tokenName,
      ...properties,
    });
    await Client.validateResponse(resp, 'create token');
    const data = await resp.json();
    return data.token;
  }

  async createGroup(name, properties = {}) {
    const resp = await this.client.fetch('POST', 'onezone/user/groups', {
      name,
      ...properties,
    });
    await Client.validateResponse(resp, 'create group');
    const respLocation = resp.headers.get('location');
    if (!respLocation) {
      throw new Error('createGroup response has no location header');
    }
    const groupId = respLocation.match(/.*\/(.*)$/)?.[1];
    if (!groupId) {
      throw new Error(`createGroup location reponse no valid group ID: ${respLocation}`);
    }
    return groupId;
  }

  async createAutomationInventory(name) {
    const resp = await this.client.fetch('POST', 'onezone/user/atm_inventories', {
      name,
    });
    await Client.validateResponse(resp, 'create automation inventory');
    const respLocation = resp.headers.get('location');
    if (!respLocation) {
      throw new Error('createAutomationInventory response has no location header');
    }
    const inventoryId = respLocation.match(/.*\/(.*)$/)?.[1];
    if (!inventoryId) {
      throw new Error(`createAutomationInventory location reponse no valid ID: ${respLocation}`);
    }
    return inventoryId;
  }
}

module.exports = { Onezone };
