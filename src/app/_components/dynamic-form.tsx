'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { parseHalTemplate } from '@/lib/hal-parser';
import { buildPayload } from '@/lib/form-utils';


export default function DynamicForm() {
  const [template, setTemplate] = useState<any | null>(null);
  const [schema, setSchema] = useState<z.ZodObject<any> | null>(null);
  const [target, setTarget] = useState<string>('');

  const form = useForm({ resolver: schema ? zodResolver(schema) : undefined });
  const { control, handleSubmit, formState: { errors }, reset, setValue } = form;

  useEffect(() => {
    async function fetchTemplate() {
      const res = await fetch('/api/halform');
      const json = await res.json();
      setTemplate(json);
      const { target: parsedTarget, schema: parsedSchema } = parseHalTemplate(json);
      setTarget(parsedTarget);
      setSchema(parsedSchema);
    }
    fetchTemplate();
  }, []);

  const onSubmit = async (data: any) => {
    const payload = buildPayload(data, template._templates.default.properties);
    await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    toast.success('Form submitted successfully!', {
      description: (
      <pre style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(payload, null, 2)}
      </pre>
      ),
      duration: Infinity,
      position: 'top-center',
    });
    console.log(payload);
    reset();
  };

  if (!template || !schema) return <p>Loading form...</p>;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto mt-10">
        {template._templates.default.properties.map((prop: any) => (
          <FormField
            key={prop.name}
            control={control}
            name={prop.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {prop.label || prop.name}{' '}
                  {prop.validations?.required ? '*' : '(optional)'}
                </FormLabel>
                <FormControl>
                  {prop.type === 'cv' && prop.accepted ? (
                    prop.multiple ? (
                      <select
                        multiple
                        value={field.value ?? []}
                        onChange={(e) =>
                          field.onChange(
                            Array.from(e.target.selectedOptions, (option) => option.value)
                          )
                        }
                        className="border px-2 py-1 w-full"
                      >
                        {prop.accepted.map((opt: any) => (
                          <option key={opt.id} value={opt.id}>{opt.name}</option>
                        ))}
                      </select>
                    ) : (
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${prop.name}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {prop.accepted.map((opt: any) => (
                            <SelectItem key={opt.id} value={opt.id}>{opt.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )
                  ) : prop.type === 'boolean' ? (
                    <Checkbox
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                  ) : (
                    <Input
                      type={prop.type === 'number' ? 'number' : prop.type === 'date' ? 'date' : 'text'}
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      name={field.name}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit" className="mt-4">Submit</Button>
      </form>
    </Form>
  );
}
