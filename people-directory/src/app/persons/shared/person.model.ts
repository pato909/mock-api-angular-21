export interface Person {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    email: string;
    phone: string;
    avatar: string;
    created_at: string;
    updated_at: string;
}

export type PersonUpsertPayload = Omit<Person, 'id' | 'created_at' | 'updated_at'>;