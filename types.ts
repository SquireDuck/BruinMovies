// types.ts
export interface Movie {
    title: string;
    year: number | string;
    rating: number | null;
    poster?: string; 
    imdbId: string; 
  }
  
  export interface WatchlistResponse {
    count: number;
    movies: Movie[];
  }
  
  export interface ApiError {
    error: string;
  }
  