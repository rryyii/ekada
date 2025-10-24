import { sequelize } from "../util/database.js"
import { DataTypes } from "sequelize";

const MatchSchedule = sequelize.define(
  'MatchSchedule',
  {
    WinTeam: {
      type: DataTypes.STRING,
    },
    Winner: {
      type: DataTypes.STRING,
    },
    Name: {
      type: DataTypes.STRING,
    },
    Team1: {
      type: DataTypes.STRING,
    },
    Team1Bans: {
      type: DataTypes.STRING,
    },
    Team1Picks: {
      type: DataTypes.STRING,
    },
    Team1Score: {
      type: DataTypes.INTEGER,
    },
    Team1Dragons: {
      type: DataTypes.INTEGER,
    },
    Team2Dragons: {
      type: DataTypes.INTEGER,
    },
    Team1Barons: {
      type: DataTypes.INTEGER,
    },
    Team2Barons: {
      type: DataTypes.INTEGER,
    },
    Team1VoidGrubs: {
      type: DataTypes.INTEGER,
    },
    Team2VoidGrubs: {
      type: DataTypes.INTEGER,
    },
    Team1Towers: {
      type: DataTypes.INTEGER,
    },
    Team2Towers: {
      type: DataTypes.INTEGER,
    },
    Team1RiftHeralds: {
      type: DataTypes.INTEGER,
    },
    Team2RiftHeralds: {
      type: DataTypes.INTEGER,
    },
    OverviewPage: {
      type: DataTypes.STRING,
    },
    Team1Atakhans: {
      type: DataTypes.INTEGER,
    },
    Team2Atakhans: {
      type: DataTypes.INTEGER,
    },
    Team1Gold: {
      type: DataTypes.INTEGER,
    },
    Team2Gold: {
      type: DataTypes.INTEGER,
    },
    Team2: {
      type: DataTypes.STRING,
    },
    Team2Bans: {
      type: DataTypes.STRING,
    },
    Team2Picks: {
      type: DataTypes.STRING,
    },
    Team2Score: {
      type: DataTypes.INTEGER,
    },
    Split: {
      type: DataTypes.STRING,
    },
    DateTime_UTC: {
      type: DataTypes.DATE,
    },
    Gamelength: {
      type: DataTypes.FLOAT,
    },
    Patch: {
      type: DataTypes.STRING,
    },
    VOD: {
      type: DataTypes.STRING,
    },
    MatchId: {
      type: DataTypes.STRING,
    },
  },
);

export default MatchSchedule;
