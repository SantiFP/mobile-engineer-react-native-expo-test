import { authService } from "../../../services/authService";
import { HttpService } from "../../baseRepositories/api/http/axios/axios-http-service";
import ApiRepository from "../../baseRepositories/api/respository";
import { ContentType, RequestData } from "../../http/Http";
import Paginated from "../../types/paginated";

export default class ChatRepository extends ApiRepository {
  constructor() {
    super("messages");
  }
  public async getEvents<T>(
    limit: number,
    offset: number
  ): Promise<Paginated<T>> {
    const token = await authService.getToken();

    const headers = {
      "Content-Type": ContentType.JSON,
      Authorization: `Bearer ${token}`, // ✅ token en formato correcto
    };
    const data: RequestData = {
      endpoint: `${this.endpoint}`,
      params: { limit, offset },
      headers,
    };

    try {
      const result = await HttpService.getAsync(data);
      return result;
    } catch (error) {
      console.error("Error en HttpService.getAsync:", error);
      throw error;
    }
  }

  public async sendTextMessage<T>(text: string): Promise<T> {
    const data: RequestData = {
      endpoint: `${this.endpoint}/send-text`,
      body: { text },
    };

    return HttpService.postAsync(data);
  }

  public async sendImageMessage<T>(): Promise<T> {
    const data: RequestData = {
      endpoint: `${this.endpoint}/send-text`,
    };

    return HttpService.postAsync(data);
  }
}
