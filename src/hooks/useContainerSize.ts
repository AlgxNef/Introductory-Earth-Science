'use client';

import { useState, useEffect, RefObject } from 'react';

export const useContainerSize = (ref: RefObject<HTMLElement>) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // ResizeObserverを作成
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    // 監視を開始
    observer.observe(element);

    // クリーンアップ関数
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return size;
};