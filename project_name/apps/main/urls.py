from django.conf.urls import patterns, url

from {{ project_name }}.apps.main.feeds import LatestEntriesFeed

urlpatterns = patterns('{{ project_name }}.apps.main.views',
    url(r'^feeds/$', LatestEntriesFeed(), name='feeds'),

    url(r'^$', 'general', name='home'),

    url(r'^render_data/'
        r'(?P<page_requested>\w+)$', 'render_data', name='render_data'),

    url(r'^render_page/'
        r'(?P<page_requested>\w+)/$', 'render_page', name='render_page'),

    url(r'^.*?/$', 'general', name='general'),
)
