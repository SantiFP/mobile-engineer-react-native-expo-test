export interface Message {
  id: string;

  text: string;

  type: "text" | "image";

  username: string;

  timestamp: string;

  isAutoResponse: boolean;

  imageUrl?: string;

  imageName?: string;

  imageSize?: number;

  replyTo?: string;

  uri?: string;
  
  name?: string;
}

export interface SendMessageResponse {
  data: Message;
}
