import styles from "./HTMLRender.module.css";

interface HTMLRenderProps {
  content?: string
}

export function HTMLRender(props: HTMLRenderProps) {
  return (
    <iframe
      className={styles.main}
      srcDoc={props.content}
    />
  );
}
