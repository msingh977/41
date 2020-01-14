import React from 'react'
import { Grommet, Grid, Box } from 'grommet'

function Layout () {
  return (
    <Grommet>
      <Grid
        rows={['10vh', '90vh']}
        columns={['20vw', '80vw']}
        gap='xsmall'
        fill='vertical'
        areas={[
          { name: 'header', start: [0, 0], end: [1, 0] },
          { name: 'nav', start: [0, 1], end: [0, 1] },
          { name: 'main', start: [1, 1], end: [1, 1] }
        ]}
      >
        <Box gridArea='header' background='dark-2' />
        <Box gridArea='nav' background='dark-3' />
        <Box gridArea='main' background='dark-4' />
      </Grid>
    </Grommet>
  )
}

export default Layout
