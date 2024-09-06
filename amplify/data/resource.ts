import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";

const schema = a
  .schema({
    UserProfile: a
      .model({
        email: a.string(),
        profileOwner: a.string(),
        children: a.hasMany('Child'),
        rewardsPunishmentsGifts: a.hasMany('RewardPunishmentGift'),
      })
      .authorization((allow) => [
        allow.ownerDefinedIn("profileOwner"),
      ]),

    Child: a
      .model({
        name: a.string(),
        caretakers: a.manyToMany('UserProfile', 'ChildCaretaker'),
        rules: a.hasMany('Rule'),
        timetableItems: a.hasMany('TimetableItem'),
        pointLogs: a.hasMany('PointLog'),
      })
      .authorization((allow) => [
        allow.owner(),
        allow.private(),
      ]),

    ChildCaretaker: a
      .model({
        child: a.belongsTo('Child'),
        caretaker: a.belongsTo('UserProfile'),
        relationship: a.string(), // e.g., "parent", "grandparent", "uncle"
      })
      .authorization((allow) => [
        allow.owner(),
        allow.private(),
      ]),

    Rule: a
      .model({
        child: a.belongsTo('Child'),
        text: a.string(),
        order: a.integer(),
      })
      .authorization((allow) => [
        allow.owner(),
        allow.private(),
      ]),

    TimetableItem: a
      .model({
        child: a.belongsTo('Child'),
        timeslot: a.string(),
        order: a.integer(),
        agendaItem: a.string(),
      })
      .authorization((allow) => [
        allow.owner(),
        allow.private(),
      ]),

    PointLog: a
      .model({
        child: a.belongsTo('Child'),
        date: a.date(),
        time: a.time(),
        points: a.integer(),
        action: a.string(),
      })
      .authorization((allow) => [
        allow.owner(),
        allow.private(),
      ]),

    RewardPunishmentGift: a
      .model({
        userProfile: a.belongsTo('UserProfile'),
        category: a.string(), // "reward", "punishment", or "gift"
        points: a.integer(),
        description: a.string(),
        imageLink: a.string(),
      })
      .authorization((allow) => [
        allow.owner(),
        allow.private(),
      ]),
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