import { useTagStore } from '@/store/useTagStore';

export interface UseTagSectionProps {
  tags: string[];
  maxRows?: number;
  maxTagsPerRow?: number;
}

export const useTagSection = ({
  tags,
  maxRows = 3,
  maxTagsPerRow = 6,
}: UseTagSectionProps) => {
  const { selectedTags, setSelectedTag } = useTagStore();

  // 태그 사용 빈도 계산
  const getTagFrequency = (tag: string) => {
    return tags.filter((t) => t === tag).length;
  };

  // 자주 사용되는 태그 필터링 및 행 제한 적용
  const getPopularTags = () => {
    // 최대 표시 가능한 태그 수 계산
    const maxTotalTags = maxRows * maxTagsPerRow;

    // 중복 제거 및 빈도수 계산
    const uniqueTagsWithFrequency = Array.from(new Set(tags))
      .map((tag) => ({
        tag,
        frequency: getTagFrequency(tag),
      }))
      .sort((a, b) => {
        // 1. 빈도수로 정렬
        const freqDiff = b.frequency - a.frequency;
        if (freqDiff !== 0) return freqDiff;

        // 2. 빈도수가 같으면 글자 수가 짧은 순
        return a.tag.length - b.tag.length;
      });

    // "기타" 태그를 제외한 나머지 태그들
    const otherTags = uniqueTagsWithFrequency
      .filter((item) => item.tag !== '기타')
      .slice(0, maxTotalTags - 1) // "기타" 태그를 위한 공간 확보
      .map((item) => item.tag);

    // "기타" 태그가 있으면 마지막에 추가
    const hasOtherTag = tags.includes('기타');
    if (hasOtherTag) {
      otherTags.push('기타');
    }

    return otherTags;
  };

  const popularTags = getPopularTags();

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
  };

  // 각 행에 들어갈 태그 수 계산
  const getTagsPerRow = () => {
    const rows = [];
    for (let i = 0; i < maxRows; i++) {
      const startIndex = i * maxTagsPerRow;
      const endIndex = startIndex + maxTagsPerRow;
      const rowTags = popularTags.slice(startIndex, endIndex);
      if (rowTags.length > 0) {
        rows.push(rowTags);
      }
    }
    return rows;
  };

  return {
    selectedTags,
    popularTags,
    handleTagClick,
    maxRows,
    tagRows: getTagsPerRow(), // 행별로 구분된 태그 배열 반환
  };
};
