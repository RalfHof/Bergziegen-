// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vxdxrojbgltjypxzehsg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4ZHhyb2piZ2x0anlweHplaHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MDg2MTEsImV4cCI6MjA2MDI4NDYxMX0.x6RaoV5RgYt5BNcO-rP_VD2_qgR0p9vkvidzoJU0lwc';

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
