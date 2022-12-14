import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../auth';
import { useProtectedResource, postWithCredentials } from '../data';
import { MessagesList } from '../messages';
import { RequestList, RequestsList } from '../requests';

export const GroupPage = () => {
  const [messageValue, setMessageValue] = useState('');
  const { id } = useParams();
  const { user } = useUser();
  const { data: group, setData: setGroup } = useProtectedResource(
    `/groups/${id}`,
    { owner: {}, messages: [], requests: [] }
  );

  const postMessage = async () => {
    const response = await postWithCredentials(`/groups/${id}/messages`, {
      text: messageValue
    });
    const updatedMessages = await response.json();
    setGroup({ ...group, messages: updatedMessages });
    setMessageValue('');
  };

  const handleAcceptRequest = async (requestId) => {
    const response = await postWithCredentials(
      `/groups/${id}/requests/${requestId}/accept`
    );

    const updatedRequests = await response.json();
    setGroup({ ...group, requests: updatedRequests });
  };

  const handleRejectRequest = async (requestId) => {
    const response = await postWithCredentials(
      `/groups/${id}/requests/${requestId}/reject`
    );

    const updatedRequests = await response.json();
    setGroup({ ...group, requests: updatedRequests });
  };

  return (
    <div className="centered-container">
      <h1>{group.name}</h1>
      <p>Owned by: {group.owner.fullName}</p>
      <MessagesList messages={group.messages} />
      <div className="new-message-form">
        <input
          type="text"
          placeholder="Type your message here..."
          value={messageValue}
          onChange={(e) => setMessageValue(e.target.value)}
        />
        <button onClick={postMessage}>Submit</button>
      </div>
      {group.ownerId === user.uid ? (
        <RequestsList
          requests={group.requests}
          onAccept={handleAcceptRequest}
          onReject={handleRejectRequest}
        />
      ) : null}
    </div>
  );
};
