from oclapi.settings.local import Local

class Openmrs(Local):
    DEBUG = False
    TEMPLATE_DEBUG = False

    DATABASES = {
        'default': {
            'ENGINE': 'django_mongodb_engine',
            'HOST': 'mongo',
            'NAME': 'ocl',
        }
    }

    HAYSTACK_CONNECTIONS = {
        'default': {
            'ENGINE': 'oclapi.search_backends.OCLSolrEngine',
            'URL': 'http://solor:8983/solr/collection1'
        },
    }
    HAYSTACK_SIGNAL_PROCESSOR = 'haystack.signals.BaseSignalProcessor'

    BROKER_URL = 'redis://redis:6379/0'
    CELERY_RESULT_BACKEND = 'redis://redis:6379/0'
