#!/usr/bin/env node
import axios from 'axios';
import { createInterface } from 'readline';

interface WordPressConfig {
  siteUrl: string;
  username: string;
  password: string;
}

interface WordPressError {
  message: string;
  code?: string;
}

type AxiosError = {
  response?: {
    data?: WordPressError;
  };
  message: string;
};

const isAxiosError = (error: unknown): error is AxiosError => {
  return error !== null && 
         typeof error === 'object' && 
         'message' in error &&
         (error as any).response !== undefined;
};

interface WordPressRequest {
  tool: 'create_post' | 'get_posts' | 'update_post';
  siteUrl: string;
  username: string;
  password: string;
  title?: string;
  content?: string;
  status?: 'draft' | 'publish' | 'private';
  postId?: number;
  perPage?: number;
  page?: number;
}

async function handleWordPressRequest(request: WordPressRequest) {
  try {
    const auth = Buffer.from(`${request.username}:${request.password}`).toString('base64');
    const client = axios.create({
      baseURL: `${request.siteUrl}/wp-json/wp/v2`,
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    switch (request.tool) {
      case 'create_post':
        if (!request.title || !request.content) {
          return {
            success: false,
            error: 'Title and content are required for creating a post',
          };
        }
        const createResponse = await client.post('/posts', {
          title: request.title,
          content: request.content,
          status: request.status || 'draft',
        });
        return {
          success: true,
          data: createResponse.data,
        };

      case 'get_posts':
        const getResponse = await client.get('/posts', {
          params: {
            per_page: request.perPage || 10,
            page: request.page || 1,
          },
        });
        return {
          success: true,
          data: getResponse.data,
        };

      case 'update_post':
        if (!request.postId) {
          return {
            success: false,
            error: 'Post ID is required for updating a post',
          };
        }
        const updateData: Record<string, any> = {};
        if (request.title) updateData.title = request.title;
        if (request.content) updateData.content = request.content;
        if (request.status) updateData.status = request.status;

        const updateResponse = await client.post(
          `/posts/${request.postId}`,
          updateData
        );
        return {
          success: true,
          data: updateResponse.data,
        };

      default:
        return {
          success: false,
          error: `Unknown tool: ${request.tool}`,
        };
    }
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      return {
        success: false,
        error: `WordPress API error: ${
          error.response?.data?.message || error.message
        }`,
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on('line', async (line) => {
  try {
    const request = JSON.parse(line) as WordPressRequest;
    const result = await handleWordPressRequest(request);
    console.log(JSON.stringify(result));
  } catch (error: unknown) {
    console.log(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }));
  }
});

process.on('SIGINT', () => {
  rl.close();
  process.exit(0);
});

console.error('WordPress server running on stdin/stdout');
