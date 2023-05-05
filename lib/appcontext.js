import React from "react";
import { deleteJSON, fetchJSON, postJSON, putJSON } from "./http.js";
export const IP = "192.168.0.106";
//const BASE_URL = "http://192.168.0.106:3000";
console.log("====================================");
console.log(IP);
console.log("====================================");
const BASE_URL = `http://${IP}:3000`;

//http://${process.env.IP}:3000`;/:location/logs
export const Appcontext = React.createContext({
  async listLocations() {
    return await fetchJSON(BASE_URL + "/api/locations");
  },
  async getLocation(id) {
    console.log("id is ", id);
    return await fetchJSON(BASE_URL + `/api/locations/${id}`);
  },

  async getLocationAlarmLogs(location) {
    console.log("id is ", location);
    return await fetchJSON(BASE_URL + `/api/locations/${location}/logs`);
  },
  async getLatestLocationAlarmLogs(location) {
    console.log("id is ", location);
    return await fetchJSON(BASE_URL + `/api/locations/${location}/logs/alarms`);
  },
  async getLocationDataInterVal(location, time) {
    console.log("id is ", location, time);
    return await fetchJSON(
      BASE_URL + `/api/locations/${location}/data/${time}`
    );
  },
  async getLocationSunLightInterVal(location, time) {
    console.log("id is ", location, time);
    return await fetchJSON(
      BASE_URL + `/api/locations/${location}/light/${time}`
    );
  },
  async updateLocation(data) {
    return await putJSON(BASE_URL + `/api/locations/`, data);
  },
  async createLocation(data) {
    return await postJSON(BASE_URL + `/api/locations`, data);
  },
  async removeLocation(data) {
    return await deleteJSON(BASE_URL + `/api/locations`, data);
  },
  async fetchLogin() {
    return await fetchJSON(BASE_URL + "/api/login");
  },
  async logInUser(user) {
    return await postJSON(BASE_URL + "/api/login", user);
  },
  async logOutUser(user) {
    return await deleteJSON(BASE_URL + "/api/login", user);
  },
  async createUser(user) {
    return await postJSON(BASE_URL + "/api/login/new", user);
  },
  async updateDevice(id, data) {
    return await putJSON(BASE_URL + `/api/devices/${id}`, data);
  },
  async listDevices() {
    return await fetchJSON(BASE_URL + `/api/devices`);
  },
  async getFW() {
    return await fetchJSON(BASE_URL + `/api/devices/id/builds`);
  },
  async createNotification(data) {
    return await postJSON(BASE_URL + `/api/login/token`, data);
  },
});
