import { Api, JsonRpc, Serialize, Numeric } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'

// Main action call to blockchain
const APP_KEY_NAME = 'memoize_key';
const APP_ACCOUNT_NAME = 'memoize_account';
const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);

// 5Js3csjeHW55EHRBixJU8YdhMtAxhwP1iFN9P3y75BrhdLABSWe

async function takeAction(action, dataValue) {
  const privateKey = localStorage.getItem(APP_KEY_NAME);
  const signatureProvider = new JsSignatureProvider([privateKey]);
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

  // Main call to blockchain after setting action, account_name and data
  try {
    const resultWithConfig = await api.transact({
      actions: [{
        account: process.env.REACT_APP_EOS_CONTRACT_NAME,
        name: action,
        authorization: [{
          actor: localStorage.getItem(APP_ACCOUNT_NAME),
          permission: 'active',
        }],
        data: dataValue,
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
    return resultWithConfig;
  } catch (err) {
    console.log(err);
    throw (err)
  }
}

class ApiService {
  static getCurrentUser() {
    return new Promise((resolve, reject) => {
      if (!localStorage.getItem(APP_ACCOUNT_NAME)) {
        return reject();
      }
      takeAction('hi', { from: localStorage.getItem(APP_ACCOUNT_NAME), message: 'get current user...' })
        .then(() => {
          resolve(localStorage.getItem(APP_ACCOUNT_NAME));
        })
        .catch(err => {
          localStorage.removeItem(APP_ACCOUNT_NAME);
          localStorage.removeItem(APP_KEY_NAME);
          reject(err);
        });
    });
  }

  static async login({ from, key }) {
    try {
      localStorage.setItem(APP_ACCOUNT_NAME, from);
      localStorage.setItem(APP_KEY_NAME, key);

      // leverage on the hi action to check if the authorization is correct
      const data = await takeAction('hi', { from, message: 'login...' });
      return data;
    }
    catch(err) {
      localStorage.removeItem(APP_ACCOUNT_NAME);
      localStorage.removeItem(APP_KEY_NAME);
      throw err;
    }
  }

  static logout() {
    localStorage.removeItem(APP_ACCOUNT_NAME);
    localStorage.removeItem(APP_KEY_NAME);
  }

  static addNewVehicle({ plate_number }) {
    const from = localStorage.getItem(APP_ACCOUNT_NAME);
    return takeAction('addplate', { from, plate_number });
  }

  static deleteVehicle({ plate_number }) {
    const from = localStorage.getItem(APP_ACCOUNT_NAME);
    return takeAction('delplate', { from, plate_number });
  }

  static updateVehicle({ vehicle_id, chasis_sn, manufacture_date, ownership_date }) {
    const from = localStorage.getItem(APP_ACCOUNT_NAME);
    return takeAction('updvehicle', { from, id: vehicle_id, chasis_sn, manufacture_date, ownership_date });
  }

  static addServiceRecord({ vehicle_id, service_date, memo }) {
    const from = localStorage.getItem(APP_ACCOUNT_NAME);
    return takeAction('addservice', { from, vehicle_id, service_date, memo });
  }

  static deleteServiceRecord({ service_id }) {
    const from = localStorage.getItem(APP_ACCOUNT_NAME);
    return takeAction('delservice', { from, id: service_id });
  }

  static async fetchVehicleList() {
    const from = localStorage.getItem(APP_ACCOUNT_NAME);
    try {
      const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
      const result = await rpc.get_table_rows({
        json: true,               // Get the response as json
        code: process.env.REACT_APP_EOS_CONTRACT_NAME,  // Contract that we target
        scope: process.env.REACT_APP_EOS_CONTRACT_NAME, // Account that owns the data
        table: 'vehicle',         // Table name
        index_position: 2,        // Table secondary index
        key_type: 'name',         // https://cmichel.io/how-to-fetch-table-indexes-using-eosjs/
        lower_bound: from,        // Table secondary key value
        limit: 9999,              // Here we limit to 1 to get only row
      });
      return result.rows;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async fetchServiceRecords(vehicle_id) {
    const from = localStorage.getItem(APP_ACCOUNT_NAME);
    try {
      const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
      const result = await rpc.get_table_rows({
        json: true,                 // Get the response as json
        code: process.env.REACT_APP_EOS_CONTRACT_NAME,  // Contract that we target
        scope: process.env.REACT_APP_EOS_CONTRACT_NAME, // Account that owns the data
        table: 'service',           // Table name
        index_position: 2,          // Table secondary index
        lower_bound: vehicle_id,    // Table secondary key value
        limit: 9999,              // Here we limit to 1 to get only row
      });
      return result.rows;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

}

export default ApiService;
