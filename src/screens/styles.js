import theme from '../../theme';

export default {
  container: {
    flex: 1,
    backgroundColor: theme.revSecondaryColor,
    // paddingVertical: 20,
    paddingHorizontal: 30,
    width: '100%'
  },
  content: {
    paddingVertical: 20
  },
  title: {
    color: theme.primaryColor,
    fontSize: 30,
    textAlign: 'center',
    letterSpacing: 3
  },
  form: {
    marginTop: 45
  },
  singleInput: {
    position: 'relative',
    marginBottom: 35
  },
  input: {
    height: 40, 
    borderColor: 'gray', 
    borderBottomWidth: 1,
    fontSize: 17,
    color: theme.primaryColor,
    paddingLeft: 35
  },
  icon: {
    position: 'absolute',
    top: 5
  },
  button: {
    paddingVertical: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    letterSpacing: 1
  },
  loginButton: {
    backgroundColor: theme.primaryColor
  },
  facebookButton: {
    backgroundColor: '#465EA9',
    marginBottom: 20
  },
  googleButton: {
    backgroundColor: '#CD5542'
  },
  forgotPassword: {
    color: theme.revPrimaryColor,
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20
  },
  orText: {
    color: theme.primaryColor,
    textAlign: 'center',
    marginVertical: 20
  },
  error: {
    color: 'red',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: -30
  }
}