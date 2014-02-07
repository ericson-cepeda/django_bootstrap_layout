from django.conf.urls import patterns, url

from {{ project_name }}.apps.main.feeds import LatestEntriesFeed

urlpatterns = patterns('{{ project_name }}.apps.main.views',
    url(r'^feeds/$', LatestEntriesFeed(), name='feeds'),
    url(r'^$', 'home', name='home'),

    url(r'^render_page/'
        r'(?P<page_requested>\w+)/$', 'render_page', name='render'),
    url(r'^render_content/'
        r'(?P<page_requested>\w+)$', 'render_content', name='render'),

    url(r'^.*?/$', 'home', name='general'),
)
