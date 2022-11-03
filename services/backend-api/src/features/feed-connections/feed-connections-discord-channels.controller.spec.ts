import { Types } from "mongoose";
import { FeedConnectionType } from "../feeds/constants";
import { FeedConnectionsDiscordChannelsService } from "./feed-connections-discord-channels.service";
// eslint-disable-next-line max-len
import { FeedConnectionsDiscordChannelsController } from "./feed-connections-discord-channels.controller";
import { FeedEmbed } from "../feeds/entities/feed-embed.entity";

describe("FeedConnectionsDiscordChannelsController", () => {
  let feedConnectionsDiscordChannelsService: FeedConnectionsDiscordChannelsService;
  let controller: FeedConnectionsDiscordChannelsController;

  beforeEach(async () => {
    jest.resetAllMocks();
    feedConnectionsDiscordChannelsService = {
      createDiscordChannelConnection: jest.fn(),
      updateDiscordChannelConnection: jest.fn(),
      deleteConnection: jest.fn(),
    } as never;
    controller = new FeedConnectionsDiscordChannelsController(
      feedConnectionsDiscordChannelsService
    );
  });

  describe("createDiscordChannelConnection", () => {
    it("returns the discord channel connection", async () => {
      const channelId = "channelId";
      const name = "name";
      const accessToken = "accessToken";
      const connection = {
        id: new Types.ObjectId(),
        name,
        filters: {
          expression: {},
        },
        details: {
          type: FeedConnectionType.DiscordChannel,
          channel: {
            id: channelId,
          },
          embeds: [],
          content: "content",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(
          feedConnectionsDiscordChannelsService,
          "createDiscordChannelConnection"
        )
        .mockResolvedValue(connection);

      const result = await controller.createDiscordChannelConnection(
        {
          _id: new Types.ObjectId(),
        } as never,
        {
          channelId,
          name,
        },
        {
          access_token: accessToken,
        } as never
      );

      expect(result).toEqual({
        id: connection.id.toHexString(),
        name: connection.name,
        key: FeedConnectionType.DiscordChannel,
        filters: {
          expression: {},
        },
        details: {
          channel: {
            id: connection.details.channel.id,
          },
          embeds: connection.details.embeds,
          content: connection.details.content,
        },
      });
    });
  });

  describe("updateDiscordChannelConnection", () => {
    it("flattens the input embed before passing it to the service", async () => {
      const name = "name";
      const feedId = new Types.ObjectId();
      const connectionId = new Types.ObjectId();
      const guildId = "guildId";
      const channelId = "channelId";
      const connection = {
        id: new Types.ObjectId(),
        name,
        filters: {
          expression: {},
        },
        details: {
          type: FeedConnectionType.DiscordChannel,
          channel: {
            id: channelId,
          },
          embeds: [],
          content: "content",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateSpy = jest
        .spyOn(
          feedConnectionsDiscordChannelsService,
          "updateDiscordChannelConnection"
        )
        .mockResolvedValue(connection);

      await controller.updateDiscordChannelConnection(
        {
          feed: {
            _id: feedId,
            guild: guildId,
          },
          connection: {
            id: connectionId,
          },
        } as never,
        {
          embeds: [
            {
              title: "title",
              description: "description",
              url: "url",
              color: "0",
              timestamp: "now",
              footer: {
                text: "footerText",
                iconUrl: "footerIconUrl",
              },
              image: {
                url: "imageUrl",
              },
              thumbnail: {
                url: "thumbnailUrl",
              },
              author: {
                name: "authorName",
                iconUrl: "authorIconUrl",
                url: "authorUrl",
              },
              fields: [
                {
                  name: "fieldName",
                  value: "fieldValue",
                  inline: true,
                },
              ],
            },
          ],
        },
        {
          access_token: "accessToken",
        } as never
      );

      const expectedEmbed: FeedEmbed = {
        title: "title",
        description: "description",
        url: "url",
        color: "0",
        timestamp: "now",
        footerText: "footerText",
        footerIconURL: "footerIconUrl",
        imageURL: "imageUrl",
        thumbnailURL: "thumbnailUrl",
        authorName: "authorName",
        authorIconURL: "authorIconUrl",
        authorURL: "authorUrl",
        fields: [
          {
            name: "fieldName",
            value: "fieldValue",
            inline: true,
          },
        ],
      };

      expect(updateSpy).toHaveBeenCalledWith(
        feedId.toHexString(),
        connectionId.toHexString(),
        {
          accessToken: "accessToken",
          guildId,
          updates: {
            name: undefined,
            filters: undefined,
            details: {
              content: undefined,
              embeds: [expectedEmbed],
              channel: undefined,
            },
          },
        }
      );
    });
  });

  describe("deleteDiscordChannelConnection", () => {
    const feedId = new Types.ObjectId();
    const connectionId = new Types.ObjectId();
    const pipeOutput = {
      feed: {
        _id: feedId,
      },
      connection: {
        id: connectionId,
      },
    };

    it("calls the service to delete the connection", async () => {
      await controller.deleteDiscordChannelConnection(pipeOutput as never);

      expect(
        feedConnectionsDiscordChannelsService.deleteConnection
      ).toHaveBeenCalledWith(feedId.toHexString(), connectionId.toHexString());
    });

    it("returns undefined", async () => {
      const result = await controller.deleteDiscordChannelConnection(
        pipeOutput as never
      );

      expect(result).toBeUndefined();
    });
  });
});