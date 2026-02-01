import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://elbphfohfpauzpscqsfs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsYnBoZm9oZnBhdXpwc2Nxc2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MTk5NDUsImV4cCI6MjA4NTQ5NTk0NX0.eTXrIwpFm0e3XRLQrnDeUzTSEtfSIoWpRw2wJ353y-E';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);