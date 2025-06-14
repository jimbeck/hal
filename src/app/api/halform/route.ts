// File: app/api/halform/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    _links: {
      self: { href: '/api/halform' },
    },
    _templates: {
      default: {
        method: 'POST',
        contentType: 'application/json',
        target: '/api/halform',
        properties: [
          {
            name: 'fullName',
            type: 'string',
            required: true,
          },
          {
            name: 'emailAddress',
            type: 'string',
            required: true,
            regex: '^\\S+@\\S+\\.\\S+$',
            message: 'Invalid email format',
          },
          {
            name: 'age',
            type: 'number',
            required: false,
          },
          {
            name: 'subscribed',
            type: 'boolean',
            required: false,
          },
          {
            name: 'birthDate',
            type: 'date',
            required: true,
          },
          {
            name: 'userType',
            type: 'cv',
            required: true,
            accepted: [
              { id: 'admin', name: 'Administrator' },
              { id: 'editor', name: 'Editor' },
              { id: 'viewer', name: 'Viewer' },
            ],
          },
          {
            name: 'interests',
            type: 'cv',
            required: false,
            multiple: true,
            accepted: [
              { id: 'tech', name: 'Technology' },
              { id: 'sports', name: 'Sports' },
              { id: 'music', name: 'Music' },
              { id: 'travel', name: 'Travel' },
            ],
          },
        ],
      },
    },
  });
}

export async function POST(req: Request) {
  const data = await req.json();
  console.log('Received submission:', data);
  return NextResponse.json({ status: 'success', received: data });
}
