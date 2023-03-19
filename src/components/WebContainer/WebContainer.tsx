import styled from 'styled-components'

const HostStyleWrapper = styled.div`
  width: 100%;
  width: 100%;
`

interface WebContainerProps {
  url?: string | null
  busy?: React.ElementType
  error?: React.ElementType
}

/**
 * WebContainer is an micro-frontend solution, which is support for mutiple mime type
 *
 * Resource render mapping
 * //xxxxx.html -> html render
 * //xxxxx.md | makrdown -> markdown render
 * //xxxxx.json  -> dynamic render schema we can decide the final render continer when the json schema loaded so it's dynamic.
 *
 * Steps:
 * 1. loaded the content from the url
 * 2. get the resource type from url suffix or response type(response type has hight priority than url suffix)
 * 3. get the content from the response (like json, mardwon, text context) then set the content to target render
 *
 * Loading Busy Status / Loading Error
 * 1. loading Error State
 * 2. loading busy State
 *
 * @param porps
 * @returns
 */
export function WebContainer(props: WebContainerProps) {
  return (
    <HostStyleWrapper>
      hello
    </HostStyleWrapper>
  );
}

