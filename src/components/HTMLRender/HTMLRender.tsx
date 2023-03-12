import styles from "./HTMLRender.module.css";

interface HTMLContainerProps {
  html?: string
}

export function HTMLContainer(props: HTMLContainerProps) {
  return (
    <iframe
      className={styles.main}
      srcDoc={props.html}
    />
  );
}
