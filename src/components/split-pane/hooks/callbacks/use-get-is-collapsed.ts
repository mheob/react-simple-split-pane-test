import { useCallback } from 'react';

export const useGetIsPaneCollapsed = ({
  collapsedIndices,
}: {
  collapsedIndices: number[];
}): ((paneIndex: number) => boolean) =>
  useCallback(
    (paneIndex: number) =>
      collapsedIndices.length > 0 ? collapsedIndices.includes(paneIndex) : false,
    [collapsedIndices]
  );
