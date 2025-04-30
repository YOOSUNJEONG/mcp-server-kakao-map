#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { search, SearchSchema } from './search.js';
import dotenv from 'dotenv';
import { placeReviews, PlaceReviewSchema } from './place-reviews.js';

dotenv.config();

const server = new McpServer({
  name: 'mcp-server-kakao-map',
  version: '0.0.1',
});

// 기존 검색 추천용 툴
server.tool(
  'place-recommender',
  'Recommends relevant places in South Korea based on user queries.',
  SearchSchema,
  search
);

// 🔧 새로 만든 리뷰 요약용 툴 등록
server.tool(
  'place-reviews',
  'Returns summary from KakaoMap-like reviews',
  PlaceReviewSchema.shape,  // 👈 반드시 `.shape` 붙이기
  placeReviews
);

const transport = new StdioServerTransport();
await server.connect(transport);
