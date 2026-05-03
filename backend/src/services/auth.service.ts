import bcrypt from 'bcryptjs';
import prisma from '../config/db';
import {
	generateAccessToken,
	generateRefreshToken,
	verifyToken
} from '../utils/jwt';
import { LoginBody, SignupBody } from '../types/auth.types';

export const signupUser = async (payload: SignupBody) => {
	const { name, email, password } = payload;

	const exists = await prisma.user.findUnique({
		where: { email }
	});

	if (exists) {
		return null;
	}

	const hash = await bcrypt.hash(password, 10);
	const user = await prisma.user.create({
		data: {
			name,
			email,
			password: hash
		}
	});

	const accessToken = generateAccessToken({ id: user.id });
	const refreshToken = generateRefreshToken({ id: user.id });

	return {
		accessToken,
		refreshToken,
		user: {
			id: user.id,
			name: user.name,
			email: user.email
		}
	};
};

export const loginUser = async (payload: LoginBody) => {
	const { email, password } = payload;
	const user = await prisma.user.findUnique({
		where: { email }
	});

	if (!user) {
		return null;
	}

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		return null;
	}

	const accessToken = generateAccessToken({ id: user.id });
	const refreshToken = generateRefreshToken({ id: user.id });

	return {
		accessToken,
		refreshToken,
		user: {
			id: user.id,
			name: user.name,
			email: user.email
		}
	};
};

export const refreshAccessToken = async (token: string) => {
	const decoded = verifyToken(
		token,
		process.env.JWT_REFRESH_SECRET!
	) as { id: number };

	return generateAccessToken({ id: decoded.id });
};

export const getUserProfile = async (userId: number) => {
	return prisma.user.findUnique({
		where: { id: userId },
		select: { id: true, name: true, email: true }
	});
};
