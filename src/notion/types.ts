import { Tool } from '@modelcontextprotocol/sdk/types.js';

// Type definitions for tool arguments
// Blocks
export interface AppendBlockChildrenArgs {
  block_id: string;
  children: any[];
  after?: string;
}

export interface RetrieveBlockArgs {
  block_id: string;
}

export interface RetrieveBlockChildrenArgs {
  block_id: string;
  start_cursor?: string;
  page_size?: number;
}

export interface UpdateBlockArgs {
  block_id: string;
  properties: any;
}

export interface DeleteBlockArgs {
  block_id: string;
}

// Pages
export interface RetrievePageArgs {
  page_id: string;
}

export interface UpdatePagePropertiesArgs {
  page_id: string;
  properties: any;
}

// Users
export interface ListAllUsersArgs {
  start_cursor?: string;
  page_size?: number;
}

export interface RetrieveUserArgs {
  user_id: string;
}

// Databases
export interface CreateDatabaseArgs {
  parent: any;
  title: any[];
  properties: any;
}

export interface QueryDatabaseArgs {
  database_id: string;
  filter?: any;
  sorts?: any;
  start_cursor?: string;
  page_size?: number;
}

export interface RetrieveDatabaseArgs {
  database_id: string;
}

export interface UpdateDatabaseArgs {
  database_id: string;
  title?: any[];
  description?: any[];
  properties?: any;
}

export interface CreateDatabaseItemArgs {
  database_id: string;
  properties: any;
}

// Comments
export interface CreateCommentArgs {
  parent?: { page_id: string };
  discussion_id?: string;
  rich_text: any[];
}

export interface RetrieveCommentsArgs {
  block_id: string;
  start_cursor?: string;
  page_size?: number;
}

// Search
export interface SearchArgs {
  query?: string;
  filter?: { property: string; value: string };
  sort?: {
    direction: 'ascending' | 'descending';
    timestamp: 'last_edited_time';
  };
  start_cursor?: string;
  page_size?: number;
}

// Custom function types
export interface CreateWorkflowArgs {
  title: string;
  trigger: {
    type: string;
    condition: any;
  };
  actions: any[];
}

export interface TriggerWorkflowArgs {
  workflow_id: string;
  input_data?: any;
}

export interface ImportFromCSVArgs {
  database_id: string;
  csv_content: string;
  column_mappings?: Record<string, string>;
}

export interface ExportToCSVArgs {
  database_id: string;
  filter?: any;
}

export interface CreateRecurringTaskArgs {
  database_id: string;
  task_properties: any;
  recurrence_pattern: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    end_date?: string;
    days_of_week?: string[];
  };
}
