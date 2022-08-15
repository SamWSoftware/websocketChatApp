export interface GroupDetails {
  groupId: string;
  groupName: string;
}

export type Message = UserMessage | InfoMessage | GroupDataMessage;

export interface InfoMessage {
  type: "info";
  message: string;
}
export interface GroupDataMessage {
  type: "groupData";
  data: GroupDetails[];
}

export interface UserMessage {
  type: "message";
  message: string;
  from: string;
  date: number;
  mine?: boolean;
}

export interface MessageHistory {
  messages: UserMessage[];
}
