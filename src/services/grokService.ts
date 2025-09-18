import axios from 'axios';

const grokApiKey = import.meta.env.VITE_GROK_API_KEY;
const grokApiUrl = 'https://api.groq.com/openai/v1/chat/completions'; // Using GroqCloud endpoint

export interface SearchFilters {
  searchTerm?: string;
  category?: 'Technology' | 'Cultural' | 'Sports' | 'Academic' | 'Professional';
  status?: 'upcoming' | 'ongoing' | 'completed';
  dateRange?: 'today' | 'this_week' | 'next_week' | 'this_month';
}

class GrokService {
  private isConfigured(): boolean {
    return !!(grokApiKey && grokApiKey !== 'YOUR_API_KEY');
  }

  async parseSearchQuery(query: string): Promise<SearchFilters> {
    if (!this.isConfigured()) {
      console.warn("Grok API not configured. Falling back to basic search.");
      return { searchTerm: query };
    }

    const systemPrompt = `
      You are an intelligent search assistant for a university event platform called "Gettogather".
      Your task is to analyze a user's natural language query and convert it into a structured JSON object of search filters.

      The available filter parameters are:
      - "searchTerm": A string for general keyword matching in the title or description.
      - "category": Must be one of the following exact values: 'Technology', 'Cultural', 'Sports', 'Academic', 'Professional'.
      - "status": Must be one of 'upcoming', 'ongoing', 'completed'.
      - "dateRange": Must be one of 'today', 'this_week', 'next_week', 'this_month'.

      Rules:
      1. Analyze the user query for keywords, categories, and time references.
      2. Map time references like "this week" or "next month" to the correct "dateRange" value.
      3. Map event types like "hackathon" or "workshop" to the correct "category".
      4. If a query is "find sports events", the category is 'Sports'.
      5. If a query is "hackathons next week", the category is 'Technology' and dateRange is 'next_week'.
      6. If no specific filters can be extracted, use the entire query as the "searchTerm".
      7. Always return a valid JSON object, even if it's empty {}.

      Example Queries:
      - User: "tech workshops this week" -> {"searchTerm": "workshop", "category": "Technology", "dateRange": "this_week"}
      - User: "upcoming cultural festivals" -> {"category": "Cultural", "status": "upcoming"}
      - User: "football match" -> {"searchTerm": "football", "category": "Sports"}
      - User: "career fairs this month" -> {"category": "Professional", "dateRange": "this_month"}
      - User: "annual day" -> {"searchTerm": "annual day"}
    `;

    try {
      const response = await axios.post(
        grokApiUrl,
        {
          model: 'llama3-8b-8192', // A capable and fast model available on Groq
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Analyze this query: "${query}"` }
          ],
          temperature: 0.2,
          response_format: { type: "json_object" },
        },
        {
          headers: {
            'Authorization': `Bearer ${grokApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices[0]?.message?.content;
      if (content) {
        return JSON.parse(content) as SearchFilters;
      }
      return { searchTerm: query }; // Fallback
    } catch (error) {
      console.error("Error calling Grok API:", error);
      // Fallback to basic search on API error
      return { searchTerm: query };
    }
  }
}

export const grokService = new GrokService();
