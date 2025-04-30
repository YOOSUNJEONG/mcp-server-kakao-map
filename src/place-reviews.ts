import { z } from 'zod';
import axios from 'axios';

export const PlaceReviewSchema = z.object({
  query: z.string(),
});

export async function placeReviews({ query }: { query: string }) {
  const KAKAO_API_KEY = process.env.KAKAO_API_KEY;
  if (!KAKAO_API_KEY) throw new Error("KAKAO_API_KEY not set");

  // 1. 장소 검색 (카카오맵 검색)
  const searchRes = await axios.get("https://dapi.kakao.com/v2/local/search/keyword.json", {
    headers: {
      Authorization: `KakaoAK ${KAKAO_API_KEY}`,
    },
    params: {
      query,
    },
  });

  const placeName = searchRes.data.documents?.[0]?.place_name;
  if (!placeName) return { reviews: [] };

  // 2. 웹 리뷰 (Daum Web)
  const reviewRes = await axios.get("https://dapi.kakao.com/v2/search/web", {
    headers: {
      Authorization: `KakaoAK ${KAKAO_API_KEY}`,
    },
    params: {
      query: placeName,
      page: 1,
      size: 10,
    },
  });

  const reviews = reviewRes.data.documents.map((doc: any) => doc.contents);

  return {
    reviews,
  };
}
