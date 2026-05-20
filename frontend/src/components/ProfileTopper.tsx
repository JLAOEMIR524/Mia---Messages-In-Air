import { useState } from "react";

interface ProfileTopperProps {
  initials: string;
  name?: string;
  email?: string;
  memberSince: string;
  postcardsSent: number;
  currentXp: number;
  progressPercent: number;
  onEdit?: (updatedData: {
    firstName: string;
    lastName: string;
    email: string;
  }) => void;
}

export function ProfileTopper({
  initials,
  name = "",
  email: initialEmail = "",
  memberSince,
  postcardsSent,
  currentXp,
  progressPercent,
  onEdit,
}: ProfileTopperProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Splits full name into first and last name
  const [firstName, setFirstName] = useState(() => name.split(" ")[0] || "");
  const [lastName, setLastName] = useState(
    () => name.split(" ").slice(1).join(" ") || "",
  );
  const [email, setEmail] = useState(initialEmail);

  // validation to prevent submitting empty fields
  const isInvalid = !firstName.trim() || !lastName.trim() || !email.trim();

  // Handles switching between edit mode and save mode
  const handleEditClick = () => {
    if (isEditing) {
      if (isInvalid) {
        setError(
          "Please fill out all required fields (First Name, Last Name, and Email).",
        );
        return;
      }

      // Send the updated profile data to the backend
      if (onEdit) {
        onEdit({ firstName, lastName, email });
      }
      setError(null);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="profileTopper">
      <div className="imageBlock">
        <div className="profileFrame">
          <p className="profileText">{initials}</p>
        </div>
        <button
          className="button button--image"
          onClick={handleEditClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-disabled={isEditing && isInvalid ? "true" : "false"}
          aria-label={
            isEditing
              ? isInvalid
                ? "Save profile (disabled, required fields are empty)"
                : "Save profile"
              : "Edit profile"
          }
          style={{
            opacity: isEditing && isInvalid ? 0.5 : 1,
            cursor: isEditing && isInvalid ? "not-allowed" : "pointer",
          }}
        >
          <img
            aria-hidden="true"
            alt=""
            src={
              isEditing
                ? isHovered
                  ? "./icons/save-blue.svg"
                  : "./icons/save-white.svg"
                : isHovered
                  ? "./icons/edit-blue.svg"
                  : "./icons/edit-white.svg"
            }
          />
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      <div className="profile">
        <div className="profile-header-row">
          <div
            className="profileInfos"
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            {/* rendering depending on whether edit mode is active */}
            {isEditing ? (
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-sm)",
                  flexDirection: "column",
                }}
              >
                {error && (
                  <p style={{ fontWeight: "bold" }} aria-live="assertive">
                    {error}
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "95%",
                  }}
                >
                  <label htmlFor="edit-firstname" className="editLabel">
                    First Name:
                  </label>
                  <input
                    id="edit-firstname"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    required
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "95%",
                  }}
                >
                  <label htmlFor="edit-lastname" className="editLabel">
                    Last Name:
                  </label>
                  <input
                    id="edit-lastname"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    required
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "95%",
                  }}
                >
                  <label htmlFor="edit-email" className="editLabel">
                    Email:
                  </label>
                  <input
                    id="edit-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                </div>
              </div>
            ) : (
              <>
                <p className="text-s">
                  {firstName || lastName
                    ? `${firstName} ${lastName}`
                    : "No Name"}
                </p>
                <p>Email: {email ? email : "N/A"}</p>
              </>
            )}

            <p>Member Since: {memberSince}</p>
            <p>Postcards Sent: {postcardsSent}</p>
          </div>

          <button
            className="button button--image"
            onClick={handleEditClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-disabled={isEditing && isInvalid ? "true" : "false"}
            aria-label={
              isEditing
                ? isInvalid
                  ? "Save profile (disabled, required fields are empty)"
                  : "Save profile"
                : "Edit profile"
            }
            style={{
              opacity: isEditing && isInvalid ? 0.5 : 1,
              cursor: isEditing && isInvalid ? "not-allowed" : "pointer",
            }}
          >
            <img
              aria-hidden="true"
              alt=""
              src={
                isEditing
                  ? isHovered
                    ? "./icons/save-blue.svg"
                    : "./icons/save-white.svg"
                  : isHovered
                    ? "./icons/edit-blue.svg"
                    : "./icons/edit-white.svg"
              }
            />
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>

        <div className="progress">
          <div className="progressTitle">
            <p>Your Progress</p>
            <p>{currentXp} XP</p>
          </div>
          <div className="progressBar">
            <div
              className="progressFill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
