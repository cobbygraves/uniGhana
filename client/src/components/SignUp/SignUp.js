import React, { useEffect, useContext, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import AuthContext from '../../context/AuthContext'
import axios from 'axios'
import HOSTURL from '../../config'
import { useNavigate } from 'react-router-dom'

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [password, setPassword] = useState('')
  const [isValidPassword, setIsValidPassword] = useState(false)
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [isValidPasswordRepeat, setIsValidPasswordRepeat] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [isEmailTouched, setEmailTouched] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  const ctx = useContext(AuthContext)
  const navigate = useNavigate()

  const handleEmail = (event) => {
    setEmailError(false)
    setEmail(event.target.value)
  }

  const handlePassword = (event) => {
    setEmailTouched(true)
    setPassword(event.target.value)
  }

  const handlePasswordRepeat = (event) => {
    setPasswordRepeat(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setIsLoading(true)
    const signupDetails = {
      email,
      password,
      passwordRepeat
    }

    axios
      .post(`${HOSTURL}/signup`, signupDetails)
      .then((res) => {
        if (res.data.verification) {
          setIsLoading(false)
          ctx.setUserAuth(true)
          window.alert("You've successfully registered")
          setEmail('')
          setPassword('')
          setPasswordRepeat('')
          setEmailTouched(false)
          setEmailError(false)
          navigate('/')
          return
        } else {
          if (res.data.passwordError) {
            console.log(res.data)
            setPasswordError(true)
          }
          if (res.data.emailError) {
            setEmailError(true)
          }
          setIsLoading(false)
        }
      })
      .catch((err) => {
        setIsLoading(false)
        console.log(err)
      })
  }

  useEffect(() => {
    if (password.trim() !== '' && password.trim().length >= 8) {
      setIsValidPassword(true)
    } else {
      setIsValidPassword(false)
    }
  }, [password])

  useEffect(() => {
    const isValidMail = validateEmail(email)
    if (isValidMail) {
      setIsValidEmail(true)
    } else {
      setIsValidEmail(false)
    }
  }, [email])

  useEffect(() => {
    if (passwordRepeat.trim() !== '' && passwordRepeat.trim().length >= 8) {
      setIsValidPasswordRepeat(true)
    } else {
      setIsValidPasswordRepeat(false)
    }
  }, [passwordRepeat])

  let showButton = false
  if (
    isValidEmail &&
    isValidPassword &&
    isValidPasswordRepeat &&
    password === passwordRepeat
  ) {
    showButton = true
  }

  const checkEmailValidity = () => {
    const valid = validateEmail(email)
    if (valid) {
      setIsValidEmail(true)
    } else {
      setIsValidEmail(false)
    }
  }

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign up
        </Typography>
        <Box component='form' noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                value={email}
                onChange={handleEmail}
              />
              {!isValidEmail && isEmailTouched && (
                <Typography variant='body1' sx={{ color: 'red' }}>
                  please provide a valid email
                </Typography>
              )}
              {emailError && (
                <Typography variant='body1' sx={{ color: 'red' }}>
                  email already exist
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Password'
                type='password'
                id='password'
                autoComplete='new-password'
                value={password}
                onChange={handlePassword}
                onFocus={checkEmailValidity}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Repeat-Password'
                type='password'
                id='password-repeat'
                autoComplete='password-repeat'
                value={passwordRepeat}
                onChange={handlePasswordRepeat}
              />
              {passwordError && (
                <Typography variant='body1' sx={{ color: 'red' }}>
                  password-mismatch or less than 8 characters
                </Typography>
              )}

              {loading && (
                <Typography
                  variant='p'
                  sx={{ color: '#ccc', textAlign: 'center' }}
                >
                  loading...
                </Typography>
              )}
            </Grid>
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
            disabled={!showButton}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
