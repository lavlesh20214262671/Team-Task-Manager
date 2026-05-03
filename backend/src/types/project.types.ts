export type CreateProjectBody = {
  name: string;
  description?: string;
};

export type AddProjectMemberBody = {
  email: string;
  role?: 'ADMIN' | 'MEMBER';
};
