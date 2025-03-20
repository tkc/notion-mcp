import { Tool } from '@modelcontextprotocol/sdk/types.js';
import {
  blockObjectSchema,
  commonIdDescription,
  richTextObjectSchema,
} from './schemas';

// Tool definitions
// Blocks
export const appendBlockChildrenTool: Tool = {
  name: 'notion_append_block_children',
  description:
    "Append new children blocks to a specified parent block in Notion. Requires insert content capabilities. You can optionally specify the 'after' parameter to append after a certain block.",
  inputSchema: {
    type: 'object',
    properties: {
      block_id: {
        type: 'string',
        description: 'The ID of the parent block.' + commonIdDescription,
      },
      children: {
        type: 'array',
        description:
          'Array of block objects to append. Each block must follow the Notion block schema.',
        items: blockObjectSchema,
      },
      after: {
        type: 'string',
        description:
          'The ID of the existing block that the new block should be appended after.' +
          commonIdDescription,
      },
    },
    required: ['block_id', 'children'],
  },
};

export const retrieveBlockTool: Tool = {
  name: 'notion_retrieve_block',
  description: 'Retrieve a block from Notion',
  inputSchema: {
    type: 'object',
    properties: {
      block_id: {
        type: 'string',
        description: 'The ID of the block to retrieve.' + commonIdDescription,
      },
    },
    required: ['block_id'],
  },
};

export const retrieveBlockChildrenTool: Tool = {
  name: 'notion_retrieve_block_children',
  description: 'Retrieve the children of a block',
  inputSchema: {
    type: 'object',
    properties: {
      block_id: {
        type: 'string',
        description: 'The ID of the block.' + commonIdDescription,
      },
      start_cursor: {
        type: 'string',
        description: 'Pagination cursor for next page of results',
      },
      page_size: {
        type: 'number',
        description: 'Number of results per page (max 100)',
      },
    },
    required: ['block_id'],
  },
};

export const updateBlockTool: Tool = {
  name: 'notion_update_block',
  description: 'Update an existing block in Notion',
  inputSchema: {
    type: 'object',
    properties: {
      block_id: {
        type: 'string',
        description: 'The ID of the block to update.' + commonIdDescription,
      },
      properties: {
        type: 'object',
        description: 'Properties to update on the block.',
      },
    },
    required: ['block_id', 'properties'],
  },
};

export const deleteBlockTool: Tool = {
  name: 'notion_delete_block',
  description: 'Delete a block in Notion',
  inputSchema: {
    type: 'object',
    properties: {
      block_id: {
        type: 'string',
        description: 'The ID of the block to delete.' + commonIdDescription,
      },
    },
    required: ['block_id'],
  },
};

// Pages
export const retrievePageTool: Tool = {
  name: 'notion_retrieve_page',
  description: 'Retrieve a page from Notion',
  inputSchema: {
    type: 'object',
    properties: {
      page_id: {
        type: 'string',
        description: 'The ID of the page to retrieve.' + commonIdDescription,
      },
    },
    required: ['page_id'],
  },
};

export const updatePagePropertiesTool: Tool = {
  name: 'notion_update_page_properties',
  description: 'Update properties of a page or an item in a Notion database',
  inputSchema: {
    type: 'object',
    properties: {
      page_id: {
        type: 'string',
        description:
          'The ID of the page or database item to update.' +
          commonIdDescription,
      },
      properties: {
        type: 'object',
        description:
          'Properties to update. These correspond to the columns or fields in the database.',
      },
    },
    required: ['page_id', 'properties'],
  },
};

// Users
export const listAllUsersTool: Tool = {
  name: 'notion_list_all_users',
  description:
    'List all users in the Notion workspace. **Note:** This function requires upgrading to the Notion Enterprise plan and using an Organization API key to avoid permission errors.',
  inputSchema: {
    type: 'object',
    properties: {
      start_cursor: {
        type: 'string',
        description: 'Pagination start cursor for listing users',
      },
      page_size: {
        type: 'number',
        description: 'Number of users to retrieve (max 100)',
      },
    },
  },
};

export const retrieveUserTool: Tool = {
  name: 'notion_retrieve_user',
  description:
    'Retrieve a specific user by user_id in Notion. **Note:** This function requires upgrading to the Notion Enterprise plan and using an Organization API key to avoid permission errors.',
  inputSchema: {
    type: 'object',
    properties: {
      user_id: {
        type: 'string',
        description: 'The ID of the user to retrieve.' + commonIdDescription,
      },
    },
    required: ['user_id'],
  },
};

export const retrieveBotUserTool: Tool = {
  name: 'notion_retrieve_bot_user',
  description:
    'Retrieve the bot user associated with the current token in Notion',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

// Databases
export const createDatabaseTool: Tool = {
  name: 'notion_create_database',
  description: 'Create a database in Notion',
  inputSchema: {
    type: 'object',
    properties: {
      parent: {
        type: 'object',
        description: 'Parent object of the database',
      },
      title: {
        type: 'array',
        description:
          'Title of database as it appears in Notion. An array of rich text objects.',
        items: richTextObjectSchema,
      },
      properties: {
        type: 'object',
        description:
          'Property schema of database. The keys are the names of properties as they appear in Notion and the values are property schema objects.',
      },
    },
    required: ['parent', 'properties'],
  },
};

export const queryDatabaseTool: Tool = {
  name: 'notion_query_database',
  description: 'Query a database in Notion',
  inputSchema: {
    type: 'object',
    properties: {
      database_id: {
        type: 'string',
        description: 'The ID of the database to query.' + commonIdDescription,
      },
      filter: {
        type: 'object',
        description: 'Filter conditions',
      },
      sorts: {
        type: 'array',
        description: 'Sort conditions',
      },
      start_cursor: {
        type: 'string',
        description: 'Pagination cursor for next page of results',
      },
      page_size: {
        type: 'number',
        description: 'Number of results per page (max 100)',
      },
    },
    required: ['database_id'],
  },
};

export const retrieveDatabaseTool: Tool = {
  name: 'notion_retrieve_database',
  description: 'Retrieve a database in Notion',
  inputSchema: {
    type: 'object',
    properties: {
      database_id: {
        type: 'string',
        description:
          'The ID of the database to retrieve.' + commonIdDescription,
      },
    },
    required: ['database_id'],
  },
};

export const updateDatabaseTool: Tool = {
  name: 'notion_update_database',
  description: 'Update a database in Notion',
  inputSchema: {
    type: 'object',
    properties: {
      database_id: {
        type: 'string',
        description: 'The ID of the database to update.' + commonIdDescription,
      },
      title: {
        type: 'array',
        description:
          'An array of rich text objects that represents the title of the database that is displayed in the Notion UI.',
        items: richTextObjectSchema,
      },
      description: {
        type: 'array',
        description:
          'An array of rich text objects that represents the description of the database that is displayed in the Notion UI.',
      },
      properties: {
        type: 'object',
        description:
          'The properties of a database to be changed in the request, in the form of a JSON object.',
      },
    },
    required: ['database_id'],
  },
};

export const createDatabaseItemTool: Tool = {
  name: 'notion_create_database_item',
  description: 'Create a new item (page) in a Notion database',
  inputSchema: {
    type: 'object',
    properties: {
      database_id: {
        type: 'string',
        description:
          'The ID of the database to add the item to.' + commonIdDescription,
      },
      properties: {
        type: 'object',
        description:
          'Properties of the new database item. These should match the database schema.',
      },
    },
    required: ['database_id', 'properties'],
  },
};

// Comments
export const createCommentTool: Tool = {
  name: 'notion_create_comment',
  description:
    "Create a comment in Notion. This requires the integration to have 'insert comment' capabilities. You can either specify a page parent or a discussion_id, but not both.",
  inputSchema: {
    type: 'object',
    properties: {
      parent: {
        type: 'object',
        description:
          'Parent object that specifies the page to comment on. Must include a page_id if used.',
        properties: {
          page_id: {
            type: 'string',
            description:
              'The ID of the page to comment on.' + commonIdDescription,
          },
        },
      },
      discussion_id: {
        type: 'string',
        description:
          'The ID of an existing discussion thread to add a comment to.' +
          commonIdDescription,
      },
      rich_text: {
        type: 'array',
        description:
          'Array of rich text objects representing the comment content.',
        items: richTextObjectSchema,
      },
    },
    required: ['rich_text'],
  },
};

export const retrieveCommentsTool: Tool = {
  name: 'notion_retrieve_comments',
  description:
    "Retrieve a list of unresolved comments from a Notion page or block. Requires the integration to have 'read comment' capabilities.",
  inputSchema: {
    type: 'object',
    properties: {
      block_id: {
        type: 'string',
        description:
          'The ID of the block or page whose comments you want to retrieve.' +
          commonIdDescription,
      },
      start_cursor: {
        type: 'string',
        description:
          'If supplied, returns a page of results starting after the cursor.',
      },
      page_size: {
        type: 'number',
        description: 'Number of comments to retrieve (max 100).',
      },
    },
    required: ['block_id'],
  },
};

// Search
export const searchTool: Tool = {
  name: 'notion_search',
  description: 'Search pages or databases by title in Notion',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Text to search for in page or database titles',
      },
      filter: {
        type: 'object',
        description: 'Filter results by object type (page or database)',
        properties: {
          property: {
            type: 'string',
            description: "Must be 'object'",
          },
          value: {
            type: 'string',
            description: "Either 'page' or 'database'",
          },
        },
      },
      sort: {
        type: 'object',
        description: 'Sort order of results',
        properties: {
          direction: {
            type: 'string',
            enum: ['ascending', 'descending'],
          },
          timestamp: {
            type: 'string',
            enum: ['last_edited_time'],
          },
        },
      },
      start_cursor: {
        type: 'string',
        description: 'Pagination start cursor',
      },
      page_size: {
        type: 'number',
        description: 'Number of results to return (max 100)',
      },
    },
  },
};

// Custom tools
export const createWorkflowTool: Tool = {
  name: 'notion_create_workflow',
  description: 'Create an automated workflow in Notion',
  inputSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Title of the workflow',
      },
      trigger: {
        type: 'object',
        description: 'Event that triggers the workflow',
        properties: {
          type: {
            type: 'string',
            description: 'Type of trigger',
            enum: ['property_changed', 'item_created', 'date_reached'],
          },
          condition: {
            type: 'object',
            description: 'Conditions for the trigger',
          },
        },
        required: ['type'],
      },
      actions: {
        type: 'array',
        description: 'Actions to perform when the workflow is triggered',
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              description: 'Type of action',
              enum: ['update_property', 'create_item', 'send_notification'],
            },
            parameters: {
              type: 'object',
              description: 'Parameters for the action',
            },
          },
          required: ['type', 'parameters'],
        },
      },
    },
    required: ['title', 'trigger', 'actions'],
  },
};

export const importFromCSVTool: Tool = {
  name: 'notion_import_from_csv',
  description: 'Import data from CSV into a Notion database',
  inputSchema: {
    type: 'object',
    properties: {
      database_id: {
        type: 'string',
        description: 'ID of the database to import into' + commonIdDescription,
      },
      csv_content: {
        type: 'string',
        description: 'Content of the CSV file to import',
      },
      column_mappings: {
        type: 'object',
        description: 'Mapping of CSV columns to database properties',
      },
    },
    required: ['database_id', 'csv_content'],
  },
};

export const exportToCSVTool: Tool = {
  name: 'notion_export_to_csv',
  description: 'Export a Notion database to CSV format',
  inputSchema: {
    type: 'object',
    properties: {
      database_id: {
        type: 'string',
        description: 'ID of the database to export' + commonIdDescription,
      },
      filter: {
        type: 'object',
        description: 'Filter to apply before exporting',
      },
    },
    required: ['database_id'],
  },
};

export const createRecurringTaskTool: Tool = {
  name: 'notion_create_recurring_task',
  description: 'Create a recurring task in a Notion database',
  inputSchema: {
    type: 'object',
    properties: {
      database_id: {
        type: 'string',
        description: 'ID of the task database' + commonIdDescription,
      },
      task_properties: {
        type: 'object',
        description: 'Properties for the task',
      },
      recurrence_pattern: {
        type: 'object',
        description: 'Pattern for task recurrence',
        properties: {
          frequency: {
            type: 'string',
            description: 'How often the task repeats',
            enum: ['daily', 'weekly', 'monthly', 'yearly'],
          },
          interval: {
            type: 'number',
            description: 'Interval between occurrences',
          },
          end_date: {
            type: 'string',
            description: 'Date when recurrence should end (ISO format)',
          },
          days_of_week: {
            type: 'array',
            description: 'Days of week for weekly recurrence',
            items: {
              type: 'string',
              enum: [
                'monday',
                'tuesday',
                'wednesday',
                'thursday',
                'friday',
                'saturday',
                'sunday',
              ],
            },
          },
        },
        required: ['frequency', 'interval'],
      },
    },
    required: ['database_id', 'task_properties', 'recurrence_pattern'],
  },
};

// All tools array for export
export const allNotionTools = [
  appendBlockChildrenTool,
  retrieveBlockTool,
  retrieveBlockChildrenTool,
  updateBlockTool,
  deleteBlockTool,
  retrievePageTool,
  updatePagePropertiesTool,
  listAllUsersTool,
  retrieveUserTool,
  retrieveBotUserTool,
  createDatabaseTool,
  queryDatabaseTool,
  retrieveDatabaseTool,
  updateDatabaseTool,
  createDatabaseItemTool,
  createCommentTool,
  retrieveCommentsTool,
  searchTool,
  createWorkflowTool,
  importFromCSVTool,
  exportToCSVTool,
  createRecurringTaskTool,
];
