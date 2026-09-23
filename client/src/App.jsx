import { useEffect } from 'react';
import { supabase } from './supabaseClient'; // adjust path if needed

useEffect(() => {
  async function testConnection() {
    const { data, error } = await supabase.from('your_table_name').select('count', { count: 'exact' });
    
    if (error) {
      console.error('Supabase Connection Error:', error.message);
    } else {
      console.log('Successfully connected to Supabase!', data);
    }
  }

  testConnection();
}, []);