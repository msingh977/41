import React from 'react'
import { Grommet, Grid, Box, Text, Nav, Anchor } from 'grommet'
import { Switch, Route, Link } from 'react-router-dom'

import Login from 'components/Login'

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
        <Box gridArea='nav' background='dark-3'>
          <Nav direction='row' background='brand' pad='medium'>
            <Anchor icon={<Icons.Home />} hoverIndicator />
            <Anchor icon={<Icons.Notification />} hoverIndicator />
            <Anchor icon={<Icons.ChatOption />} hoverIndicator />
          </Nav>
        </Box>
        <Box gridArea='main' background='#efeeee'>
          <Login />
        </Box>
      </Grid>
    </Grommet>
  )
}

export default Layout
