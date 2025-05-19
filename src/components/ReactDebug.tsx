import React, { useEffect } from 'react';

const ReactDebug = () => {
  useEffect(() => {
    console.group('[ReactDebug] React Instance Info');
    console.log('React version:', React.version);
    console.log('React instance:', React);
    console.log('React.useEffect:', React.useEffect);
    console.log('React.useState:', React.useState);
    console.groupEnd();
  }, []);

  return null;
};

export default ReactDebug;
