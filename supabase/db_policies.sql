 -- Create separate policies for each operation                                                                                           
  -- Anyone can read                                                                                                                       
  CREATE POLICY "Anyone can read profile"                                                                                                  
    ON candidate_profile FOR SELECT                                                                                                        
    USING (true);                                                                                                                          
                                                                                                                                           
  -- Authenticated users can insert                                                                                                        
  CREATE POLICY "Authenticated can insert profile"                                                                                         
    ON candidate_profile FOR INSERT                                                                                                        
    TO authenticated                                                                                                                       
    WITH CHECK (true);                                                                                                                     
                                                                                                                                           
  -- Authenticated users can update                                                                                                        
  CREATE POLICY "Authenticated can update profile"                                                                                         
    ON candidate_profile FOR UPDATE                                                                                                        
    TO authenticated                                                                                                                       
    USING (true)                                                                                                                           
    WITH CHECK (true);                                                                                                                     
                                                                                                                                           
  -- Authenticated users can delete                                                                                                        
  CREATE POLICY "Authenticated can delete profile"                                                                                         
    ON candidate_profile FOR DELETE                                                                                                        
    TO authenticated                                                                                                                       
    USING (true);  