export interface User {
    id: string;
    name: string;
    age: number | null;
    score: number;
    battery: number;
}

export interface UserUpdate {
    name?: string;
    age?: number | null;
    score?: number;
    battery?: number;
}