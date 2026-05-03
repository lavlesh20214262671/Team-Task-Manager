import prisma from '../config/db';

export const getProjectStats = async (projectId: number) => {
	const [totalTasks, statusCounts, tasksPerUser, overdueTasks] =
		await Promise.all([
			prisma.task.count({ where: { projectId } }),
			prisma.task.groupBy({
				by: ['status'],
				where: { projectId },
				_count: { status: true }
			}),
			prisma.task.findMany({
				where: { projectId, assigneeId: { not: null } },
				select: {
					assignee: {
						select: { id: true, name: true }
					}
				}
			}),
			prisma.task.count({
				where: {
					projectId,
					dueDate: { lt: new Date() },
					status: { not: 'DONE' }
				}
			})
		]);

	const perUserMap: Record<string, number> = {};
	tasksPerUser.forEach((task) => {
		if (task.assignee) {
			perUserMap[task.assignee.id] =
				(perUserMap[task.assignee.id] || 0) + 1;
		}
	});

	const byStatus = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
	statusCounts.forEach((statusGroup) => {
		byStatus[statusGroup.status as keyof typeof byStatus] =
			statusGroup._count.status;
	});

	return {
		totalTasks,
		byStatus,
		perUser: perUserMap,
		overdueTasks
	};
};
