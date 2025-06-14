import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    _links: {
      self: { href: '/api/customform' },
    },
    _templates: {
      default: {
        method: 'POST',
        contentType: 'application/json',
        target: '/api/customform',
        properties: [
          {
            name: 'comments',
            type: 'string',
            label: 'Comments',
            path: 'feedback.comments',
            validations: { required: true },
          },
          {
            name: 'eventDate',
            type: 'date',
            label: 'Event Date',
            path: 'feedback.eventDate',
            validations: { required: true },
          },
          {
            name: 'tags',
            type: 'cv',
            label: 'Tags',
            path: 'feedback.tags',
            multiple: true,
            validations: { required: true },
            accepted: [
              { id: 'bug', name: 'Bug' },
              { id: 'feature', name: 'Feature' },
              { id: 'other', name: 'Other' },
            ],
          },
        ],
      },
    },
  });
}

export async function POST(req: Request) {
  const data = await req.json();
  console.log('Received customform submission:', data);
  return NextResponse.json({ status: 'success', received: data });
}
