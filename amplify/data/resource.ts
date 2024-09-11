import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";

const schema = a
  .schema({
    UserProfile: a
      .model({
        email: a.string().required(),
        profileOwner: a.string().required(),
        children: a.hasMany('Child', 'caretakers'),
        rewardsPunishmentsGifts: a.hasMany('RewardPunishmentGift', 'userProfile'),
      })
      .authorization((allow) => [allow.owner()]),

    Child: a
      .model({
        name: a.string().required(),
        caretakers: a.hasMany('UserProfile', 'children'),
        rules: a.hasMany('Rule', 'child'),
        timetableItems: a.hasMany('TimetableItem', 'child'),
        pointLogs: a.hasMany('PointLog', 'child'),
      })
      .authorization((allow) => [allow.owner(), allow.private().to(['read'])]),

    Rule: a
      .model({
        child: a.belongsTo('Child', 'rules'),
        text: a.string().required(),
        order: a.integer().required(),
      })
      .authorization((allow) => [allow.owner(), allow.private().to(['read'])]),

    TimetableItem: a
      .model({
        child: a.belongsTo('Child', 'timetableItems'),
        timeslot: a.string().required(),
        order: a.integer().required(),
        agendaItem: a.string().required(),
      })
      .authorization((allow) => [allow.owner(), allow.private().to(['read'])]),

    PointLog: a
      .model({
        child: a.belongsTo('Child', 'pointLogs'),
        date: a.date().required(),
        time: a.time().required(),
        points: a.integer().required(),
        action: a.string().required(),
      })
      .authorization((allow) => [allow.owner(), allow.private().to(['read'])]),

    RewardPunishmentGift: a
      .model({
        userProfile: a.belongsTo('UserProfile', 'rewardsPunishmentsGifts'),
        category: a.string().required(),
        points: a.integer().required(),
        description: a.string().required(),
        imageLink: a.string().required(),
      })
      .authorization((allow) => [allow.owner(), allow.private().to(['read'])]),
  })
  .authorization((allow) => [allow.resource(postConfirmation)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});