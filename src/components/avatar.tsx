import "./Avatar.css";

export const Avatar = ({ fullName }: { fullName: string }) => (
  <div className="tooltip circleWithText">
    {fullName[0].toUpperCase()}

    <span className="tooltiptext">{fullName}</span>
  </div>
);
