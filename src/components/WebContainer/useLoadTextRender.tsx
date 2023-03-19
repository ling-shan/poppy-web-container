import { useEffect } from "react";
import { RenderComponentProps } from "./renderRegistory";
import { useRenderState } from "./useRenderState";

export function useLoadTextRender(props: RenderComponentProps) {
  const renderState = useRenderState();

  useEffect(() => {
    if (!props.url) {
      renderState.setState({
        loading: false,
        error: false,
        content: null
      })
      return;
    }

    (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const responseResult = await fetch(props.url!, {
          headers: {
            "Cache-Control": "no-cache"
          }
        });
        const responseContent = await responseResult.text();
        renderState.setState({
          loading: false,
          error: false,
          content: responseContent ?? null
        });
      } catch (err) {
        renderState.setState({
          loading: false,
          error: true,
          content: null
        });
      }
    })();
  }, [props.url])

  return renderState;
}
