import { useState } from "react";

export function useRenderState() {
  const renderState = useState<{
    loading: boolean
    error: boolean
    content: any
  }>({
    loading: true,
    error: false,
    content: null
  });

  return {
    state: renderState[0], setState: renderState[1]
  }
}
