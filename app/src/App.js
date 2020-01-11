import React, { useState } from 'react';
import { Grommet, Box, grommet, Anchor } from 'grommet';
import { Add } from 'grommet-icons';

function App() {
  const [show, setShow] = useState(false);
  const customTheme = {
    global: {
      colors: {
        custom: '#cc6633'
      }
    }
  };
  return (
    <Grommet theme={customTheme}>
      <Anchor icon={<Add />} label='Add' color='custom' />
      <Box>Author: {process.env.REACT_APP_AUTHOR}</Box>
      <Box>Version: {process.env.REACT_APP_VER}</Box>
      <Box>Another box</Box>
    </Grommet>
  );
}

export default App;
