import { authService } from './authService';
import type { UserUpdate, User } from '../types/user';
import { EnvConfig } from '../EnvConfig';

const BASE_URL = EnvConfig.VITE_BACKEND_API_URL

async function getAuthHeaders() {
    const token = await authService.getToken();
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
}

export const apiService = {
    async getMe(): Promise<User> {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}/users/me`, { headers });
        if (!response.ok) throw new Error('Failed to fetch profile');
        return response.json();
    },

    async updateMe(data: UserUpdate) {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}/users/me`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update profile');
        return response.json();
    },

    async extractSigns(file: File) {
        const token = await authService.getToken();
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${BASE_URL}/extract-signs`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) throw new Error('AI Service failed');
        return response.json();
    }
};