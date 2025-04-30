// src/index.ts
#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { search, SearchSchema } from './search.js';
import { placeReviews, PlaceReviewSchema } from './place-reviews.js';
import dotenv from 'dotenv';

dotenv.config();

const server = new McpServer({
  name: 'mcp-server-kakao-map',
  version: '0.0.1',
});

server.tool(
  'search-kakao-places',
  'Searches places using Kakao Map API and returns structured summaries.',
  SearchSchema,
  search
);

server.tool(
  'place-reviews',
  'Summarizes reviews and estimates ratings for a given place name.',
  PlaceReviewSchema,
  placeReviews
);

const transport = new StdioServerTransport();

await server.connect(transport);
