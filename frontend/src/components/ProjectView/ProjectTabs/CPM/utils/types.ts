// TypeScript interfaces
import React from "react";
import {Task} from "./task.ts";

export interface TaskNode {
    id: string;
    label: string;
    status: 'todo' | 'in_progress' | 'on_hold' | 'done';
}

export interface TaskEdge {
    source: string;
    target: string;
}

export interface TaskGraphProps {
    className?: string;
    style?: React.CSSProperties;
    tasks?: Task[]; // Add tasks prop
}

export type { Task };
