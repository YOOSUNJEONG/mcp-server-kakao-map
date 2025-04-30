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
  'place-reviews', // 🟡 이 이름이 엔드포인트 이름이 됩니다.
  'Summarizes mock reviews and returns rating, pros and cons.',
  PlaceReviewSchema.shape, // ✅ 반드시 `.shape`로 전달해야 MCP에서 작동
  placeReviews
);

const transport = new StdioServerTransport();

// ✅ MCP Tool이 외부 요청을 받을 수 있게 연결
await server.connect(transport);
