from django.conf.urls import patterns, url, include

from {{ project_name }}.apps.main.feeds import LatestEntriesFeed
from views import general

urls = {
    'main': {
        'name': 'main'
    },
    'test': {
        'name': 'test',
        'additional_variables': [
            'test'
        ]
    }
}

dynamic_patterns = []
for name, url_item in urls.items():
    if 'additional_variables' in url_item:
        url_string = r'^{name}/{variables}/$'.\
        format(
            name=url_item['name'],
            variables="/".join([r'(?P<{0}>\w+)'.format(variable) for variable in url_item['additional_variables']])
        )
    else:
        url_string = r'^{name}/$'.format(name=url_item['name'])
    dynamic_patterns.append(url(url_string, general, name=name))

urlpatterns = patterns('{{ project_name }}.apps.main.views',
    url(r'^feeds/$', LatestEntriesFeed(), name='feeds'),

    url(r'^$', 'general', name='home'),

    url(r'^render_data/'
        r'(?P<page_requested>\w+)$', 'render_data', name='render_data'),

    url(r'^render_page/'
        r'(?P<page_requested>\w+)/$', 'render_page', name='render_page'),

    url(r'^', include((dynamic_patterns, 'general', 'general'))),
    #url(r'^.*?/$', 'general', name='general'),
)
