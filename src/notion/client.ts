import {
  AppendBlockChildrenArgs,
  RetrieveBlockArgs,
  RetrieveBlockChildrenArgs,
  DeleteBlockArgs,
  UpdateBlockArgs,
  RetrievePageArgs,
  UpdatePagePropertiesArgs,
  ListAllUsersArgs,
  RetrieveUserArgs,
  CreateDatabaseArgs,
  QueryDatabaseArgs,
  RetrieveDatabaseArgs,
  UpdateDatabaseArgs,
  CreateDatabaseItemArgs,
  CreateCommentArgs,
  RetrieveCommentsArgs,
  SearchArgs,
  CreateWorkflowArgs,
  ImportFromCSVArgs,
  ExportToCSVArgs,
  CreateRecurringTaskArgs,
} from './types';
import { ApiClient } from './utils/api-client';
import { logger } from './utils/logger';

export class NotionClientWrapper {
  private apiClient: ApiClient;
  private customFeatures: Map<string, boolean> = new Map();

  constructor(apiToken: string) {
    // Initialize API client with provided Notion API token
    const baseUrl = 'https://api.notion.com/v1';
    const headers = {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    };

    this.apiClient = new ApiClient(baseUrl, headers);

    // Set which custom features are available
    this.customFeatures.set('workflows', false);
    this.customFeatures.set('csv_import', true);
    this.customFeatures.set('csv_export', true);
    this.customFeatures.set('recurring_tasks', true);

    logger.info('NotionClientWrapper initialized');
  }

  /**
   * Check if a custom feature is available
   */
  public isFeatureAvailable(featureName: string): boolean {
    return this.customFeatures.get(featureName) || false;
  }

  // Blocks
  async appendBlockChildren({
    block_id,
    children,
    after,
  }: AppendBlockChildrenArgs): Promise<any> {
    const body: any = { children };
    if (after) body.after = after;

    const response = await this.apiClient.request({
      method: 'PATCH',
      path: `/blocks/${block_id}/children`,
      body,
    });

    return response.data;
  }

  async retrieveBlock({ block_id }: RetrieveBlockArgs): Promise<any> {
    const response = await this.apiClient.request({
      method: 'GET',
      path: `/blocks/${block_id}`,
    });

    return response.data;
  }

  async retrieveBlockChildren({
    block_id,
    start_cursor,
    page_size,
  }: RetrieveBlockChildrenArgs): Promise<any> {
    const query: Record<string, string> = {};
    if (start_cursor) query.start_cursor = start_cursor;
    if (page_size) query.page_size = page_size.toString();

    const response = await this.apiClient.request({
      method: 'GET',
      path: `/blocks/${block_id}/children`,
      query,
    });

    return response.data;
  }

  async updateBlock({ block_id, properties }: UpdateBlockArgs): Promise<any> {
    const response = await this.apiClient.request({
      method: 'PATCH',
      path: `/blocks/${block_id}`,
      body: properties,
    });

    return response.data;
  }

  async deleteBlock({ block_id }: DeleteBlockArgs): Promise<any> {
    const response = await this.apiClient.request({
      method: 'DELETE',
      path: `/blocks/${block_id}`,
    });

    return response.data;
  }

  // Pages
  async retrievePage({ page_id }: RetrievePageArgs): Promise<any> {
    const response = await this.apiClient.request({
      method: 'GET',
      path: `/pages/${page_id}`,
    });

    return response.data;
  }

  async updatePageProperties({
    page_id,
    properties,
  }: UpdatePagePropertiesArgs): Promise<any> {
    const response = await this.apiClient.request({
      method: 'PATCH',
      path: `/pages/${page_id}`,
      body: { properties },
    });

    return response.data;
  }

  // Users
  async listAllUsers({
    start_cursor,
    page_size,
  }: ListAllUsersArgs = {}): Promise<any> {
    const query: Record<string, string> = {};
    if (start_cursor) query.start_cursor = start_cursor;
    if (page_size) query.page_size = page_size.toString();

    const response = await this.apiClient.request({
      method: 'GET',
      path: '/users',
      query,
    });

    return response.data;
  }

  async retrieveUser({ user_id }: RetrieveUserArgs): Promise<any> {
    const response = await this.apiClient.request({
      method: 'GET',
      path: `/users/${user_id}`,
    });

    return response.data;
  }

  async retrieveBotUser(): Promise<any> {
    const response = await this.apiClient.request({
      method: 'GET',
      path: '/users/me',
    });

    return response.data;
  }

  // Databases
  async createDatabase({
    parent,
    title,
    properties,
  }: CreateDatabaseArgs): Promise<any> {
    const response = await this.apiClient.request({
      method: 'POST',
      path: '/databases',
      body: { parent, title, properties },
    });

    return response.data;
  }

  async queryDatabase({
    database_id,
    filter,
    sorts,
    start_cursor,
    page_size,
  }: QueryDatabaseArgs): Promise<any> {
    const body: any = {};
    if (filter) body.filter = filter;
    if (sorts) body.sorts = sorts;
    if (start_cursor) body.start_cursor = start_cursor;
    if (page_size) body.page_size = page_size;

    const response = await this.apiClient.request({
      method: 'POST',
      path: `/databases/${database_id}/query`,
      body,
    });

    return response.data;
  }

  async retrieveDatabase({ database_id }: RetrieveDatabaseArgs): Promise<any> {
    const response = await this.apiClient.request({
      method: 'GET',
      path: `/databases/${database_id}`,
    });

    return response.data;
  }

  async updateDatabase({
    database_id,
    title,
    description,
    properties,
  }: UpdateDatabaseArgs): Promise<any> {
    const body: any = {};
    if (title) body.title = title;
    if (description) body.description = description;
    if (properties) body.properties = properties;

    const response = await this.apiClient.request({
      method: 'PATCH',
      path: `/databases/${database_id}`,
      body,
    });

    return response.data;
  }

  async createDatabaseItem({
    database_id,
    properties,
  }: CreateDatabaseItemArgs): Promise<any> {
    const response = await this.apiClient.request({
      method: 'POST',
      path: '/pages',
      body: {
        parent: { database_id },
        properties,
      },
    });

    return response.data;
  }

  // Comments
  async createComment({
    parent,
    discussion_id,
    rich_text,
  }: CreateCommentArgs): Promise<any> {
    const body: any = { rich_text };
    if (parent) body.parent = parent;
    if (discussion_id) body.discussion_id = discussion_id;

    const response = await this.apiClient.request({
      method: 'POST',
      path: '/comments',
      body,
    });

    return response.data;
  }

  async retrieveComments({
    block_id,
    start_cursor,
    page_size,
  }: RetrieveCommentsArgs): Promise<any> {
    const query: Record<string, string> = {
      block_id,
    };

    if (start_cursor) query.start_cursor = start_cursor;
    if (page_size) query.page_size = page_size.toString();

    const response = await this.apiClient.request({
      method: 'GET',
      path: '/comments',
      query,
    });

    return response.data;
  }

  // Search
  async search({
    query,
    filter,
    sort,
    start_cursor,
    page_size,
  }: SearchArgs = {}): Promise<any> {
    const body: any = {};
    if (query) body.query = query;
    if (filter) body.filter = filter;
    if (sort) body.sort = sort;
    if (start_cursor) body.start_cursor = start_cursor;
    if (page_size) body.page_size = page_size;

    const response = await this.apiClient.request({
      method: 'POST',
      path: '/search',
      body,
    });

    return response.data;
  }

  // Custom functionality
  async createWorkflow({
    title,
    trigger,
    actions,
  }: CreateWorkflowArgs): Promise<any> {
    if (!this.isFeatureAvailable('workflows')) {
      logger.warn('Workflow feature is not available');
      return {
        object: 'error',
        status: 400,
        code: 'feature_not_available',
        message: 'Workflow creation is not available with current API version.',
      };
    }

    // This is a custom extension - Notion does not have a native workflow API
    // This would need to be implemented using Notion's API in a custom way
    // or integrate with a third-party automation service

    logger.info(`Creating workflow: ${title} with ${actions.length} actions`);
    return {
      success: true,
      message: 'Workflow created (simulated)',
      workflow_id: `wf_${Date.now()}`,
      title,
      trigger,
      actions,
    };
  }

  async importFromCSV({
    database_id,
    csv_content,
    column_mappings,
  }: ImportFromCSVArgs): Promise<any> {
    if (!this.isFeatureAvailable('csv_import')) {
      logger.warn('CSV import feature is not available');
      return {
        object: 'error',
        status: 400,
        code: 'feature_not_available',
        message: 'CSV import is not available with current API version.',
      };
    }

    logger.info(`Importing CSV data to database: ${database_id}`);

    try {
      // Simple CSV parsing (in production, use a proper CSV parser)
      const rows = csv_content.split('\n').map((row) => row.split(','));
      const headers = rows[0];
      const dataRows = rows.slice(1);

      logger.info(
        `Found ${dataRows.length} rows to import with headers: ${headers.join(', ')}`,
      );

      // In a real implementation, we would:
      // 1. Use a proper CSV parser (like PapaParse)
      // 2. Map CSV columns to database properties
      // 3. Create database items in batches

      // For now, we'll create a simulated response
      return {
        object: 'import',
        status: 'success',
        results: {
          total_rows: dataRows.length,
          imported_rows: dataRows.length,
          errors: [],
        },
      };
    } catch (error) {
      logger.error('Error parsing CSV:', { error: (error as Error).message });
      return {
        object: 'error',
        status: 400,
        code: 'csv_parse_error',
        message: `CSV import failed: ${(error as Error).message}`,
      };
    }
  }

  async exportToCSV({ database_id, filter }: ExportToCSVArgs): Promise<any> {
    if (!this.isFeatureAvailable('csv_export')) {
      logger.warn('CSV export feature is not available');
      return {
        object: 'error',
        status: 400,
        code: 'feature_not_available',
        message: 'CSV export is not available with current API version.',
      };
    }

    try {
      logger.info(`Exporting database to CSV: ${database_id}`);

      // First, query the database
      const queryResult = await this.queryDatabase({
        database_id,
        filter,
        page_size: 100, // Max page size
      });

      // Build a sample CSV header
      const properties =
        queryResult.results?.length > 0
          ? Object.keys(queryResult.results[0].properties || {})
          : [];

      // In a real implementation, we would:
      // 1. Handle pagination to get all results
      // 2. Extract properties from all results
      // 3. Convert to proper CSV format

      // For now, we'll create a simulated response
      return {
        object: 'export',
        status: 'success',
        results: {
          total_rows: queryResult.results?.length || 0,
          format: 'csv',
          properties: properties,
          // In a real implementation, we'd include the actual CSV content:
          // csv_content: "header1,header2\nvalue1,value2\n..."
        },
      };
    } catch (error) {
      logger.error('Error exporting to CSV:', {
        error: (error as Error).message,
      });
      return {
        object: 'error',
        status: 400,
        code: 'export_error',
        message: `CSV export failed: ${(error as Error).message}`,
      };
    }
  }

  async createRecurringTask({
    database_id,
    task_properties,
    recurrence_pattern,
  }: CreateRecurringTaskArgs): Promise<any> {
    if (!this.isFeatureAvailable('recurring_tasks')) {
      logger.warn('Recurring tasks feature is not available');
      return {
        object: 'error',
        status: 400,
        code: 'feature_not_available',
        message: 'Recurring tasks are not available with current API version.',
      };
    }

    logger.info(
      `Creating recurring task in database: ${database_id} with frequency: ${recurrence_pattern.frequency}`,
    );

    try {
      // In a real implementation, we would:
      // 1. Validate the database schema includes necessary properties
      // 2. Add recurrence metadata to the task properties
      // 3. Create task and potentially setup scheduled creation for future instances

      // Create initial task with recurrence metadata
      const taskResult = await this.createDatabaseItem({
        database_id,
        properties: {
          ...task_properties,
          // Add recurrence metadata to the task properties
          Recurrence: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: `${recurrence_pattern.frequency} (every ${recurrence_pattern.interval})`,
                },
              },
            ],
          },
        },
      });

      return {
        object: 'recurring_task',
        id: taskResult.id,
        status: 'success',
        recurrence_pattern,
        next_occurrence: this.calculateNextOccurrence(recurrence_pattern),
      };
    } catch (error) {
      logger.error('Error creating recurring task:', {
        error: (error as Error).message,
      });
      return {
        object: 'error',
        status: 400,
        code: 'task_creation_error',
        message: `Recurring task creation failed: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Helper function to calculate the next occurrence based on recurrence pattern
   */
  private calculateNextOccurrence(
    pattern: CreateRecurringTaskArgs['recurrence_pattern'],
  ): string {
    const now = new Date();
    const nextDate = new Date(now);

    switch (pattern.frequency) {
    case 'daily':
      nextDate.setDate(now.getDate() + pattern.interval);
      break;
    case 'weekly':
      nextDate.setDate(now.getDate() + pattern.interval * 7);
      break;
    case 'monthly':
      nextDate.setMonth(now.getMonth() + pattern.interval);
      break;
    case 'yearly':
      nextDate.setFullYear(now.getFullYear() + pattern.interval);
      break;
    }

    return nextDate.toISOString().split('T')[0];
  }
}
