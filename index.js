#!/usr/bin/env node

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { Onezone } = require('./onezone.js');
const { Oneprovider } = require('./oneprovider.js');
const { Client } = require('./client.js');

// Create multiple spaces with prefixes
/**
 * @param {Onezone} onezone
 * @returns {Promise<Array>}
 */
async function createMultipleSpaces(onezone) {
  const prefixes = ['alpha', 'beta', 'gamma'];
  const promises = [];
  for (const namePrefix of prefixes) {
    for (let i = 0; i < 100; ++i) {
      const name = `${namePrefix}-${String(i).padStart(4, '0')}`;
      promises.push(onezone.createSpace(name));
    }
  }
  return Promise.all(promises);
}

/**
 * @param {Onezone} onezone
 * @returns {Promise<Array>}
 */
async function createMultipleGroups(onezone) {
  const prefixes = ['alpha', 'beta', 'gamma'];
  const promises = [];
  for (const namePrefix of prefixes) {
    for (let i = 1; i < 100; ++i) {
      const name = `${namePrefix}-${String(i).padStart(4, '0')}`;
      promises.push(onezone.createGroup(name));
    }
  }
  return Promise.all(promises);
}

/**
 * @param {Onezone} onezone
 * @returns {Promise<void>}
 */
async function removeAllSpaces(onezone) {
  for (const spaceId of await onezone.listSpaces()) {
    if (spaceId === 'b3301bb7a35837f975ad046586bad2efch6aba') {
      continue;
    }
    onezone.removeSpace(spaceId);
  }
}

/**
 * @param {Onezone} onezone
 * @returns {Promise<void>}
 */
async function createMultipleTokens(onezone, valid = true) {
  const prefixes = ['foo', 'bar'];
  const promises = [];
  const validUntil = (valid ? 2 : 1) * 1000000000;
  const tokenProperties = {
    type: { accessToken: {} },
    caveats: [
      { type: 'time', validUntil },
    ],
  };
  for (const namePrefix of prefixes) {
    for (let i = 0; i < 50; ++i) {
      const name = `${namePrefix}-${String(i).padStart(4, '0')}`;
      promises.push(onezone.createNamedToken(name, tokenProperties));
    }
  }
  return Promise.all(promises);
}

/**
 *
 * @param {Oneprovider} oneprovider
 */
async function createMultipleShares(oneprovider) {
  const rootFileId =
    '000000000058F65E677569642373706163655F3534366265643365356163356636646465333234353536373436393537316136636835306533233534366265643365356163356636646465333234353536373436393537316136636835306533';

  const prefixes = ['Andrzej', 'Barbara', 'Cecylia'];
  const promises = [];
  for (const namePrefix of prefixes) {
    for (let i = 0; i < 50; ++i) {
      const name = `${namePrefix}-${String(i).padStart(4, '0')}`;
      promises.push(
        oneprovider.createShare(
          rootFileId,
          name
        )
      );
    }
  }
}

/**
 * @param {Onezone} onezone
 * @returns {Promise<Array>}
 */
async function createMultipleInventories(onezone) {
  const prefixes = ['alpha-inv', 'beta-inv', 'gamma-inv'];
  const promises = [];
  for (const namePrefix of prefixes) {
    for (let i = 1; i < 100; ++i) {
      const name = `${namePrefix}-${String(i).padStart(4, '0')}`;
      promises.push(onezone.createAutomationInventory(name));
    }
  }
  return Promise.all(promises);
}

async function index() {
  const onezoneClient = new Client();
  onezoneClient.host = 'dev-onezone.default.svc.cluster.local';
  onezoneClient.username = 'joe';
  onezoneClient.password = 'password';
  const onezone = new Onezone(onezoneClient);

  // // await createMultipleSpaces(onezone);
  // // await createMultipleGroups(onezone);
  // // const tokens = await createMultipleTokens(onezone);
  // // const token = tokens[0];

  // const oneproviderClient = new Client();
  // oneproviderClient.host = 'dev-oneprovider-krakow.default.svc.cluster.local';
  // oneproviderClient.token =
  //   'MDAzM2xvY2F00aW9uIGRldi1vbmV6b25lLmRlZmF1bHQuc3ZjLmNsdXN00ZXIubG9jYWwKMDA2YmlkZW500aWZpZXIgMi9ubWQvdXNyLTI5YzU1M2Y4NjNlYjlhOGM4MjVlNmE5Y2Q00MmFlM2Y1Y2gxYzIwL2FjdC8xNWY2M2U4MTVkYTE1MDI3MjZmM2IyNjBkMmRhOThjOWNoMzEwMgowMDFhY2lkIHRpbWUgPCAyMDAwMDAwMDAwCjAwMmZzaWduYXR1cmUghpjDfEHZ019bx25JmpXXVQXZ2XtUXPQz71Ypeun8PJzIK';
  // const oneprovider = new Oneprovider(oneproviderClient);

  // await createMultipleShares(oneprovider);

  await createMultipleInventories(onezone);

  // await removeAllSpaces(onezoneClient);
}

index();
