#!/usr/bin/env node
/**
 * Notion MCP Server main entry point
 * This allows interacting with Notion API through the Model Context Protocol
 */

import { startNotionServer } from './server';
import { logger } from './utils/logger';

// Display startup banner
function displayBanner() {
  const banner = `
╔═══════════════════════════════════════════════╗
║                                               ║
║          Notion MCP Server v1.0.0             ║
║                                               ║
╚═══════════════════════════════════════════════╝
  `;
  console.log(banner);

  logger.info('Starting Notion MCP Server');
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', {
    reason: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? reason.stack : undefined,
  });
  process.exit(1);
});

// Start the server
async function main() {
  displayBanner();

  // Get API token from command line argument
  const apiToken = process.argv[2];

  if (!apiToken) {
    logger.error(
      'Notion API token is required. Please provide it as a command line argument.',
    );
    console.error('Usage: node index.js <your_notion_api_token>');
    process.exit(1);
  }

  try {
    await startNotionServer(apiToken);
  } catch (error) {
    logger.error('Fatal error in main()', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  }
}

// Handle termination signals
process.on('SIGINT', () => {
  logger.info('Received SIGINT signal');
  logger.info('Shutting down Notion MCP Server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM signal');
  logger.info('Shutting down Notion MCP Server...');
  process.exit(0);
});

// Run the main function
main();
