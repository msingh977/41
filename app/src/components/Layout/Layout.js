import React from 'react'
import { Grommet, Grid, Box, Text, Nav, Anchor } from 'grommet'
import { Switch, Route, Link } from 'react-router-dom'
import { Home, Notification, Configure } from 'grommet-icons'

import theme from './theme'
import { Login, Notifications, Settings } from 'components/Pages'

function Layout() {
  return (
    <Grommet theme={theme}>
      <Grid
        rows={['10vh', '87vh']}
        columns={['10vw', '90vw']}
        gap='xsmall'
        fill='vertical'
        areas={[
          { name: 'header', start: [0, 0], end: [1, 0] },
          { name: 'nav', start: [0, 1], end: [0, 1] },
          { name: 'main', start: [1, 1], end: [1, 1] }
        ]}
      >
        <Box gridArea='header'>
          <Nav
            direction='row'
            background='gainsboro'
            pad='small'
            margin='xsmall'
          >
            <Link to='/'>
              <Anchor icon={<Home />} hoverIndicator />
            </Link>
            <Link to='/notifications'>
              <Anchor icon={<Notification />} hoverIndicator />
            </Link>
            <Link to='/settings'>
              <Anchor icon={<Configure />} hoverIndicator />
            </Link>
          </Nav>
        </Box>
        <Box gridArea='nav' background='dark-3'>
          <Nav
            direction='column'
            background='gainsboro'
            pad='small'
            margin='xsmall'
          >
            <Link to='/' style={{ textDecoration: 'none' }}>
              <Anchor icon={<Home />} label="Home" />
            </Link>
            <Link to='/notifications'>
              <Anchor icon={<Notification />} hoverIndicator />
            </Link>
          </Nav>
        </Box>
        <Box gridArea='main' background='#efeeee'>
          <Switch>
            <Route exact path='/'>
              <Login />
            </Route>
            <Route exact path='/notifications'>
              <Notifications />
            </Route>
            <Route exact path='/settings'>
              <Settings />
            </Route>
          </Switch>
        </Box>
      </Grid>
    </Grommet>
  )
}

export default Layout
