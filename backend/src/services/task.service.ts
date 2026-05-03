import prisma from '../config/db';
import { CreateTaskBody, UpdateTaskBody } from '../types/task.types';

export const createTask = async (
	projectId: number,
	creatorId: number,
	payload: CreateTaskBody
) => {
	return prisma.task.create({
		data: {
			...payload,
			projectId,
			createdBy: creatorId,
			dueDate: payload.dueDate ? new Date(payload.dueDate) : null
		},
		include: {
			assignee: { select: { id: true, name: true } },
			creator: { select: { id: true, name: true } }
		}
	});
};

export const listProjectTasks = async (projectId: number) => {
	return prisma.task.findMany({
		where: { projectId },
		include: {
			assignee: { select: { id: true, name: true } },
			creator: { select: { id: true, name: true } }
		},
		orderBy: { createdAt: 'desc' }
	});
};

export const getTaskById = async (projectId: number, taskId: number) => {
	return prisma.task.findFirst({
		where: { id: taskId, projectId }
	});
};

export const updateTask = async (taskId: number, payload: UpdateTaskBody) => {
	const dueDate =
		payload.dueDate === null
			? null
			: payload.dueDate
				? new Date(payload.dueDate)
				: undefined;

	return prisma.task.update({
		where: { id: taskId },
		data: { ...payload, dueDate },
		include: {
			assignee: { select: { id: true, name: true } },
			creator: { select: { id: true, name: true } }
		}
	});
};

export const getProjectMemberRole = async (projectId: number, userId: number) => {
	return prisma.projectMember.findUnique({
		where: { projectId_userId: { userId, projectId } }
	});
};
