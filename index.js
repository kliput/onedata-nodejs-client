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
    for (let i = 0; i < 100; ++i) {
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
async function createMultipleShares(oneprovider, rootFileId) {
  const prefixes = ['alpha-sh', 'beta-sh', 'gamma-sh'];
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
    for (let i = 0; i < 100; ++i) {
      const name = `${namePrefix}-${String(i).padStart(4, '0')}`;
      promises.push(onezone.createAutomationInventory(name));
    }
  }
  return Promise.all(promises);
}

/**
 * @param {Onezone} onezone
 * @returns {Promise<Array<string>>}
 */
async function createMultipleHarvesters(onezone) {
  const endpoint = '172.17.0.2:9200';
  const harvestingBackendType = 'elasticsearch_harvesting_backend';
  const prefixes = ['alpha-hrv', 'beta-hrv', 'gamma-hrv'];
  const promises = [];
  for (const namePrefix of prefixes) {
    for (let i = 0; i < 100; ++i) {
      const name = `${namePrefix}-${String(i).padStart(4, '0')}`;
      promises.push(onezone.createHarvester(name, endpoint, harvestingBackendType));
    }
  }
  return Promise.all(promises);
}

async function index() {
  // // ---- Admin Onezone ----

  // const adminOnezoneClient = new Client();
  // adminOnezoneClient.host = 'dev-onezone.default.svc.cluster.local';
  // adminOnezoneClient.username = 'admin';
  // adminOnezoneClient.password = 'password';
  // const adminOnezone = new Onezone(adminOnezoneClient);

  // // You can start harvester using:
  // // docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.5.2
  // await createMultipleHarvesters(adminOnezone);

  // ---- Joe Onezone ----

  const joeOnezoneClient = new Client();
  joeOnezoneClient.host = 'dev-onezone.default.svc.cluster.local';
  joeOnezoneClient.username = 'joe';
  joeOnezoneClient.password = 'password';
  const joeOnezone = new Onezone(joeOnezoneClient);

  await createMultipleSpaces(joeOnezone);
  await createMultipleGroups(joeOnezone);
  await createMultipleInventories(joeOnezone);
  const tokens = await createMultipleTokens(joeOnezone);
  const accessToken = tokens[0];

  // // ---- Joe Oneprovider ----

  // // TODO: get list of tokens and get first access token
  // const accessToken =
  //   'MDAzM2xvY2F00aW9uIGRldi1vbmV6b25lLmRlZmF1bHQuc3ZjLmNsdXN00ZXIubG9jYWwKMDA2YmlkZW500aWZpZXIgMi9ubWQvdXNyLWM1MjhjM2MwMjI3NDgwNDYxMmZiMWQ1NjE5YzE3NGMyY2hjNmZlL2FjdC85OGIyNWZkOTc4ZDc1NGU1OGI3YTdjNWJiMjMyODE00OWNoODJkMgowMDFhY2lkIHRpbWUgPCAxNzY4Mzc4MDU5CjAwMmZzaWduYXR1cmUgXavmkWGwoQ1xFP102s008U9fATEidIBrmQzeOpVXPLppgK';

  const joeOneproviderClient = new Client();
  joeOneproviderClient.host = 'dev-oneprovider-krakow.default.svc.cluster.local';
  joeOneproviderClient.token = accessToken;
  const joeOneprovider = new Oneprovider(joeOneproviderClient);

  // // TODO: get rootDirId of krk-p-par-p
  await createMultipleShares(
    joeOneprovider,
    '000000000058AADC677569642373706163655F6437653166353837323338666538646662643033316562366131623438393765636832613434236437653166353837323338666538646662643033316562366131623438393765636832613434'
  );

  // ---- Other/cleanup ----

  // await removeAllSpaces(onezoneClient);
}

index();
