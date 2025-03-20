import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { NotionClientWrapper } from './client';
import { allNotionTools } from './tools';
import * as Types from './types';
import { logger } from './utils/logger';

/**
 * Main function to start the Notion MCP Server
 */
export async function startNotionServer(apiToken: string) {
  logger.info('Starting Notion MCP Server...');

  // Check if API token is provided
  if (!apiToken) {
    logger.error('Notion API token not provided');
    throw new Error('Notion API token is required');
  }

  // Create server instance
  const server = new Server(
    {
      name: 'Notion MCP Server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  // Initialize Notion client with provided API token
  const notionClient = new NotionClientWrapper(apiToken);

  // Set up tool request handler
  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest) => {
      logger.debug('Received CallToolRequest', {
        requestId: request.id,
        tool: request.params.name,
      });

      try {
        if (!request.params.arguments) {
          throw new Error('No arguments provided');
        }

        // Handle different tool requests
        switch (request.params.name) {
        // Block operations
        case 'notion_append_block_children': {
          const args = request.params
            .arguments as unknown as Types.AppendBlockChildrenArgs;
          const response = await notionClient.appendBlockChildren(args);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        case 'notion_retrieve_block': {
          const args = request.params
            .arguments as unknown as Types.RetrieveBlockArgs;
          const response = await notionClient.retrieveBlock(args);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        case 'notion_retrieve_block_children': {
          const args = request.params
            .arguments as unknown as Types.RetrieveBlockChildrenArgs;
          const response = await notionClient.retrieveBlockChildren(args);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        case 'notion_update_block': {
          const args = request.params
            .arguments as unknown as Types.UpdateBlockArgs;
          const response = await notionClient.updateBlock(args);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        case 'notion_delete_block': {
          const args = request.params
            .arguments as unknown as Types.DeleteBlockArgs;
          const response = await notionClient.deleteBlock(args);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        // Page operations
        case 'notion_retrieve_page': {
          const args = request.params
            .arguments as unknown as Types.RetrievePageArgs;
          const response = await notionClient.retrievePage(args);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        case 'notion_update_page_properties': {
          const args = request.params
            .arguments as unknown as Types.UpdatePagePropertiesArgs;
          const response = await notionClient.updatePageProperties(args);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        // User operations
        case 'notion_list_all_users': {
          const args = request.params
            .arguments as unknown as Types.ListAllUsersArgs;
          const response = await notionClient.listAllUsers(args);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        case 'notion_retrieve_user': {
          const args = request.params
            .arguments as unknown as Types.RetrieveUserArgs;
          const response = await notionClient.retrieveUser(args);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        case 'notion_retrieve_bot_user': {
          const response = await notionClient.retrieveBotUser();
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        // Database operations
        case 'notion_create_database': {
          const args = request.params
            .arguments as unknown as Types.CreateDatabaseArgs;
          const response = await notionClient.createDatabase(args);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        case 'notion_query_database': {
          const args = request.params
            .arguments as unknown as Types.QueryDatabaseArgs;
          const response = await notionClient.queryDatabase(args);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        case 'notion_retrieve_database': {
          const args = request.params
            .arguments as unknown as Types.RetrieveDatabaseArgs;
          const response = await notionClient.retrieveDatabase(args);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        case 'notion_update_database': {
          const args = request.params
            .arguments as unknown as Types.UpdateDatabaseArgs;
          const response = await notionClient.updateDatabase(args);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        case 'notion_create_database_item': {
          const args = request.params
            .arguments as unknown as Types.CreateDatabaseItemArgs;
          const response = await notionClient.createDatabaseItem(args);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        // Comment operations
        case 'notion_create_comment': {
          const args = request.params
            .arguments as unknown as Types.CreateCommentArgs;
          const response = await notionClient.createComment(args);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        case 'notion_retrieve_comments': {
          const args = request.params
            .arguments as unknown as Types.RetrieveCommentsArgs;
          const response = await notionClient.retrieveComments(args);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        // Search
        case 'notion_search': {
          const args = request.params
            .arguments as unknown as Types.SearchArgs;
          const response = await notionClient.search(args);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        // Custom operations
        case 'notion_create_workflow': {
          const args = request.params
            .arguments as unknown as Types.CreateWorkflowArgs;
          const response = await notionClient.createWorkflow(args);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        case 'notion_import_from_csv': {
          const args = request.params
            .arguments as unknown as Types.ImportFromCSVArgs;
          const response = await notionClient.importFromCSV(args);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        case 'notion_export_to_csv': {
          const args = request.params
            .arguments as unknown as Types.ExportToCSVArgs;
          const response = await notionClient.exportToCSV(args);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        case 'notion_create_recurring_task': {
          const args = request.params
            .arguments as unknown as Types.CreateRecurringTaskArgs;
          const response = await notionClient.createRecurringTask(args);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        default:
          logger.warn(`Unknown tool requested: ${request.params.name}`);
          throw new Error(`Unknown tool: ${request.params.name}`);
        }
      } catch (error) {
        logger.error('Error executing tool', {
          tool: request.params.name,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
        };
      }
    },
  );

  // Set up tools listing handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    logger.debug('Received ListToolsRequest');
    return {
      tools: allNotionTools,
    };
  });

  // Connect server using stdio transport
  const transport = new StdioServerTransport();

  try {
    await server.connect(transport);
    logger.info('Notion MCP Server started successfully');
  } catch (error) {
    logger.error('Failed to start server', {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
