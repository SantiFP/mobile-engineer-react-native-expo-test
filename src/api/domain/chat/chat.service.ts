import Paginated from "../../types/paginated";
import ChatRepository from "./chat.repository";
import { Message, SendMessageResponse } from "./chat.types";

export default class ChatService {
  private readonly chatRepository: ChatRepository;

  constructor() {
    this.chatRepository = new ChatRepository();
  }

  public async getEvents(
    limit: number,
    offset: number
  ): Promise<Paginated<Message>> {
    const chats = await this.chatRepository.getEvents<Message>(limit, offset);


    return chats;
  }

  public async sendTextMessage(text: string): Promise<SendMessageResponse> {
    const message =
      await this.chatRepository.sendTextMessage<SendMessageResponse>(text);

    return message;
  }
}
