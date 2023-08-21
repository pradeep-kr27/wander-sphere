import { Application } from "express";

import { register, login } from '../controllers/authController';

export function authRoutes(app: Application) {
    app.post('/register', register);
    app.post('/login', login);
}
