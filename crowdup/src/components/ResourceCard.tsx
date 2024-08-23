import React from "react";

interface Resource {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  resourceType: string;
  status?: string;
}

interface ResourceCardProps {
  resource: Resource;
  onUpdateStatus: (resourceId: string, newStatus: string) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onUpdateStatus,
}) => {
  const { firstName, lastName, email, phone, location, resourceType, status } =
    resource;

  const handleAccept = () => onUpdateStatus(resource._id, "accepted");
  const handleReject = () => onUpdateStatus(resource._id, "rejected");

  return (
    <div className="resource-card">
      <h3>
        {firstName} {lastName}
      </h3>
      <p>Email: {email}</p>
      <p>Phone: {phone}</p>
      <p>Location: {location}</p>
      <p>Type: {resourceType}</p>
      <p>Status: {status || "pending"}</p>
      <button onClick={handleAccept}>Accept</button>
      <button onClick={handleReject}>Reject</button>
    </div>
  );
};

export default ResourceCard;
