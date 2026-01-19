import { API_URL, ApiClient } from './base';
import { AuthApi } from './auth';
import { RestaurantsApi } from './restaurants';
import { MenusApi } from './menus';
import { ReservationsApi } from './reservations';
import { DayBlocksApi } from './dayblocks';
import { ServersApi } from './servers';
import { ClosuresApi } from './closures';
import { AdminApi } from './admin';

class UnifiedApiClient {
  private baseClient: ApiClient;
  public auth: AuthApi;
  public restaurants: RestaurantsApi;
  public menus: MenusApi;
  public reservations: ReservationsApi;
  public dayBlocks: DayBlocksApi;
  public servers: ServersApi;
  public closures: ClosuresApi;
  public admin: AdminApi;

  constructor(baseUrl: string) {
    this.baseClient = new ApiClient(baseUrl);
    this.auth = new AuthApi(baseUrl);
    this.restaurants = new RestaurantsApi(baseUrl);
    this.menus = new MenusApi(baseUrl);
    this.reservations = new ReservationsApi(baseUrl);
    this.dayBlocks = new DayBlocksApi(baseUrl);
    this.servers = new ServersApi(baseUrl);
    this.closures = new ClosuresApi(baseUrl);
    this.admin = new AdminApi(baseUrl);
  }

  // Delegate token and callback management to all modules
  setToken(token: string | null) {
    this.baseClient.setToken(token);
    this.auth.setToken(token);
    this.restaurants.setToken(token);
    this.menus.setToken(token);
    this.reservations.setToken(token);
    this.dayBlocks.setToken(token);
    this.servers.setToken(token);
    this.closures.setToken(token);
    this.admin.setToken(token);
  }

  setOnUnauthorized(callback: () => void) {
    this.baseClient.setOnUnauthorized(callback);
    this.auth.setOnUnauthorized(callback);
    this.restaurants.setOnUnauthorized(callback);
    this.menus.setOnUnauthorized(callback);
    this.reservations.setOnUnauthorized(callback);
    this.dayBlocks.setOnUnauthorized(callback);
    this.servers.setOnUnauthorized(callback);
    this.closures.setOnUnauthorized(callback);
    this.admin.setOnUnauthorized(callback);
  }

  // Delegate healthCheck to base client
  async healthCheck() {
    return this.baseClient.healthCheck();
  }

  // Legacy method compatibility - delegate to auth module
  async login(email: string, password: string) {
    return this.auth.login(email, password);
  }

  async logout() {
    return this.auth.logout();
  }

  async forgotPassword(email: string) {
    return this.auth.forgotPassword(email);
  }

  async resetPassword(token: string, newPassword: string) {
    return this.auth.resetPassword(token, newPassword);
  }

  async refreshToken() {
    return this.baseClient.refreshToken();
  }

  // Legacy method compatibility - delegate to restaurants module
  async getRestaurants(page?: number, limit?: number) {
    return this.restaurants.getRestaurants(page, limit);
  }

  async createRestaurant(data: any) {
    return this.restaurants.createRestaurant(data);
  }

  async getRestaurant(id: string) {
    return this.restaurants.getRestaurant(id);
  }

  async updateRestaurant(id: string, data: any) {
    return this.restaurants.updateRestaurant(id, data);
  }

  async deleteRestaurant(id: string) {
    return this.restaurants.deleteRestaurant(id);
  }

  async regenerateApiKey(id: string) {
    return this.restaurants.regenerateApiKey(id);
  }

  async createRestaurantUser(restaurantId: string, email: string, password: string) {
    return this.restaurants.createRestaurantUser(restaurantId, email, password);
  }

  async getRestaurantUsers(restaurantId: string) {
    return this.restaurants.getRestaurantUsers(restaurantId);
  }

  async updateUser(userId: string, data: any) {
    return this.restaurants.updateUser(userId, data);
  }

  async deleteUser(userId: string) {
    return this.restaurants.deleteUser(userId);
  }

  async getMyRestaurant() {
    return this.restaurants.getMyRestaurant();
  }

  async getDashboardStats() {
    return this.restaurants.getDashboardStats();
  }

  async updateBasicInfo(data: any) {
    return this.restaurants.updateBasicInfo(data);
  }

  async updateOpeningHours(data: any) {
    return this.restaurants.updateOpeningHours(data);
  }

  async updateTablesConfig(data: any) {
    return this.restaurants.updateTablesConfig(data);
  }

  async updateReservationConfig(data: any) {
    return this.restaurants.updateReservationConfig(data);
  }

  async generateMenuQrCode() {
    return this.restaurants.generateMenuQrCode();
  }

  // Legacy method compatibility - delegate to menus module
  async uploadMenuPdf(file: File) {
    return this.menus.uploadMenuPdf(file);
  }

  async switchMenuMode(displayMode: 'pdf' | 'detailed' | 'both') {
    return this.menus.switchMenuMode(displayMode);
  }

  async getCategories() {
    return this.menus.getCategories();
  }

  async createCategory(data: any) {
    return this.menus.createCategory(data);
  }

  async updateCategory(id: string, data: any) {
    return this.menus.updateCategory(id, data);
  }

  async deleteCategory(id: string) {
    return this.menus.deleteCategory(id);
  }

  async reorderCategories(categoryIds: string[]) {
    return this.menus.reorderCategories(categoryIds);
  }

  async getDishes(categoryId?: string) {
    return this.menus.getDishes(categoryId);
  }

  async createDish(data: any) {
    return this.menus.createDish(data);
  }

  async updateDish(id: string, data: any) {
    return this.menus.updateDish(id, data);
  }

  async deleteDish(id: string) {
    return this.menus.deleteDish(id);
  }

  async toggleDishAvailability(id: string) {
    return this.menus.toggleDishAvailability(id);
  }

  async uploadDishPhoto(id: string, file: File) {
    return this.menus.uploadDishPhoto(id, file);
  }

  async deleteDishPhoto(id: string) {
    return this.menus.deleteDishPhoto(id);
  }

  // Legacy method compatibility - delegate to reservations module
  async getReservations(params?: any) {
    return this.reservations.getReservations(params);
  }

  async getReservation(id: string) {
    return this.reservations.getReservation(id);
  }

  async createReservation(data: any) {
    return this.reservations.createReservation(data);
  }

  async updateReservation(id: string, data: any) {
    return this.reservations.updateReservation(id, data);
  }

  async deleteReservation(id: string) {
    return this.reservations.deleteReservation(id);
  }

  // Legacy method compatibility - delegate to dayBlocks module
  async getDayBlocks() {
    return this.dayBlocks.getDayBlocks();
  }

  async checkDayBlock(date: string) {
    return this.dayBlocks.checkDayBlock(date);
  }

  async createDayBlock(data: any) {
    return this.dayBlocks.createDayBlock(data);
  }

  async bulkCreateDayBlocks(data: any) {
    return this.dayBlocks.bulkCreateDayBlocks(data);
  }

  async deleteDayBlock(id: string) {
    return this.dayBlocks.deleteDayBlock(id);
  }

  // Legacy method compatibility - delegate to servers module
  async getServerUsers() {
    return this.servers.getServerUsers();
  }

  async createServerUser(data: any) {
    return this.servers.createServerUser(data);
  }

  async updateServerUser(id: string, data: any) {
    return this.servers.updateServerUser(id, data);
  }

  async deleteServerUser(id: string) {
    return this.servers.deleteServerUser(id);
  }

  // Legacy method compatibility - delegate to closures module
  async getClosures() {
    return this.closures.getClosures();
  }

  async createClosure(data: any) {
    return this.closures.createClosure(data);
  }

  async deleteClosure(id: string) {
    return this.closures.deleteClosure(id);
  }

  // Legacy method compatibility - delegate to admin module
  async getAdminDashboard() {
    return this.admin.getAdminDashboard();
  }

  async getRestaurantAnalytics(restaurantId: string, period?: string, startDate?: string, endDate?: string) {
    return this.admin.getRestaurantAnalytics(restaurantId, period, startDate, endDate);
  }

  async exportRestaurants() {
    return this.admin.exportRestaurants();
  }

  async exportUsers() {
    return this.admin.exportUsers();
  }

  async exportReservations() {
    return this.admin.exportReservations();
  }
}

export const apiClient = new UnifiedApiClient(API_URL);
