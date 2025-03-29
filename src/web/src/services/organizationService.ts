import {RestService} from "./restService.ts";
import {Organization} from "../models/organization.ts";

export class OrganizationService extends RestService<Organization> {
    public constructor(baseUrl: string, baseRoute: string) {
        super(baseUrl, baseRoute);
    }
}