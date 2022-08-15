import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar } from "../components/avatar";
import { Modal } from "../components/Modal";
import { Message, MessageHistory, UserMessage } from "../types";
import API from "../utils/API";

export const MessageInterface = ({
  messages,
  sendMessage,
  setInitialMessages,
  handleRequest,
}: {
  messages: Record<string, Message[]>;
  sendMessage: ({
    message,
    groupId,
  }: {
    message: string;
    groupId: string;
  }) => void;
  setInitialMessages: ({
    initialMessages,
    groupId,
  }: {
    initialMessages: Message[];
    groupId: string;
  }) => void;
  handleRequest: ({
    action,
    requestId,
    groupId,
    userId,
  }: {
    action: "acceptJoinRequest" | "rejectJoinRequest";
    requestId: string;
    groupId: string;
    userId: string;
  }) => void;
}) => {
  const { id } = useParams();
  const groupId = id as string;

  const [groupDetails, setGroupDetails] = useState<GroupDetails>({
    groupName: "loading",
    id: groupId,
    ownerId: "",
    members: [],
  });

  const [reply, setReply] = useState("");

  const submit = () => {
    sendMessage({ message: reply, groupId: id! });
    setReply("");
  };

  const fetchGroupInitial = async () => {
    // get group members
    const groupDetails = await API.get<GroupDetails>({
      path: `/group/${groupId}`,
    });
    setGroupDetails(groupDetails);
    // get recent messages
    fetchMessages({});
  };

  const fetchMessages = async ({
    lastToken,
    count = 10,
  }: {
    lastToken?: string;
    count?: number;
  }) => {
    let path = `/messages/${groupId}`;
    if (lastToken || count) {
      path += "?";
      if (lastToken) {
        path += `startFromKey=${lastToken}&`;
      }
      if (count) {
        path += `count`;
      }
    }
    const messagesRes = await API.get<MessageHistory>({
      path,
    });
    console.log(messagesRes);
    setInitialMessages({
      initialMessages: [...messagesRes.messages, ...(messages[groupId] || [])],
      groupId,
    });
  };

  useEffect(() => {
    fetchGroupInitial();
  }, []);

  useEffect(() => {
    const elements = document.getElementsByClassName("messageView")!;
    console.log({ elements });
    setTimeout(() => {
      elements[0].scrollTop = elements[0].scrollHeight;
    }, 50);
  }, [messages]);

  const handleRequestAndClean = ({
    action,
    requestId,
  }: {
    action: "acceptJoinRequest" | "rejectJoinRequest";
    requestId: string;
  }) => {
    const requestIdx = groupDetails.joinRequests?.findIndex(
      (jr) => jr.id === requestId
    );
    const request = groupDetails.joinRequests?.[requestIdx || 0];
    if (!request) {
      return;
    }
    handleRequest({
      action,
      requestId,
      userId: request.userId,
      groupId: request.groupId,
    });
    let remainingInvites = groupDetails.joinRequests;
    remainingInvites?.splice(requestIdx || 0, 1);
    setGroupDetails({
      ...groupDetails,
      joinRequests: remainingInvites,
    });
  };

  return (
    <div className="messageInterface">
      <div>
        <h2>{groupDetails.groupName}</h2>
        <div>
          {groupDetails.members.map((member, i) => (
            <Avatar key={i} fullName={member.userName} />
          ))}
          <JoinRequests
            joinRequests={groupDetails.joinRequests}
            handleRequest={handleRequestAndClean}
          />
        </div>
      </div>
      <div className="messageView">
        {(messages[id!] || []).map((data) => {
          console.log({ messageData: data });
          if (data.type == "message" && data.mine) {
            return <div className={`message right`}>{data.message}</div>;
          } else {
            const { from, message } = data as UserMessage;
            return (
              <div className={`message left`}>{`${from} - ${message}`}</div>
            );
          }
        })}
      </div>
      <div className="messsageInput">
        <input
          type="text"
          onChange={(e) => setReply(e.target.value)}
          value={reply}
        />
        <button onClick={() => submit()}>Send</button>
      </div>
    </div>
  );
};

interface GroupDetails {
  groupName: string;
  id: string;
  ownerId: string;
  members: {
    userId: string;
    userName: string;
  }[];

  joinRequests?: {
    userId: string;
    groupId: string;
    userName: string;
    id: string;
  }[];
}

const JoinRequests = ({
  joinRequests,
  handleRequest,
}: {
  joinRequests?: GroupDetails["joinRequests"];
  handleRequest: ({
    action,
    requestId,
  }: {
    action: "acceptJoinRequest" | "rejectJoinRequest";
    requestId: string;
  }) => void;
}) => {
  const [showJoinRequests, setShowJoinRequests] = useState(false);

  if (joinRequests && joinRequests.length > 0) {
    return (
      <>
        <Modal
          show={showJoinRequests}
          handleClose={() => setShowJoinRequests(false)}
        >
          <p>There are some users who want to join the group</p>
          <div>
            {joinRequests.map(
              ({ userName, id: requestId, userId, groupId }) => (
                <div>
                  <span>{userName}</span>
                  <button
                    onClick={() =>
                      handleRequest({
                        action: "acceptJoinRequest",
                        requestId,
                      })
                    }
                  >
                    Accept
                  </button>
                  <button>Reject</button>
                </div>
              )
            )}
          </div>
        </Modal>
        <button
          onClick={() => setShowJoinRequests(true)}
          style={{ marginLeft: "15px" }}
        >
          View Group Requests
        </button>
      </>
    );
  }
  return null;
};
