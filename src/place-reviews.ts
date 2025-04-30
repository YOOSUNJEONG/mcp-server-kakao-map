import { z } from 'zod';
import axios from 'axios';
import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';

export const PlaceReviewSchema = z
  .object({
    query: z.string().describe('Place name (e.g. "폴트버거 판교점")'),
  })
  .strict(); // <- index signature 에러 방지

export const placeReviews: ToolCallback<typeof PlaceReviewSchema> = async ({ query }) => {
  try {
    // ✅ 1. 외부에서 리뷰 수집 (지금은 하드코딩 예시)
    const reviews = await getMockedReviews(query);

    // ✅ 2. GPT 요약 요청 프롬프트 구성
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
}
`;

    return {
      content: [
        { type: 'text', text: prompt },
      ],
    };
  } catch (err: any) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `리뷰 요약 중 오류 발생: ${err.message}`,
        },
      ],
    };
  }
};

// ✅ 테스트용 mock 리뷰 (이후 Kakao/Naver API로 대체 가능)
async function getMockedReviews(place: string): Promise<string[]> {
  return [
    '직원들이 친절하고 매장도 깔끔했어요.',
    '맛은 있었지만 가격이 다소 비쌌어요.',
    '점심시간에 대기줄이 길어서 아쉬웠어요.',
    '햄버거 패티가 두툼하고 식감이 좋았어요.',
    '사이드메뉴는 평범했지만 만족스러웠어요.',
  ];
}
