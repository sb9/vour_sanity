import {defineField, defineType} from 'sanity'

export const gigType = defineType({
  name: 'gig',
  title: 'Konzert',
  type: 'document',
  groups: [
    {name: 'event', title: 'Termin'},
    {name: 'venue', title: 'Veranstaltungsort'},
    {name: 'program', title: 'Programm'},
    {name: 'publication', title: 'Veröffentlichung'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      group: 'event',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'event',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Datum',
      type: 'date',
      group: 'event',
      validation: (rule) =>
        rule.custom((date, context) => {
          const dateNote = context.document?.dateNote
          return date || (typeof dateNote === 'string' && dateNote.trim().length > 0)
            ? true
            : 'Bitte ein Datum oder einen Datumszusatz angeben.'
        }),
    }),
    defineField({
      name: 'dateNote',
      title: 'Datumszusatz',
      description: 'Für ungenaue Angaben wie „Sommer 2020“.',
      type: 'string',
      group: 'event',
    }),
    defineField({
      name: 'doors',
      title: 'Einlass',
      type: 'string',
      group: 'event',
    }),
    defineField({
      name: 'showTime',
      title: 'Beginn',
      type: 'string',
      group: 'event',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'event',
      initialValue: 'confirmed',
      options: {
        layout: 'radio',
        list: [
          {title: 'Bestätigt', value: 'confirmed'},
          {title: 'Abgesagt', value: 'cancelled'},
          {title: 'Verschoben', value: 'postponed'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'venue',
      title: 'Veranstaltungsort',
      type: 'string',
      group: 'venue',
    }),
    defineField({
      name: 'venueUrl',
      title: 'Website des Veranstaltungsorts',
      type: 'url',
      group: 'venue',
    }),
    defineField({
      name: 'location',
      title: 'Ort / Stadt',
      type: 'string',
      group: 'venue',
    }),
    defineField({
      name: 'address',
      title: 'Adresse',
      type: 'string',
      group: 'venue',
    }),
    defineField({
      name: 'mapsUrl',
      title: 'Google-Maps-Link',
      type: 'url',
      group: 'venue',
    }),
    defineField({
      name: 'eventUrl',
      title: 'Veranstaltungslink',
      type: 'url',
      group: 'event',
    }),
    defineField({
      name: 'ticketUrl',
      title: 'Ticketlink',
      type: 'url',
      group: 'event',
    }),
    defineField({
      name: 'description',
      title: 'Beschreibung und weitere Modalitäten',
      type: 'text',
      rows: 5,
      group: 'event',
    }),
    defineField({
      name: 'bands',
      title: 'Weitere Bands',
      type: 'array',
      group: 'program',
      of: [
        {
          type: 'object',
          name: 'band',
          title: 'Band',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({name: 'url', title: 'Website / Profil', type: 'url'}),
            defineField({name: 'logo', title: 'Logo', type: 'image', options: {hotspot: true}}),
          ],
          preview: {
            select: {title: 'name', media: 'logo'},
          },
        },
      ],
    }),
    defineField({
      name: 'relatedLinks',
      title: 'Weitere Links aus der bisherigen Terminliste',
      type: 'array',
      group: 'program',
      of: [
        {
          type: 'object',
          name: 'relatedLink',
          title: 'Link',
          fields: [
            defineField({
              name: 'label',
              title: 'Linktext',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'url'}},
        },
      ],
    }),
    defineField({
      name: 'image',
      title: 'Veranstaltungsbild',
      type: 'image',
      options: {hotspot: true},
      group: 'program',
    }),
    defineField({
      name: 'showInApp',
      title: 'In der App anzeigen',
      type: 'boolean',
      initialValue: true,
      group: 'publication',
    }),
    defineField({
      name: 'showOnWebsite',
      title: 'Auf der Website anzeigen',
      type: 'boolean',
      initialValue: true,
      group: 'publication',
    }),
  ],
  preview: {
    select: {title: 'title', date: 'date', venue: 'venue', status: 'status'},
    prepare({title, date, venue, status}) {
      const dateLabel = typeof date === 'string' ? date : 'Datum fehlt'
      const statusLabel = status === 'cancelled' ? ' · Abgesagt' : status === 'postponed' ? ' · Verschoben' : ''
      return {
        title: title ?? 'Unbenanntes Konzert',
        subtitle: `${dateLabel}${venue ? ` · ${venue}` : ''}${statusLabel}`,
      }
    },
  },
})
