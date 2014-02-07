from django.conf.urls import patterns, include, url

from {{ project_name }}.apps.main.feeds import LatestEntriesFeed
# Uncomment the next two lines to enable the admin:

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('{{ project_name }}.apps.main.views',
    url(r'^feeds/$', LatestEntriesFeed(), name='feeds'),
    url(r'^$', 'home', name='home'),
    url(r'^.*?/$', 'home', name='general'),

    url(r'^render_page/'
        r'(?P<page_requested>\w+)/$', 'render_page', name='render'),
)
