import { OffersInterface } from '../data/product-data';

export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

const API_BASE_URL = 'http://localhost:8080/api/offers';

class OffersApi {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    async getAll(): Promise<OffersInterface[]> {
        const res = await fetch(this.baseUrl, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Failed to fetch offers');

        const json: ApiResponse<OffersInterface[]> = await res.json();
        return json.data;
    }

    async getById(id: string | number): Promise<OffersInterface> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch offer');
        const json: ApiResponse<OffersInterface> = await response.json();
        return json.data;
    }

    async create(data: OffersInterface): Promise<OffersInterface> {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create offer');
        const json: ApiResponse<OffersInterface> = await response.json();
        return json.data;
    }

    async update(
        id: string | number,
        data: Partial<OffersInterface>,
    ): Promise<OffersInterface> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update offer');
        const json: ApiResponse<OffersInterface> = await response.json();
        return json.data;
    }

    async delete(id: string | number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to delete offer');
    }
}

export const offersApi = new OffersApi();
