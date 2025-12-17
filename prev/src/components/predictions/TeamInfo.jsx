import FormBadge from "./PredictionList";

export default function TeamInfo({ team, form }) {
  return (
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center gap-2">
        <img src={team.logo} alt={team.name} className="w-5 h-5 md:w-6 md:h-6" />
        <span>{team.name}</span>
      </div>
      <div className="flex gap-1">
        {form?.split("").map((char, i) => (
          <FormBadge key={i} result={char} />
        ))}
      </div>
    </div>
  );
}
