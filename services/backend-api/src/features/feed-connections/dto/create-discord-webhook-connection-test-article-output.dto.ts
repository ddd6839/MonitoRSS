import { TestDeliveryStatus } from "../../../services/feed-handler/constants";

class ResultDto {
  status: TestDeliveryStatus;
  apiResponse?: unknown;
}

export class CreateDiscordWebhookConnectionTestArticleOutputDto {
  result: ResultDto;
}
