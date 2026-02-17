import { supabase } from './supabase';
interface BookMetaData {
  title: string;
  user_id: string;
  author: string | null;
  published_date: string | null;
  preview_url: string | null;
  file_url: string;
  is_favorite: boolean;
  created_at?: string;
  updated_at?: string;
}

async function fetchAllBookMetaData() {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*');
    if (error) {
      return {
        error: 'Error fetching book metadata'
      }
    }
    return {
      data: data
    }
  }
  catch (error) {
    return {
      error: 'Error fetching book metadata'
    }
  }
}

async function fetchBookMetaDataByTitle(title: string) {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('title', title);
    if (error) {
      return {
        error: 'Error fetching book metadata'
      }
    }
    return {
      data: data
    }
  }
  catch (error) {
    return {
      error: 'Error fetching book metadata'
    }
  }
}

async function addBookMetaData(data: BookMetaData) {
  try {
    const { error } = await supabase
      .from('books')
      .insert(data);
    if (error) {
      return {
        error: 'Error adding book metadata'
      }
    }
    return {
      success: true
    }
  }
  catch (error) {
    return {
      error: 'Error adding book metadata'
    }
  }
}

async function updateBookMetaData(title: string, data: Partial<BookMetaData>) {
  try {
    const { error } = await supabase
      .from('books')
      .update(data)
      .eq('title', title);
    if (error) {
      return {
        error: 'Error updating book metadata'
      }
    }
    return {
      success: true
    }
  }
  catch (error) {
    return {
      error: 'Error updating book metadata'
    }
  }
}

async function deleteBookMetaData(title: string) {
  try {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('title', title);
    if (error) {
      return {
        error: 'Error deleting book metadata'
      }
    }
    return {
      success: true
    }
  }
  catch (error) {
    return {
      error: 'Error deleting book metadata'
    }
  }
}

export {
  fetchAllBookMetaData,
  fetchBookMetaDataByTitle
  , addBookMetaData, updateBookMetaData, deleteBookMetaData
};

