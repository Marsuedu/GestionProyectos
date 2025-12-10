export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    is_enabled: boolean;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
    roles: Role[];
    projects?: Project[];
    assigned_tasks?: Task[];
}

export interface Role {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface Project {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    created_by: number;
    created_at: string;
    updated_at: string;
    creator?: User;
    users?: User[];
    tasks?: Task[];
    files?: File[];
    tasks_count?: number;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    status: 'pending' | 'in_progress' | 'completed';
    project_id: number;
    assigned_user_id: number;
    created_by: number;
    created_at: string;
    updated_at: string;
    project?: Project;
    assigned_user?: User;
    creator?: User;
    files?: File[];
}

export interface File {
    id: number;
    name: string;
    original_name: string;
    path: string;
    size: number;
    mime_type: string;
    fileable_type: string;
    fileable_id: number;
    uploaded_by: number;
    created_at: string;
    updated_at: string;
    uploader?: User;
}

export interface ActivityLog {
    id: number;
    user_id: number;
    action: string;
    model_type: string;
    model_id: number;
    description: string;
    ip_address?: string;
    user_agent?: string;
    created_at: string;
    updated_at: string;
    user?: User;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
} & T

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface DashboardStats {
    total_projects: number;
    total_tasks: number;
    pending_tasks: number;
    completed_tasks: number;
}
