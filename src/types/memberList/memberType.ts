import type { User } from "@/types/user";

export interface ColumnConfig {
    key: string;
    label: string;
    render?: (user: User, index: number) => React.ReactNode;
    width?: string;
    sortable?: boolean;
    filterable?: boolean;
}

export interface DialogProps {
    open: boolean;
    user?: User | null;
    onClose: () => void;
    onSave: () => void;
}