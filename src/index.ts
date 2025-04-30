#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { placeReviews, PlaceReviewSchema } from './place-reviews.js';
import dotenv from 'dotenv';

dotenv.config();

const server = new McpServer({
  name: 'mcp-server-kakao-map',
  version: '0.0.1',
});

server.tool(
  'place-reviews',
  'Summarize user reviews of a Korean place into score, pros, and cons.',
  PlaceReviewSchema.shape, // 반드시 .shape 필요
  placeReviews
);

const transport = new StdioServerTransport();

// ✅ 이 줄 없으면 MCP 응답 안 함 (502 발생)
await server.connect(transport);
