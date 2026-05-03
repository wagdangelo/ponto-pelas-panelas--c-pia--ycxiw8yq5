-- Create 'pontos' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pontos', 'pontos', true) 
ON CONFLICT (id) DO NOTHING;

-- Set up policies for the 'pontos' bucket
DROP POLICY IF EXISTS "Enable read access for all" ON storage.objects;
CREATE POLICY "Enable read access for all" ON storage.objects 
  FOR SELECT USING (bucket_id = 'pontos');

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON storage.objects;
CREATE POLICY "Enable insert for authenticated users" ON storage.objects 
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'pontos');

DROP POLICY IF EXISTS "Enable update for authenticated users" ON storage.objects;
CREATE POLICY "Enable update for authenticated users" ON storage.objects 
  FOR UPDATE TO authenticated USING (bucket_id = 'pontos');

DROP POLICY IF EXISTS "Enable delete for authenticated users" ON storage.objects;
CREATE POLICY "Enable delete for authenticated users" ON storage.objects 
  FOR DELETE TO authenticated USING (bucket_id = 'pontos');
