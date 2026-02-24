interface Props {
  slots: string[];
  selected: string;
  loading: boolean;
  onSelect: (time: string) => void;
}

export default function TimeSlotsSection({
  slots,
  selected,
  loading,
  onSelect
}: Props) {
  if (loading) {
    return <div className="text-sm mt-3">Carregando horários...</div>;
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
      {slots.map((slot) => {
        const active = slot === selected;

        return (
          <button
            key={slot}
            onClick={() => onSelect(slot)}
            className={`h-11 rounded-xl border text-sm font-medium transition
              ${active
                ? "bg-teal-600 text-white shadow-md"
                : "hover:border-teal-500 hover:text-teal-600"
              }`}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
}