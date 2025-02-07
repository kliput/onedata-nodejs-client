// TODO: Add spaces supporting: https://onedata.org/training/rest-hands-on.html#8

const { Client } = require('./client');

class Oneprovider {
  /**
   * @param {Client} client
   */
  constructor(client) {
    if (!client) {
      throw new Error('you must provide Client instance');
    }
    this.client = client;
  }

  /**
   * @param {string} rootFileId
   * @param {string} shareName
   * @returns {string} Created share ID.
   */
  async createShare(rootFileId, shareName) {
    const resp = await this.client.fetch('POST', 'oneprovider/shares', {
      name: shareName,
      rootFileId,
    });
    await Client.validateResponse(resp, 'create share');
    const result = await resp.json();
    return result.shareId;
  }
}

module.exports = { Oneprovider };
