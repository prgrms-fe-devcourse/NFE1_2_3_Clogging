interface PrivateCommentProps {
  isPrivate: boolean;
  onChange: (value: boolean) => void;
}

export const PrivateComment = ({
  isPrivate,
  onChange,
}: PrivateCommentProps) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!isPrivate)}
      className={`
        flex items-center gap-2 px-2 py-1 rounded
        ${
          isPrivate
            ? 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100'
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
        }
        transition-colors duration-200
      `}
      title={isPrivate ? '비공개 댓글입니다' : '공개 댓글입니다'}
      aria-label={isPrivate ? '비공개 설정됨' : '공개 설정됨'}
      aria-pressed={isPrivate}
    >
      {isPrivate ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      )}
      <span className="text-sm font-medium">
        {isPrivate ? '비공개' : '공개'}
      </span>
    </button>
  );
};
