module.exports = {
    'status': {
        'ok': 200,
        'ko': {
            'server': 500,
            'badrequest': 400,
            'unauthorized': 403,
            'notfound': 404
        }
    },
    'messages': {
        'success': {
            'welcome': {
                'unauth': 'Welcome to EpiBlog API server [unauthenticated]',
                'auth': 'Welcome to EpiBlog API server [authenticated]'
            },
            'security': {
                'authenticated': 'You are successfully authenticated'
            },
            'user': {
                'create': 'Account successfully created',
                'get': 'User successfully retrieved',
                'update': 'User successfully updated',
                'remove': 'User successfully removed'
            }
        },
        'error': {
            'fallback': 'An error occurred',
            'security': {
                'bad_credentials': 'Bad credentials',
                'missing_token': 'No token provided',
                'unauthorized': 'You are unauthorized to access this resource'
            },
            'user': {
                'create': {
                    'bad_parameter': 'Bad parameter',
                    'password_confirmation': 'Password confirmation does not match password',
                    'username_exists': 'Username already exists',
                    'email_exists': 'Email already exists'
                },
                'get': {
                    'not_found': 'User not found',
                    'unauthorized': 'You are not administrator, you can not update an other account'
                },
                'update': {
                    'bad_parameter': 'Bad parameter',
                    'not_administrator': 'You are unauthorized to access other user\'s account information'
                },
                'remove': {
                    'bad_parameter': 'Bad parameter',
                    'not_administrator': 'You are unauthorized to remove other user\'s account'
                }
            }
        }
    },
    'regexps': {
        'email': /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'password': /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*)(?=.*\W.*)[a-zA-Z0-9\S]{8,15}$/
    }
};
