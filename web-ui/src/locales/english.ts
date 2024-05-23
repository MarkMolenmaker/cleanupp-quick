import { en } from 'vuetify/locale'

export default {
  $vuetify: {
    ...en,
    app: {
      version: 'Version ' + import.meta.env.VITE_APP_VERSION
    },
    pages: {
      index: {
        button: {
          auto_complete: 'Auto Complete',
        }
      },
      signin: {
        username: 'Username',
        username_placeholder: 'Enter your username...',
        password: 'Password',
        password_placeholder: 'Enter your password...',
        submit: 'Sign in'
      }
    },
    tooltips: {
      button: {
        signout: 'Sign out'
      },
      date_picker: {
        change: 'Select a date'
      }
    }
  }
}
