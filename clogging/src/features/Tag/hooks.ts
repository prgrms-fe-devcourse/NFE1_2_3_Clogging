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

  // 자주 사용되는 태그 필터링
  const getPopularTags = () => {
    const maxTags = maxRows * maxTagsPerRow - 1;
    const tagFrequency = tags
      .filter((tag, index, self) => self.indexOf(tag) === index)
      .map((tag) => ({
        tag,
        frequency: getTagFrequency(tag),
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, maxTags)
      .map((item) => item.tag);

    return tagFrequency;
  };

  const popularTags = getPopularTags();

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
  };

  return {
    selectedTags,
    popularTags,
    handleTagClick,
    maxRows,
  };
};
