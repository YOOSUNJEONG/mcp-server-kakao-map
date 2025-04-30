#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import dotenv from 'dotenv';

import { search, SearchSchema } from './search.js';
import { placeReviews, PlaceReviewSchema } from './place-reviews.js';

dotenv.config();

const server = new McpServer({
  name: 'mcp-server-kakao-map',
  version: '0.0.1',
});

server.tool('search', 'Search Kakao places', SearchSchema, search);
server.tool('place-reviews', 'Summarize place reviews', PlaceReviewSchema, placeReviews);

const transport = new StdioServerTransport();
await server.connect(transport);
