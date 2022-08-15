import { Link } from "react-router-dom";
import { GroupDetails } from "../types";
import { CreateGroup } from "./CreateGroup";
import { JoinGroup } from "./JoinGroup";

interface HomeProps {
  groups: GroupDetails[];
  listMyGroups: () => void;
  joinOrCreate: (data: {
    action: string;
    groupName?: string;
    groupId?: string;
  }) => void;
}

export const Home = ({ groups, listMyGroups, joinOrCreate }: HomeProps) => {
  const joinGroup = ({
    action,
    groupId,
  }: {
    action: string;
    groupId: string;
  }) => {
    joinOrCreate({
      action,
      groupId,
    });
  };
  const createGroup = ({
    action,
    groupName,
  }: {
    action: string;
    groupName: string;
  }) => {
    joinOrCreate({
      action,
      groupName,
    });
  };

  return (
    <div>
      <div>
        <JoinGroup onSubmit={joinGroup} />
        <CreateGroup onSubmit={createGroup} />
      </div>
      {groups.map(({ groupName, groupId }) => {
        return (
          <div>
            <h2>{groupName}</h2>
            <Link to={`group/${groupId}`}>Open Chat</Link>
          </div>
        );
      })}
      <button onClick={listMyGroups}>Refresh Group</button>
    </div>
  );
};
