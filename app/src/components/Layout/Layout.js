import React from 'react'
import { Grommet, Grid, Box, Nav } from 'grommet'
import { Switch, Route, Link, Redirect } from 'react-router-dom'
import {
  Home as HomeIcon,
  Notification,
  Configure,
  Logout as LogoutIcon
} from 'grommet-icons'

import theme from './theme'
import {
  ForgotPassword,
  Home,
  Login,
  Logout,
  NetworkError,
  Notifications,
  Register,
  Settings
} from 'components/Pages'

import { useSelector } from 'react-redux'

function Layout () {
  const session = useSelector(state => state.session)

  function PrivateRoute ({ children, ...rest }) {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          session ? children : <Redirect to={{ pathname: '/login' }} />
        }
      />
    )
  }

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
              <HomeIcon />
            </Link>
            <Link to='/notifications'>
              <Notification />
            </Link>
            <Link to='/settings'>
              <Configure />
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
              <HomeIcon />
            </Link>
            <Link to='/notifications'>
              <Notification />
            </Link>
            {session && (
              <Link to='/logout'>
                <LogoutIcon />
              </Link>
            )}
          </Nav>
        </Box>
        <Box gridArea='main' background='#efeeee'>
          <Switch>
            <PrivateRoute exact path='/'>
              <Home />
            </PrivateRoute>
            <Route exact path='/login'>
              <Login />
            </Route>
            <Route exact path='/network-error'>
              <NetworkError />
            </Route>
            <Route exact path='/reset_password'>
              <ForgotPassword />
            </Route>
            <Route exact path='/register'>
              <Register />
            </Route>
            <PrivateRoute exact path='/logout'>
              <Logout />
            </PrivateRoute>
            <PrivateRoute exact path='/notifications'>
              <Notifications />
            </PrivateRoute>
            <PrivateRoute exact path='/settings'>
              <Settings />
            </PrivateRoute>
          </Switch>
        </Box>
      </Grid>
    </Grommet>
  )
}

export default Layout
