import { nl } from 'vuetify/locale'

export default {
  $vuetify: {
    ...nl,
    app: {
      version: 'Versie ' + import.meta.env.VITE_APP_VERSION
    },
    pages: {
      index: {
        button: {
          auto_complete: 'Automatisch voltooien'
        }
      },
      signin: {
        username: 'Gebruikersnaam',
        username_placeholder: 'Vul je gebruikersnaam in...',
        password: 'Wachtwoord',
        password_placeholder: 'Vul je wachtwoord in...',
        submit: 'Inloggen'
      }
    },
    tooltips: {
      button: {
        signout: 'Uitloggen'
      },
      date_picker: {
        change: 'Selecteer een datum'
      }
    }
  }
}
