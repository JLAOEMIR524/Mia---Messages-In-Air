interface ProfileTopperProps {
  initials: string;
  name: string;
  email: string;
  memberSince: string;
  postcardsSent: number;
  currentXp: number;
  progressPercent: number;
  onEdit?: () => void;
}

export function ProfileTopper({
  initials,
  name,
  email,
  memberSince,
  postcardsSent,
  currentXp,
  progressPercent,
  onEdit
}: ProfileTopperProps) {
  return (
    <div className="profileTopper">
      <div className="imageBlock">
        <div className="profileFrame">
          <p className="profileText">{initials}</p>
        </div>
        <button className="button button--image" onClick={onEdit}>
          <img alt="Edit icon" src="./icons/edit.svg" />
          Edit
        </button>
      </div>

      <div className="profile">
        <div className="profile-header-row">
          <hgroup className="profileInfos">
            <h3>{name}</h3>
            <p>Email: {email}</p>
            <p>Member Since: {memberSince}</p>
            <p>Postcards Sent {postcardsSent}</p>
          </hgroup>
          
          <button className="button button--image" onClick={onEdit}>
            <img aria-hidden="true" alt="Edit icon" src="./icons/edit.svg" />
            Edit
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