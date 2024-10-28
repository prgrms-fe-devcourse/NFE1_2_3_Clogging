export const isCategoryNameValid = (name: string): boolean => {
  return name.trim().length > 0 && name.trim().length <= 20; // 최대 길이를 20자로 변경
};
export const isCategoryOrderValid = (order: number): boolean => {
  return Number.isInteger(order) && order >= 0;
};
