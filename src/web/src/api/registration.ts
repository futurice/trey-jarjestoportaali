import axios from "axios";
import config from "../config";
import {Organization} from "../models/organization.ts";

const API_URL = config.api.baseUrl;

export const postRegistration = async (data: Organization) => {
    return await axios.post(`${API_URL}/organization`, data);
}
