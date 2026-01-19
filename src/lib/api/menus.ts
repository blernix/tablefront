import { ApiClient } from './base';
import {
  MenuCategory,
  CreateCategoryInput,
  UpdateCategoryInput,
  Dish,
  CreateDishInput,
  UpdateDishInput,
} from '@/types';

export class MenusApi extends ApiClient {
  // PDF Upload
  async uploadMenuPdf(file: File): Promise<{
    message: string;
    menu: {
      displayMode: 'pdf' | 'detailed';
      pdfUrl?: string;
    };
  }> {
    const formData = new FormData();
    formData.append('pdf', file);

    const headers: Record<string, string> = {};

    if (this['token']) {
      headers['Authorization'] = `Bearer ${this['token']}`;
    }

    const response = await fetch(`${this.baseUrl}/api/restaurant/menu/pdf`, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'An error occurred');
    }

    return data;
  }

  // Menu Mode
  async switchMenuMode(displayMode: 'pdf' | 'detailed' | 'both'): Promise<{
    message: string;
    menu: {
      displayMode: 'pdf' | 'detailed' | 'both';
      pdfUrl?: string;
    };
  }> {
    return this.request('/api/restaurant/menu/mode', {
      method: 'PUT',
      body: JSON.stringify({ displayMode }),
    });
  }

  // Menu Categories
  async getCategories(): Promise<{ categories: MenuCategory[] }> {
    return this.request('/api/menu/categories');
  }

  async createCategory(data: CreateCategoryInput): Promise<{ category: MenuCategory }> {
    return this.request('/api/menu/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: UpdateCategoryInput): Promise<{ category: MenuCategory }> {
    return this.request(`/api/menu/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string): Promise<void> {
    return this.request(`/api/menu/categories/${id}`, {
      method: 'DELETE',
    });
  }

  async reorderCategories(categoryIds: string[]): Promise<{ categories: MenuCategory[] }> {
    return this.request('/api/menu/categories/reorder', {
      method: 'PUT',
      body: JSON.stringify({ categoryIds }),
    });
  }

  // Menu Dishes
  async getDishes(categoryId?: string): Promise<{ dishes: Dish[] }> {
    const query = categoryId ? `?categoryId=${categoryId}` : '';
    return this.request(`/api/menu/dishes${query}`);
  }

  async createDish(data: CreateDishInput): Promise<{ dish: Dish }> {
    return this.request('/api/menu/dishes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDish(id: string, data: UpdateDishInput): Promise<{ dish: Dish }> {
    return this.request(`/api/menu/dishes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDish(id: string): Promise<void> {
    return this.request(`/api/menu/dishes/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleDishAvailability(id: string): Promise<{ dish: Dish }> {
    return this.request(`/api/menu/dishes/${id}/toggle-availability`, {
      method: 'PATCH',
    });
  }

  async uploadDishPhoto(id: string, file: File): Promise<{ dish: Dish }> {
    return this.uploadFile(`/api/menu/dishes/${id}/photo`, file, 'photo');
  }

  async deleteDishPhoto(id: string): Promise<{ dish: Dish }> {
    return this.request(`/api/menu/dishes/${id}/photo`, {
      method: 'DELETE',
    });
  }
}
