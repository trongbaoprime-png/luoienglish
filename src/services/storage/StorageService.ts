export class StorageService {
  public static getPublicAssetUrl(path: string): string {
    return path.startsWith("/") ? path : `/${path}`;
  }
}
