from django.contrib.syndication.views import Feed
from {{ project_name }}.apps.main.models import Entry
from django.utils.translation import ugettext as _

class LatestEntriesFeed(Feed):
    title = "{{ project_name }}"
    link = "/feeds/"
    description = _("Updates on changes and additions to {{ project_name }}.")

    def items(self):
        return Entry.objects.order_by('-pub_date')[:2]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return item.description

    # item_link is only needed if NewsItem has no get_absolute_url method.
    def item_link(self, item):
        return item.link