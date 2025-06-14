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
            name: 'firstName',
            type: 'string',
            label: 'First Name',
            path: 'user.name.first',
            validations: { required: true },
          },
          {
            name: 'lastName',
            type: 'string',
            label: 'Last Name',
            path: 'user.name.last',
            validations: { required: true },
          },
          {
            name: 'emailAddress',
            type: 'string',
            label: 'Email Address',
            path: 'user.email',
            validations: {
              required: true,
              regex: '^\\S+@\\S+\\.\\S+$',
              message: 'Invalid email format',
            },
          },
          {
            name: 'age',
            type: 'number',
            label: 'Age',
            path: 'user.age',
          },
          {
            name: 'subscribed',
            type: 'boolean',
            label: 'Subscribed to Newsletter',
            path: 'user.preferences.subscribed',
          },
          {
            name: 'birthDate',
            type: 'date',
            label: 'Birth Date',
            path: 'user.birthDate',
            validations: { required: true },
          },
          {
            name: 'userType',
            type: 'cv',
            label: 'User Type',
            path: 'user.role',
            validations: { required: true },
            accepted: [
              { id: 'admin', name: 'Administrator' },
              { id: 'editor', name: 'Editor' },
              { id: 'viewer', name: 'Viewer' },
            ],
          },
          {
            name: 'interests',
            type: 'cv',
            label: 'Interests',
            path: 'user.preferences.interests',
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
