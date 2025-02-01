// TypeScript interfaces
import React from "react";
import {Task} from "./task.ts";
import {TaskStatus} from "../../../../../types/TaskStatuses.ts";

export interface TaskNode {
    id: string;
    label: string;
    status: TaskStatus;
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
