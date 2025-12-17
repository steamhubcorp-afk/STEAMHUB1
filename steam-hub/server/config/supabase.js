
const { createClient } = require('@supabase/supabase-js');

// Config from user provided secrets
// Project Ref extracted from JWT: xvkyntwvrasdprelyslr
const supabaseUrl = 'https://xvkyntwvrasdprelyslr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2a3ludHd2cmFzZHByZWx5c2xyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk4ODQwOSwiZXhwIjoyMDgxNTY0NDA5fQ.MdH5C1xMcD85E-OR44yxw2wTwrHAZe8QMNT8YEu0OAU';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
