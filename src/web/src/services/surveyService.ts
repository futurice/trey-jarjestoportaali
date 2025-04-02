import {RestService} from "./restService.ts";
import {Survey} from "../models/survey.ts";
import {Roles} from "../authentication";

export class SurveyService extends RestService<Survey> {
    public readonly baseUrl: string;
    public readonly role: Roles;
    public readonly authToken: string;

    public constructor(baseUrl: string, role: Roles, authToken: string) {
        const baseRoute = role === Roles.ADMIN ? 'surveys' : 'surveys/organization';
        super(baseUrl, baseRoute, authToken);
        this.baseUrl = baseUrl;
        this.role = role;
        this.authToken = authToken;
    }
}