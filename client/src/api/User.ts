import { z } from "zod";
import { validateResponse } from "./ValidateRequest";

const UserSchema = z.object({
    id: z.string(),
    username: z.string(),
    email: z.string()
});

export type User = z.infer<typeof UserSchema>;

export function registerUser(username: string, email: string, password: string): Promise<void> {
    return fetch('/api/register', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, email, password})
    })
        .then(() => undefined);
}

export function login(email: string, password: string): Promise<void> {
    return fetch('/api/login', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    })
        .then(validateResponse)
        .then(() => undefined);
}

export function logout(): Promise<void> {
    return fetch('/api/logout', {method: 'post'})
        .then(() => undefined);
}

export function fetchMe(): Promise<User> {
    return fetch('/api/users/me')
        .then(validateResponse)
        .then(response => response.json())
        .then(data => UserSchema.parse(data));
}