import prisma from '../config/db';
import { AddProjectMemberBody, CreateProjectBody } from '../types/project.types';

export const createProject = async (userId: number, payload: CreateProjectBody) => {
	return prisma.project.create({
		data: {
			name: payload.name,
			description: payload.description,
			members: {
				create: {
					userId,
					role: 'ADMIN'
				}
			}
		}
	});
};

export const listUserProjects = async (userId: number) => {
	return prisma.project.findMany({
		where: {
			members: {
				some: { userId }
			}
		},
		include: {
			members: {
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true
						}
					}
				}
			}
		}
	});
};

export const addProjectMember = async (
	projectId: number,
	payload: AddProjectMemberBody
) => {
	const userToAdd = await prisma.user.findUnique({
		where: { email: payload.email }
	});

	if (!userToAdd) {
		return null;
	}

	return prisma.projectMember.create({
		data: {
			projectId,
			userId: userToAdd.id,
			role: payload.role || 'MEMBER'
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true
				}
			}
		}
	});
};

export const removeProjectMember = async (projectId: number, userId: number) => {
	return prisma.projectMember.delete({
		where: {
			projectId_userId: {
				projectId,
				userId
			}
		}
	});
};
