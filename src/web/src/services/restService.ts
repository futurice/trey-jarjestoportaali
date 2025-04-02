import axios, { AxiosInstance } from 'axios';

export interface QueryOptions {
    top?: number;
    skip?: number;
}

export interface Entity {
    id?: string;
    created?: Date;
    updated?: Date
}

export interface Result<T extends Entity> {
    result?: T | T[];
    error?: string;
    id: number;
    isCanceled: boolean;
    isCompleted: boolean;
    isCompletedSuccessfully: boolean
}

export abstract class RestService<T extends Entity> {
    protected client: AxiosInstance;

    public constructor(baseUrl: string, baseRoute: string, authToken: string) {
        // Ensure baseUrl doesn't end with a slash and baseRoute doesn't start with a slash
        const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const normalizedBaseRoute = baseRoute.startsWith('/') ? baseRoute.slice(1) : baseRoute;
        
        this.client = axios.create({
            baseURL: `${normalizedBaseUrl}/${normalizedBaseRoute}`
        });

        this.client.interceptors.request.use((config) => {
            config.headers.Authorization = `Bearer ${authToken}`;
            return config;
        });
    }

    public async getList(queryOptions?: QueryOptions): Promise<T[]> {
        const response = await this.client.request<T[] | Result<T>>({
            method: 'GET',
            data: queryOptions
        });

        // Handle both wrapped and unwrapped responses
        if (Array.isArray(response.data)) {
            return response.data;
        }

        const result = response.data as Result<T>;
        if (!result.result) {
            return [];
        }

        return Array.isArray(result.result) ? result.result : [result.result];
    }

    public async get(id: string): Promise<T> {
        const response = await this.client.request<T>({
            method: 'GET',
            url: id
        });

        return response.data
    }

    public async save(entity: T): Promise<T> {
        return entity.id
            ? await this.put(entity)
            : await this.post(entity);
    }

    public async delete(id: string): Promise<void> {
        await this.client.request<void>({
            method: 'DELETE',
            url: id
        });
    }

    private async post(entity: T): Promise<T> {
        const response = await this.client.request<T>({
            method: 'POST',
            data: entity
        });

        return response.data;
    }

    private async put(entity: T): Promise<T> {
        const response = await this.client.request<T>({
            method: 'PUT',
            url: entity.id,
            data: entity
        });

        return response.data;
    }

    public async patch(id: string, entity: Partial<T>): Promise<T> {
        const response = await this.client.request<T>({
            method: 'PATCH',
            url: id,
            data: entity
        });

        return response.data;
    }
}