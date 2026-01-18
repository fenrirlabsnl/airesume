-- Candidate Profile (single row table)                                                                                                  
  CREATE TABLE IF NOT EXISTS candidate_profile (                                                                                           
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                                                                                         
    name TEXT NOT NULL,                                                                                                                    
    email TEXT NOT NULL,                                                                                                                   
    title TEXT NOT NULL,                                                                                                                   
    target_titles TEXT[] DEFAULT '{}',                                                                                                     
    target_company_stages TEXT[] DEFAULT '{}',                                                                                             
    elevator_pitch TEXT DEFAULT '',                                                                                                        
    career_narrative TEXT DEFAULT '',                                                                                                      
    looking_for TEXT DEFAULT '',                                                                                                           
    not_looking_for TEXT DEFAULT '',                                                                                                       
    salary_min INTEGER,                                                                                                                    
    salary_max INTEGER,                                                                                                                    
    availability_status TEXT DEFAULT 'open' CHECK (availability_status IN ('actively_looking', 'open', 'not_looking')),                    
    availability_date DATE,                                                                                                                
    location TEXT DEFAULT '',                                                                                                              
    remote_preference TEXT DEFAULT 'flexible' CHECK (remote_preference IN ('remote', 'hybrid', 'onsite', 'flexible')),                     
    github_url TEXT,                                                                                                                       
    linkedin_url TEXT,                                                                                                                     
    twitter_url TEXT,                                                                                                                      
    created_at TIMESTAMPTZ DEFAULT NOW(),                                                                                                  
    updated_at TIMESTAMPTZ DEFAULT NOW()                                                                                                   
  );                                                                                                                                       
                                                                                                                                           
  -- Experiences                                                                                                                           
  CREATE TABLE IF NOT EXISTS experiences (                                                                                                 
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                                                                                         
    company_name TEXT NOT NULL,                                                                                                            
    title TEXT NOT NULL,                                                                                                                   
    title_progression TEXT,                                                                                                                
    start_date DATE NOT NULL,                                                                                                              
    end_date DATE,                                                                                                                         
    is_current BOOLEAN DEFAULT false,                                                                                                      
    bullet_points TEXT[] DEFAULT '{}',                                                                                                     
    why_joined TEXT,                                                                                                                       
    why_left TEXT,                                                                                                                         
    actual_contributions TEXT,                                                                                                             
    proudest_achievement TEXT,                                                                                                             
    would_do_differently TEXT,                                                                                                             
    challenges_faced TEXT,                                                                                                                 
    lessons_learned TEXT,                                                                                                                  
    manager_would_say TEXT,                                                                                                                
    reports_would_say TEXT,                                                                                                                
    quantified_impact JSONB,                                                                                                               
    display_order INTEGER DEFAULT 0,                                                                                                       
    created_at TIMESTAMPTZ DEFAULT NOW(),                                                                                                  
    updated_at TIMESTAMPTZ DEFAULT NOW()                                                                                                   
  );                                                                                                                                       
                                                                                                                                           
  -- Skills                                                                                                                                
  CREATE TABLE IF NOT EXISTS skills (                                                                                                      
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                                                                                         
    skill_name TEXT NOT NULL,                                                                                                              
    category TEXT NOT NULL,                                                                                                                
    self_rating INTEGER CHECK (self_rating >= 1 AND self_rating <= 10),                                                                    
    evidence TEXT,                                                                                                                         
    honest_notes TEXT,                                                                                                                     
    years_experience INTEGER,                                                                                                              
    last_used DATE,                                                                                                                        
    created_at TIMESTAMPTZ DEFAULT NOW(),                                                                                                  
    updated_at TIMESTAMPTZ DEFAULT NOW()                                                                                                   
  );                                                                                                                                       
                                                                                                                                           
  -- Gaps & Weaknesses                                                                                                                     
  CREATE TABLE IF NOT EXISTS gaps_weaknesses (                                                                                             
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                                                                                         
    gap_type TEXT NOT NULL,                                                                                                                
    description TEXT NOT NULL,                                                                                                             
    why_its_a_gap TEXT,                                                                                                                    
    interest_in_learning BOOLEAN DEFAULT true,                                                                                             
    created_at TIMESTAMPTZ DEFAULT NOW(),                                                                                                  
    updated_at TIMESTAMPTZ DEFAULT NOW()                                                                                                   
  );                                                                                                                                       
                                                                                                                                           
  -- FAQ Responses                                                                                                                         
  CREATE TABLE IF NOT EXISTS faq_responses (                                                                                               
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                                                                                         
    question TEXT NOT NULL,                                                                                                                
    answer TEXT NOT NULL,                                                                                                                  
    is_common_question BOOLEAN DEFAULT false,                                                                                              
    created_at TIMESTAMPTZ DEFAULT NOW(),                                                                                                  
    updated_at TIMESTAMPTZ DEFAULT NOW()                                                                                                   
  );                                                                                                                                       
                                                                                                                                           
  -- Chat History                                                                                                                          
  CREATE TABLE IF NOT EXISTS chat_history (                                                                                                
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                                                                                         
    session_id TEXT NOT NULL,                                                                                                              
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),                                                                              
    content TEXT NOT NULL,                                                                                                                 
    created_at TIMESTAMPTZ DEFAULT NOW()                                                                                                   
  );                                                                                                                                       
                                                                                                                                           
  -- AI Instructions                                                                                                                       
  CREATE TABLE IF NOT EXISTS ai_instructions (                                                                                             
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                                                                                         
    instruction_type TEXT NOT NULL,                                                                                                        
    instruction TEXT NOT NULL,                                                                                                             
    priority INTEGER DEFAULT 0,                                                                                                            
    created_at TIMESTAMPTZ DEFAULT NOW(),                                                                                                  
    updated_at TIMESTAMPTZ DEFAULT NOW()                                                                                                   
  ); 