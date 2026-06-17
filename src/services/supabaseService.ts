import { supabase } from '../supabaseClient';
import { Card, Project } from '../types';

/**
 * Fetch all cards for the current user
 */
export async function fetchUserCards(userId: string): Promise<Card[]> {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cards:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch all projects for the current user
 */
export async function fetchUserProjects(userId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data || [];
}

/**
 * Insert a new card for the current user
 */
export async function createCard(
  userId: string,
  cardData: Omit<Card, 'id' | 'created_at' | 'updated_at'>
): Promise<Card | null> {
  const { data, error } = await supabase
    .from('cards')
    .insert([
      {
        ...cardData,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating card:', error);
    return null;
  }

  return data || null;
}

/**
 * Update an existing card (with permission check)
 */
export async function updateCard(userId: string, card: Card): Promise<Card | null> {
  // First check if the user owns this card
  const { data: existingCard, error: fetchError } = await supabase
    .from('cards')
    .select('user_id')
    .eq('id', card.id)
    .single();

  if (fetchError || !existingCard || existingCard.user_id !== userId) {
    console.error('User does not own this card');
    return null;
  }

  const { data, error } = await supabase
    .from('cards')
    .update({
      ...card,
      updated_at: new Date().toISOString(),
    })
    .eq('id', card.id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating card:', error);
    return null;
  }

  return data || null;
}

/**
 * Delete a card (with permission check)
 */
export async function deleteCard(userId: string, cardId: string): Promise<boolean> {
  // First check if the user owns this card
  const { data: existingCard, error: fetchError } = await supabase
    .from('cards')
    .select('user_id')
    .eq('id', cardId)
    .single();

  if (fetchError || !existingCard || existingCard.user_id !== userId) {
    console.error('User does not own this card');
    return false;
  }

  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', cardId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting card:', error);
    return false;
  }

  return true;
}

/**
 * Create a new project for the current user
 */
export async function createProject(
  userId: string,
  projectData: Omit<Project, 'id' | 'user_id' | 'created_at'>
): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        ...projectData,
        user_id: userId,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return null;
  }

  return data || null;
}

/**
 * Update an existing project (with permission check)
 */
export async function updateProject(userId: string, project: Project): Promise<Project | null> {
  // First check if the user owns this project
  const { data: existingProject, error: fetchError } = await supabase
    .from('projects')
    .select('user_id')
    .eq('id', project.id)
    .single();

  if (fetchError || !existingProject || existingProject.user_id !== userId) {
    console.error('User does not own this project');
    return null;
  }

  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', project.id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    return null;
  }

  return data || null;
}

/**
 * Delete a project (with permission check)
 */
export async function deleteProject(userId: string, projectId: string): Promise<boolean> {
  // First check if the user owns this project
  const { data: existingProject, error: fetchError } = await supabase
    .from('projects')
    .select('user_id')
    .eq('id', projectId)
    .single();

  if (fetchError || !existingProject || existingProject.user_id !== userId) {
    console.error('User does not own this project');
    return false;
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }

  return true;
}

/**
 * Subscribe to real-time changes for user's cards
 */
export function subscribeToUserCards(userId: string, callback: (cards: Card[]) => void) {
  const subscription = supabase
    .from('cards')
    .on('*', (payload) => {
      if (payload.new?.user_id === userId) {
        // Fetch updated cards on any change
        fetchUserCards(userId).then(callback);
      }
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Subscribe to real-time changes for user's projects
 */
export function subscribeToUserProjects(userId: string, callback: (projects: Project[]) => void) {
  const subscription = supabase
    .from('projects')
    .on('*', (payload) => {
      if (payload.new?.user_id === userId) {
        // Fetch updated projects on any change
        fetchUserProjects(userId).then(callback);
      }
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Get cards from localStorage as fallback
 */
export function getLocalCards(): Card[] {
  const saved = localStorage.getItem('repertorio_cards_v1');
  return saved ? JSON.parse(saved) : [];
}

/**
 * Save cards to localStorage for offline fallback
 */
export function saveLocalCards(cards: Card[]): void {
  localStorage.setItem('repertorio_cards_v1', JSON.stringify(cards));
}

/**
 * Get projects from localStorage as fallback
 */
export function getLocalProjects(): Project[] {
  const saved = localStorage.getItem('repertorio_projects_v1');
  return saved ? JSON.parse(saved) : [];
}

/**
 * Save projects to localStorage for offline fallback
 */
export function saveLocalProjects(projects: Project[]): void {
  localStorage.setItem('repertorio_projects_v1', JSON.stringify(projects));
}

/**
 * Clear all local data (for logout)
 */
export function clearLocalData(): void {
  localStorage.removeItem('repertorio_cards_v1');
  localStorage.removeItem('repertorio_projects_v1');
}
