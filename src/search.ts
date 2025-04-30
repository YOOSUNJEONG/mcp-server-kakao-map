import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import got from 'got';

export const SearchSchema = {
  query: z.string().describe('Korean location search keyword like "강남 맛집"')
};

export const search: ToolCallback<typeof SearchSchema> = async ({ query }) => {
  const KAKAO_API_KEY = process.env.KAKAO_API_KEY;
  if (!KAKAO_API_KEY) {
    return {
      isError: true,
      content: [{ type: 'text', text: 'KAKAO_API_KEY가 환경변수에 없습니다.' }]
    };
  }

  const response = await got.get('https://dapi.kakao.com/v2/local/search/keyword.json', {
    headers: {
      Authorization: `KakaoAK ${KAKAO_API_KEY}`
    },
    searchParams: { query },
    responseType: 'json'
  });

  const results = (response.body as any).documents.map((item: any) => ({
    name: item.place_name,
    address: item.address_name,
    category: item.category_name,
    phone: item.phone,
    url: item.place_url
  }));

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(results, null, 2)
      }
    ]
  };
};
