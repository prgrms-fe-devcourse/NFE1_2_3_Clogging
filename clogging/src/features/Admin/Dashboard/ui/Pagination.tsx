// Pagination.jsx
import React from 'react';
import { Button } from '@/shared/ui/common/Button';

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-between mt-4">
    <Button
      variant="outline"
      size="sm"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className={`rounded-lg ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      이전
    </Button>

    <span>{`${currentPage} / ${totalPages}`}</span>

    <Button
      variant="outline"
      size="sm"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`rounded-lg ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      다음
    </Button>
  </div>
);

export default Pagination;
