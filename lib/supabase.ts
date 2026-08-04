import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Enable Supabase if URL & Anon Key exist and process.env is not explicitly 'false'
const ENABLE_SUPABASE =
  process.env.NEXT_PUBLIC_ENABLE_SUPABASE !== 'false' &&
  Boolean(supabaseUrl && supabaseAnonKey);

// Recursive chainable mock builder to prevent any ".eq is not a function" errors
function createMockQueryBuilder(): any {
  const handler: ProxyHandler<any> = {
    get(target, prop: string) {
      if (prop === 'then') {
        return (resolve: any) => resolve({ data: [], error: null });
      }
      if (prop === 'data') return [];
      if (prop === 'error') return null;
      return (..._args: any[]) => new Proxy({}, handler);
    },
  };
  return new Proxy({}, handler);
}

// No-op Realtime channel mock — covers .channel().on().subscribe() and removeChannel()
function createMockChannel() {
  const mockChannel: any = {
    on: (..._args: any[]) => mockChannel,
    subscribe: (..._args: any[]) => mockChannel,
    unsubscribe: () => Promise.resolve('ok'),
  };
  return mockChannel;
}

export const supabase = ENABLE_SUPABASE
  ? createClient(supabaseUrl, supabaseAnonKey)
  : ({
      from: (_: string) => createMockQueryBuilder(),
      channel: (_: string) => createMockChannel(),
      removeChannel: (_: any) => Promise.resolve(),
    } as any);

