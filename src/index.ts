import { z } from 'zod';
import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';

export const PlaceReviewSchema = z.object({
  query: z.string().describe('Place name (e.g. "폴트버거")'),
});

export const placeReviews: ToolCallback<typeof PlaceReviewSchema.shape> = async (input) => {
  const { query } = input;

  const reviews = await getMockedReviews(query);

  const prompt = `
다음은 음식점 이름입니다: "${query}"
이 가게에 대해 사용자가 남긴 리뷰는 다음과 같습니다:

${reviews.map((r, i) => `${i + 1}. ${r}`).join('\n')}

위 리뷰를 바탕으로 이 가게의 예상 평점 (1~5점)을 추정하고,
장점과 단점을 각각 5줄로 요약해 주세요.

결과는 다음 JSON 형식으로 반환하세요:
{
  "score": "예상 평점 (정수)",
  "pros": "- 장점1\\n- 장점2\\n- 장점3\\n- 장점4\\n- 장점5",
  "cons": "- 단점1\\n- 단점2\\n- 단점3\\n- 단점4\\n- 단점5"
}`;

  return {
    content: [{ type: 'text', text: prompt }],
  };
};

async function getMockedReviews(place: string): Promise<string[]> {
  return [
    '매장이 깨끗하고 직원이 친절해요.',
    '맛은 있는데 양이 적어요.',
    '사람이 많아서 기다렸어요.',
    '재방문 의사 있어요.',
    '가격 대비 만족도는 보통이에요.',
  ];
}
