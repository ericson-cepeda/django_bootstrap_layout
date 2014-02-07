from __future__ import division
from django.db import models
from django.contrib import admin

try:
    import simplejson as json
except ImportError:
    import json


class TruncatingCharField(models.CharField):
    def get_prep_value(self, value):
        value = super(TruncatingCharField, self).get_prep_value(value)
        if value:
            return value[:self.max_length]
        return value


class Entry(models.Model):
    title = models.CharField(max_length=250)
    link = models.URLField(max_length=250, default="/feeds/")
    pub_date = models.DateTimeField()
    description = models.TextField()


class EntryAdmin(admin.ModelAdmin):
    list_display = ('pub_date', 'title', 'description')

admin.site.register(Entry, EntryAdmin)