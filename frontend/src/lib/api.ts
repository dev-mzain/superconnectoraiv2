import {
  User,
  Connection,
  SearchRequest,
  SearchResult,
  SavedSearch,
  SearchHistory,
  FavoriteConnection,
  SearchFilters,
  GeneratedEmail
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// This is a placeholder for a more robust API client
// In a real app, you'd use something like Axios and have better error handling

export async function registerUser(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
    }
    return response.json();
}

export async function loginUser(email: string, password: string): Promise<{ access_token: string, token_type: string }> {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
    }
    return response.json();
}

export async function getUserProfile(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user profile');
    }
    return response.json();
}

export async function uploadConnectionsCSV(file: File, token: string): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/v1/connections/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'File upload failed');
    }
    return response.json();
}

export async function getConnections(token: string, page: number = 1, limit: number = 10, minRating?: number): Promise<Connection[]> {
    let url = `${API_BASE_URL}/api/v1/connections?page=${page}&limit=${limit}`;
    if (minRating) {
        url += `&min_rating=${minRating}`;
    }
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch connections');
    }
    return response.json();
}

export async function deleteConnections(token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/connections`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to delete connections');
    }
}

export async function getConnectionsCount(token: string): Promise<{ count: number }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/connections/count`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch connections count');
    }
    return response.json();
}

export async function searchConnections(searchRequest: SearchRequest, token: string): Promise<SearchResult[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(searchRequest),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Search failed');
    }
    return response.json() as Promise<SearchResult[]>;
}

// Saved Searches API
export async function createSavedSearch(name: string, query: string, filters: SearchFilters | undefined, token: string): Promise<SavedSearch> {
    const response = await fetch(`${API_BASE_URL}/api/v1/saved-searches`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, query, filters }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create saved search');
    }
    return response.json();
}

export async function getSavedSearches(token: string): Promise<SavedSearch[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/saved-searches`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch saved searches');
    }
    return response.json();
}

export async function getSavedSearch(searchId: string, token: string): Promise<SavedSearch> {
    const response = await fetch(`${API_BASE_URL}/api/v1/saved-searches/${searchId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch saved search');
    }
    return response.json();
}

export async function updateSavedSearch(searchId: string, updates: Partial<SavedSearch>, token: string): Promise<SavedSearch> {
    const response = await fetch(`${API_BASE_URL}/api/v1/saved-searches/${searchId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update saved search');
    }
    return response.json();
}

export async function deleteSavedSearch(searchId: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/saved-searches/${searchId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to delete saved search');
    }
}

// Search History API
export async function getSearchHistory(token: string, limit: number = 50): Promise<SearchHistory[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/search-history?limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch search history');
    }
    return response.json();
}

export async function deleteSearchHistoryEntry(searchId: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/search-history/${searchId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to delete search history entry');
    }
}

export async function clearSearchHistory(token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/search-history`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to clear search history');
    }
}

// Favorites API
export async function addFavoriteConnection(connectionId: string, token: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/favorites`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ connection_id: connectionId }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add favorite connection');
    }
    return response.json();
}

export async function removeFavoriteConnection(connectionId: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/favorites/${connectionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to remove favorite connection');
    }
}

export async function getFavoriteConnections(token: string): Promise<FavoriteConnection[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch favorite connections');
    }
    return response.json();
}

export async function checkFavoriteStatus(connectionId: string, token: string): Promise<{ is_favorited: boolean }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/favorites/${connectionId}/check`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to check favorite status');
    }
    return response.json();
}

export async function getFavoritesCount(token: string): Promise<{ count: number }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/favorites/count`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch favorites count');
    }
    return response.json();
}

export async function clearPineconeData(token: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/pinecone/namespace/clear`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to clear pinecone data');
    }
    return response.json();
}

export async function generateEmail(connectionId: string, reason: string, token: string): Promise<GeneratedEmail> {
    const response = await fetch(`${API_BASE_URL}/api/v1/generated-emails`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ connection_id: connectionId, reason_for_connecting: reason, generated_content: "" }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate email');
    }
    return response.json();
}

export async function getGeneratedEmails(token: string): Promise<GeneratedEmail[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/generated-emails`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch generated emails');
    }
    return response.json();
}

export async function searchConnectionsWithProgress(
    searchRequest: SearchRequest,
    token: string,
    onProgress: (progress: number) => void
): Promise<SearchResult[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/search/progress`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(searchRequest),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Search failed');
    }

    if (!response.body) {
        throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    return new Promise<SearchResult[]>((resolve, reject) => {
        async function processStream() {
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.substring(6));
                            if (data.error) {
                                reject(new Error(data.error));
                                return;
                            }
                            if (data.progress !== undefined) {
                                onProgress(data.progress);
                            }
                            if (data.results) {
                                resolve(data.results);
                                return;
                            }
                        } catch (e) {
                            console.error("Failed to parse stream data:", line, e);
                        }
                    }
                }
            }
        }
        processStream().catch(reject);
    });
}