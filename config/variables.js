module.exports = {
    'status': {
        'ok': 200,
        'nc': 204,
        'ko': {
            'badrequest': 400,
            'unauthorized': 403,
            'notfound': 404,
            'server': 500
        }
    },
    'messages': {
        'success': {
            'welcome': {
                'unauth': 'Welcome to EpiBlog API server',
                'auth': 'Welcome to EpiBlog API server [authenticated]'
            },
            'security': {
                'authenticated': 'You are successfully authenticated',
                'logout': 'You are successfully logged out'
            },
            'user': {
                'create': 'Account successfully created',
                'get': 'User successfully retrieved',
                'update': 'User successfully updated',
                'remove': 'User successfully removed'
            },
            'post': {
                'create': 'Post successfully created',
                'get': 'Post successfully retrieved',
                'update': 'Post successfully updated',
                'remove': 'Post successfully removed'
            },
            'comment': {
                'get': 'Comments successfully retrieved',
                'post': 'Comment successfully created'
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
                    'account_exists': 'Username or email already exists'
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
            },
            'post': {
                'create': {
                    'bad_parameter': 'Bad parameter'
                },
                'get': {
                    'not_found': 'Post not found'
                },
                'update': {
                    'bad_parameter': 'Bad parameter',
                    'not_administrator': 'You are not the creator of this post'
                },
                'remove': {
                    'bad_parameter': 'Bad parameter',
                    'not_found': 'Post not found',
                    'not_administrator': 'You are not the creator of this post'
                }
            },
            'comment': {
                'bad_request': 'Bad request'
            }
        }
    },
    'regexps': {
        'method': /^(get|post)$/,
        'password': /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*)(?=.*\W.*)[a-zA-Z0-9\S]{8,15}$/
    }
};
