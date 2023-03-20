import React from 'react';

import { RenderComponentProps, RenderTypes, registerRender } from '../../renderRegistory';
import { useLoadTextRender } from '../../hooks/useLoadTextRender';

import styles from "./HTMLRender.module.css";

function HTMLRender(props: RenderComponentProps) {
  const content = useLoadTextRender(props);
  return (
    <iframe
      className={styles.main}
      srcDoc={content}
    />
  );
}

registerRender(RenderTypes.HTML, HTMLRender);
