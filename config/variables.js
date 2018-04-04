module.exports = {
    'status': {
        'ok': 200,
        'ko': {
            'server': 500,
            'badrequest': 400,
            'unauthorized': 403,
            'notfound': 404,
        }
    },
    'messages': {
        'success': {
            'welcome': {
                'unauth': 'Welcome to EpiBlog API server [unauthenticated]',
                'auth': 'Welcome to EpiBlog API server [authenticated]',
            },
            'security': {
                'authenticated': 'You are successfully authenticated'
            },
            'user': {
                'create': 'Account successfully created'
            }
        },
        'error': {
            'fallback': 'An error occured',
            'security': {
                'bad_credentials': 'Bad credentials',
                'missing_token': 'No token provided',
                'unauthorized': 'You are unauthorized to access this resource'
            },
            'user': {
                'create': {
                    'missing_field': 'Field %field% is missing',
                    'invalid_email': 'Invalid email',
                    'invalid_password': 'Password is too weak',
                    'password_confirmation': 'Password confirmation does not match password',
                    'username_exists': 'Username already exists',
                    'email_exists': 'Email already exists'
                }
            }
        },
    },
    'regexps': {
        'email': /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'password': /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*)(?=.*\W.*)[a-zA-Z0-9\S]{8,15}$/
    }
};
