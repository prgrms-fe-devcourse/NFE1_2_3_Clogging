import { useState, useCallback } from 'react';

interface UseMarkdownReturn {
  text: string;
  setText: (value: string) => void;
  handleH1Click: () => void;
  handleH2Click: () => void;
  handleH3Click: () => void;
  handleH4Click: () => void;
  handleBoldClick: () => void;
  handleItalicClick: () => void;
  handleStrikeClick: () => void;
  handleListClick: () => void;
  handleQuoteClick: () => void;
  handleCodeBlockClick: () => void;
}

export const useMarkdown = (initialText: string = ''): UseMarkdownReturn => {
  const [text, setText] = useState(initialText);

  const wrapSelectedText = useCallback(
    (before: string, after: string = '') => {
      const textarea = document.querySelector('textarea');
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = text.substring(start, end);
      const beforeText = text.substring(0, start);
      const afterText = text.substring(end);

      const newText =
        start === end
          ? beforeText + before + after + afterText
          : beforeText + before + selectedText + after + afterText;

      setText(newText);

      setTimeout(() => {
        textarea.focus();
        if (start === end) {
          textarea.selectionStart = start + before.length;
          textarea.selectionEnd = start + before.length;
        } else {
          textarea.selectionStart = start + before.length;
          textarea.selectionEnd = end + before.length;
        }
      }, 0);
    },
    [text],
  );

  const addNewLine = useCallback(
    (prefix: string) => {
      const textarea = document.querySelector('textarea');
      if (!textarea) return;

      const start = textarea.selectionStart;
      const currentLine = text.substring(0, start).lastIndexOf('\n') + 1;
      const beforeText = text.substring(0, currentLine);
      const afterText = text.substring(currentLine);

      const newLinePrefix =
        currentLine === 0 || text.charAt(currentLine - 1) === '\n' ? '' : '\n';
      const newText = beforeText + newLinePrefix + prefix + afterText;

      setText(newText);

      const newCursorPosition =
        currentLine + newLinePrefix.length + prefix.length;
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = newCursorPosition;
        textarea.selectionEnd = newCursorPosition;
      }, 0);
    },
    [text],
  );

  const handleH1Click = useCallback(() => addNewLine('# '), [addNewLine]);
  const handleH2Click = useCallback(() => addNewLine('## '), [addNewLine]);
  const handleH3Click = useCallback(() => addNewLine('### '), [addNewLine]);
  const handleH4Click = useCallback(() => addNewLine('#### '), [addNewLine]);

  const handleBoldClick = useCallback(
    () => wrapSelectedText('**', '**'),
    [wrapSelectedText],
  );

  const handleItalicClick = useCallback(
    () => wrapSelectedText('*', '*'),
    [wrapSelectedText],
  );

  const handleStrikeClick = useCallback(
    () => wrapSelectedText('~~', '~~'),
    [wrapSelectedText],
  );

  const handleListClick = useCallback(() => addNewLine('- '), [addNewLine]);
  const handleQuoteClick = useCallback(() => addNewLine('> '), [addNewLine]);

  const handleCodeBlockClick = useCallback(() => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    wrapSelectedText('```\n', '\n```');
  }, [wrapSelectedText]);

  return {
    text,
    setText,
    handleH1Click,
    handleH2Click,
    handleH3Click,
    handleH4Click,
    handleBoldClick,
    handleItalicClick,
    handleStrikeClick,
    handleListClick,
    handleQuoteClick,
    handleCodeBlockClick,
  };
};
